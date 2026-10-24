#!/usr/bin/env python3
"""stream_probe.py: measure what a user feels when they call an LLM.

Streams a chat completion from any OpenAI-compatible server (Ollama, llama.cpp's
llama-server, vLLM, SGLang, ...) and records when every chunk arrives. From
those timestamps it reports:

  TTFT   time to first token     request sent -> first content chunk
  ITL    inter-token latency     gap between consecutive content chunks
  TPS    decode tokens/second    (output_tokens - 1) / (last chunk - first chunk)
  E2E    end-to-end latency      request sent -> stream finished

Standard library only, so it runs with any Python 3.9+, no install needed.

Examples
  python3 stream_probe.py                              # one request to Ollama
  python3 stream_probe.py --runs 5                     # 5 measured runs + summary
  python3 stream_probe.py --experiment prompt-length   # short vs long prompt
  python3 stream_probe.py --experiment output-length   # short vs long answer
  python3 stream_probe.py --experiment cold-start      # Ollama only: unload, then reload
  python3 stream_probe.py --server-timings             # Ollama only: compare with server's own clock
  python3 stream_probe.py --base-url http://localhost:8080/v1 --model any   # llama-server
"""
from __future__ import annotations

import argparse
import http.client
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid

DEFAULT_BASE_URL = "http://localhost:11434/v1"  # Ollama's OpenAI-compatible API
DEFAULT_MODEL = "llama3.2"
DEFAULT_PROMPT = "Explain what a load balancer does, in about 150 words."


# ---------------------------------------------------------------- statistics
def percentile(values: list[float], q: float) -> float:
    """q in [0, 100]. Linear interpolation between closest ranks."""
    if not values:
        return float("nan")
    s = sorted(values)
    if len(s) == 1:
        return s[0]
    k = (len(s) - 1) * q / 100.0
    lo, hi = int(k), min(int(k) + 1, len(s) - 1)
    return s[lo] + (s[hi] - s[lo]) * (k - lo)


def mean(values: list[float]) -> float:
    return sum(values) / len(values) if values else float("nan")


# ---------------------------------------------------------------- prompts
def long_document(n_facts: int) -> str:
    """A deterministic, boring document. Each fact line is ~20 tokens."""
    colors = ["blue", "green", "red", "amber", "violet", "silver", "black"]
    items = ["widgets", "gears", "valves", "sensors", "cables", "panels", "pumps"]
    lines = []
    for i in range(1, n_facts + 1):
        lines.append(
            f"Fact {i}: warehouse {i % 17 + 1} holds {(i * 37) % 900 + 100} "
            f"{colors[i % 7]} {items[(i * 3) % 7]} on shelf {(i * 11) % 50 + 1}."
        )
    return "\n".join(lines)


def build_messages(prompt: str, cache_bust: bool) -> list[dict]:
    # Most servers reuse work for a prompt prefix they have already seen
    # ("prefix caching", Lesson 19). A random tag at the very start of the
    # system message makes every request look new, so we measure a cold
    # prefill instead of a cache hit. Use --no-cache-bust to see the difference.
    system = "You are a concise, helpful assistant."
    if cache_bust:
        system = f"[request {uuid.uuid4().hex[:12]}] " + system
    return [{"role": "system", "content": system}, {"role": "user", "content": prompt}]


# ---------------------------------------------------------------- HTTP
def post_stream(url: str, payload: dict, timeout: float = 600.0):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        url, data=data, headers={"Content-Type": "application/json", "Accept": "text/event-stream"}
    )
    try:
        return urllib.request.urlopen(req, timeout=timeout)
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")[:500]
        sys.exit(f"\nServer returned HTTP {e.code} for {url}\n{body}\n")
    except (urllib.error.URLError, ConnectionError, http.client.HTTPException) as e:
        host = urllib.parse.urlsplit(url).netloc
        sys.exit(
            f"\nCould not connect to {host} ({e}).\n"
            "Is the model server running? For Ollama: open the Ollama app or run `ollama serve`.\n"
        )


def stream_openai(base_url: str, model: str, messages: list[dict], max_tokens: int,
                  temperature: float, seed: int, extra: dict | None = None) -> dict:
    """One streamed chat completion via the OpenAI-compatible API.
    Reasoning models stream their thinking in a separate field; it is kept in the
    returned text wrapped in <think>...</think>, so callers can tell it apart."""
    payload = {
        "model": model,
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": temperature,
        "seed": seed,
        "stream": True,
        "stream_options": {"include_usage": True},  # ask for exact token counts at the end
        **(extra or {}),
    }
    t0 = time.perf_counter()
    resp = post_stream(base_url.rstrip("/") + "/chat/completions", payload)
    chunk_times: list[float] = []
    text_parts: list[str] = []
    usage = None
    thinking = False
    for raw in resp:  # Server-Sent Events: one "data: {...}" line per chunk
        line = raw.decode("utf-8", errors="replace").strip()
        if not line.startswith("data:"):
            continue
        body = line[5:].strip()
        if body == "[DONE]":
            break
        try:
            chunk = json.loads(body)
        except json.JSONDecodeError:
            continue
        if chunk.get("usage"):
            usage = chunk["usage"]
        for choice in chunk.get("choices") or []:
            delta = choice.get("delta") or {}
            thought = delta.get("reasoning_content") or delta.get("reasoning")
            piece = delta.get("content")
            if thought:
                if not thinking:
                    text_parts.append("<think>")
                    thinking = True
                chunk_times.append(time.perf_counter())
                text_parts.append(thought)
            if piece:
                if thinking:
                    text_parts.append("</think>")
                    thinking = False
                chunk_times.append(time.perf_counter())
                text_parts.append(piece)
    if thinking:
        text_parts.append("</think>")
    t_end = time.perf_counter()
    resp.close()
    return summarize(t0, chunk_times, t_end, "".join(text_parts),
                     (usage or {}).get("prompt_tokens"), (usage or {}).get("completion_tokens"))


def stream_ollama_native(host: str, model: str, messages: list[dict], max_tokens: int,
                         temperature: float, seed: int) -> dict:
    """Same request through Ollama's native /api/chat, which also reports the
    server's own timings (in nanoseconds) in its final message."""
    payload = {
        "model": model,
        "messages": messages,
        "stream": True,
        "options": {"num_predict": max_tokens, "temperature": temperature, "seed": seed},
    }
    t0 = time.perf_counter()
    resp = post_stream(host.rstrip("/") + "/api/chat", payload)
    chunk_times, text_parts, final = [], [], {}
    for raw in resp:  # newline-delimited JSON
        line = raw.decode("utf-8", errors="replace").strip()
        if not line:
            continue
        msg = json.loads(line)
        piece = (msg.get("message") or {}).get("content")
        if piece:
            chunk_times.append(time.perf_counter())
            text_parts.append(piece)
        if msg.get("done"):
            final = msg
            break
    t_end = time.perf_counter()
    resp.close()
    r = summarize(t0, chunk_times, t_end, "".join(text_parts),
                  final.get("prompt_eval_count"), final.get("eval_count"))
    ns = 1e-6  # nanoseconds -> milliseconds
    r["server"] = {
        "load_ms": final.get("load_duration", 0) * ns,
        "prefill_ms": final.get("prompt_eval_duration", 0) * ns,
        "decode_ms": final.get("eval_duration", 0) * ns,
        "total_ms": final.get("total_duration", 0) * ns,
        "prompt_tokens": final.get("prompt_eval_count"),
        "cached_prompt_tokens": final.get("prompt_eval_cached_count"),
        "output_tokens": final.get("eval_count"),
    }
    return r


def summarize(t0, chunk_times, t_end, text, prompt_tokens, completion_tokens) -> dict:
    ms = 1000.0
    if not chunk_times:
        return {"error": "no content received", "e2e_ms": (t_end - t0) * ms}
    itls = [(b - a) * ms for a, b in zip(chunk_times, chunk_times[1:])]
    out_tokens = completion_tokens or len(chunk_times)
    decode_s = chunk_times[-1] - chunk_times[0]
    return {
        "ttft_ms": (chunk_times[0] - t0) * ms,
        "e2e_ms": (t_end - t0) * ms,
        "itl_ms": itls,
        "itl_mean_ms": mean(itls),
        "itl_p50_ms": percentile(itls, 50),
        "itl_p95_ms": percentile(itls, 95),
        "decode_tps": (out_tokens - 1) / decode_s if decode_s > 0 else float("nan"),
        "chunks": len(chunk_times),
        "prompt_tokens": prompt_tokens,
        "output_tokens": out_tokens,
        "tokens_counted_by": "server" if completion_tokens else "chunks (approx.)",
        "text": text,
    }


def unload_ollama(host: str, model: str) -> None:
    """Ask Ollama to evict the model from memory (keep_alive=0)."""
    data = json.dumps({"model": model, "keep_alive": 0}).encode()
    req = urllib.request.Request(host.rstrip("/") + "/api/generate", data=data,
                                 headers={"Content-Type": "application/json"})
    try:
        urllib.request.urlopen(req, timeout=60).read()
    except Exception as e:  # noqa: BLE001 (best effort)
        print(f"(could not unload model: {e})")
    time.sleep(1.0)


# ---------------------------------------------------------------- reporting
def fmt(x, nd=0):
    if x is None:
        return "-"
    if isinstance(x, float) and x != x:  # NaN
        return "-"
    return f"{x:,.{nd}f}"


def print_run(i, r, label=""):
    if "error" in r:
        print(f"  run {i}: ERROR {r['error']}")
        return
    print(f"  run {i}{(' ' + label) if label else ''}: TTFT {fmt(r['ttft_ms'])} ms | "
          f"ITL mean {fmt(r['itl_mean_ms'], 1)} ms (p95 {fmt(r['itl_p95_ms'], 1)}) | "
          f"decode {fmt(r['decode_tps'], 1)} tok/s | E2E {fmt(r['e2e_ms'])} ms | "
          f"tokens in/out {fmt(r['prompt_tokens'])}/{fmt(r['output_tokens'])}")


def summary_row(name, runs):
    ok = [r for r in runs if "error" not in r]
    return {
        "name": name,
        "n": len(ok),
        "prompt_tokens": ok[0]["prompt_tokens"] if ok else None,
        "output_tokens": round(mean([r["output_tokens"] for r in ok])) if ok else None,
        "ttft_p50": percentile([r["ttft_ms"] for r in ok], 50),
        "itl_mean": mean([r["itl_mean_ms"] for r in ok]),
        "tps": mean([r["decode_tps"] for r in ok]),
        "e2e_p50": percentile([r["e2e_ms"] for r in ok], 50),
    }


def print_table(rows):
    hdr = f"  {'condition':<14}{'prompt tok':>11}{'output tok':>11}{'TTFT p50 ms':>13}{'ITL mean ms':>13}{'decode tok/s':>14}{'E2E p50 ms':>12}"
    print(hdr)
    print("  " + "-" * (len(hdr) - 2))
    for r in rows:
        print(f"  {r['name']:<14}{fmt(r['prompt_tokens']):>11}{fmt(r['output_tokens']):>11}"
              f"{fmt(r['ttft_p50']):>13}{fmt(r['itl_mean'], 1):>13}{fmt(r['tps'], 1):>14}{fmt(r['e2e_p50']):>12}")


def print_markdown(rows, model):
    print(f"\nMarkdown (paste into portfolio/LOG.md), model `{model}`:\n")
    print("| condition | prompt tok | output tok | TTFT p50 (ms) | ITL mean (ms) | decode tok/s | E2E p50 (ms) |")
    print("|---|---:|---:|---:|---:|---:|---:|")
    for r in rows:
        print(f"| {r['name']} | {fmt(r['prompt_tokens'])} | {fmt(r['output_tokens'])} | {fmt(r['ttft_p50'])} | "
              f"{fmt(r['itl_mean'], 1)} | {fmt(r['tps'], 1)} | {fmt(r['e2e_p50'])} |")


def ratio_line(rows, key, label):
    a, b = rows[0][key], rows[-1][key]
    if a and b and a == a and b == b and a > 0:
        print(f"  {label}: {rows[0]['name']} -> {rows[-1]['name']} changed {b / a:.2f}x")


# ---------------------------------------------------------------- main
def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--base-url", default=DEFAULT_BASE_URL, help="OpenAI-compatible base URL (default: Ollama)")
    p.add_argument("--model", default=DEFAULT_MODEL)
    p.add_argument("--prompt", default=DEFAULT_PROMPT)
    p.add_argument("--max-tokens", type=int, default=200)
    p.add_argument("--runs", type=int, default=1, help="measured runs per condition")
    p.add_argument("--warmup", type=int, default=1, help="unmeasured warm-up runs first")
    p.add_argument("--temperature", type=float, default=0.0)
    p.add_argument("--seed", type=int, default=7)
    p.add_argument("--experiment", choices=["single", "prompt-length", "output-length", "cold-start"],
                   default="single")
    p.add_argument("--no-cache-bust", action="store_true", help="let the server reuse cached prompt prefixes")
    p.add_argument("--server-timings", action="store_true",
                   help="Ollama only: use the native API and print the server's own timings")
    p.add_argument("--show-text", action="store_true", help="print the generated text")
    p.add_argument("--json", metavar="FILE", help="save every run (incl. raw ITLs) to FILE")
    p.add_argument("--md", action="store_true", help="also print the summary as a markdown table")
    a = p.parse_args()

    host = a.base_url.rstrip("/").removesuffix("/v1")
    cache_bust = not a.no_cache_bust

    def call(prompt, max_tokens):
        msgs = build_messages(prompt, cache_bust)
        if a.server_timings:
            return stream_ollama_native(host, a.model, msgs, max_tokens, a.temperature, a.seed)
        return stream_openai(a.base_url, a.model, msgs, max_tokens, a.temperature, a.seed)

    if a.experiment == "single":
        conditions = [("default", a.prompt, a.max_tokens)]
    elif a.experiment == "prompt-length":
        q = "\n\nIn three sentences, what kinds of items are stored in these warehouses?"
        conditions = [
            ("short prompt", "Here is one fact.\n" + long_document(1) + q, 120),
            ("long prompt", "Here are many facts.\n" + long_document(80) + q, 120),
        ]
    elif a.experiment == "output-length":
        conditions = [
            ("short answer", "Write a story about a lighthouse keeper.", 40),
            ("long answer", "Write a story about a lighthouse keeper.", 320),
        ]
    else:  # cold-start
        conditions = [("cold (unloaded)", a.prompt, 60), ("warm (loaded)", a.prompt, 60)]

    print(f"\nstream_probe | server {a.base_url} | model {a.model} | experiment {a.experiment} | "
          f"cache-bust {'on' if cache_bust else 'off'}{' | server timings on' if a.server_timings else ''}")
    all_results, rows = {}, []
    for name, prompt, max_tokens in conditions:
        print(f"\n[{name}] max_tokens={max_tokens}")
        runs = []
        if a.experiment == "cold-start":
            if name.startswith("cold"):
                unload_ollama(host, a.model)
                print("  (model unloaded; this request includes loading it again)")
            n_warm, n_runs = 0, 1
        else:
            n_warm, n_runs = a.warmup, a.runs
        for w in range(n_warm):
            r = call(prompt, max_tokens)
            print_run(f"w{w + 1}", r, "(warm-up, not counted)")
        for i in range(n_runs):
            r = call(prompt, max_tokens)
            runs.append(r)
            print_run(i + 1, r)
            if a.server_timings and "server" in r:
                s = r["server"]
                cached = f" | prompt tokens read from cache {s['cached_prompt_tokens']}" if s.get("cached_prompt_tokens") is not None else ""
                print(f"         server clock: load {fmt(s['load_ms'])} ms | prefill {fmt(s['prefill_ms'])} ms "
                      f"| decode {fmt(s['decode_ms'])} ms | total {fmt(s['total_ms'])} ms{cached}")
            if a.show_text and "text" in r:
                print("  " + r["text"].replace("\n", "\n  "))
        rows.append(summary_row(name, runs))
        all_results[name] = runs

    if len(rows) > 1 or a.runs > 1:
        print("\nSummary")
        print_table(rows)
    if len(rows) == 2:
        print()
        ratio_line(rows, "prompt_tokens", "prompt tokens")
        ratio_line(rows, "output_tokens", "output tokens")
        ratio_line(rows, "ttft_p50", "TTFT        ")
        ratio_line(rows, "itl_mean", "ITL         ")
        ratio_line(rows, "e2e_p50", "E2E         ")
    if a.md:
        print_markdown(rows, a.model)
    tok_src = {r.get("tokens_counted_by") for runs in all_results.values() for r in runs}
    if "chunks (approx.)" in tok_src:
        print("\nnote: server did not report token usage; tokens were estimated from stream chunks.")

    if a.json:
        for runs in all_results.values():
            for r in runs:
                r.pop("text", None)
        with open(a.json, "w") as f:
            json.dump({"args": vars(a), "summary": rows, "runs": all_results}, f, indent=1)
        print(f"\nsaved raw results to {a.json}")
    print()


if __name__ == "__main__":
    main()

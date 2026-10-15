#!/usr/bin/env python3
"""load_test.py: what happens to latency when many users arrive at once.

Sends many streaming requests at the same time to any OpenAI-compatible server
and reports, for each concurrency level:

  TTFT p50/p95/p99    time to first token, as percentiles across requests
  E2E  p50/p95/p99    end-to-end latency, as percentiles across requests
  ITL  mean           average gap between tokens, inside each stream
  decode TPS          per-user stream speed (1000 / ITL), averaged over requests
  throughput          output tokens per second for the whole server
  RPS                 completed requests per second

Two load shapes:
  closed loop (default)  C virtual users; each sends its next request as soon
                         as its previous one finishes. "C users chatting."
  open loop (--rate R)   new requests arrive at random times, R per second on
                         average, whether or not earlier ones have finished.
                         "Traffic from the internet." See the Lesson 2 notes on
                         coordinated omission for why the two shapes differ.

Builds on stream_probe.py (same folder): every request is one streamed call,
timed chunk by chunk. Standard library only.

Examples
  python3 load_test.py                                  # sweep concurrency 1,2,4,8
  python3 load_test.py --concurrency 1,4 --requests 16  # fewer levels, fewer requests
  python3 load_test.py --label np4 --csv                # label the run, print CSV for plotting
  python3 load_test.py --rate 0.5 --requests 30         # open loop: 0.5 requests/s
  python3 load_test.py --base-url http://localhost:8080/v1 --model any   # llama-server
"""
from __future__ import annotations

import argparse
import json
import os
import random
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from stream_probe import (  # noqa: E402  (same folder)
    DEFAULT_BASE_URL, DEFAULT_MODEL, build_messages, fmt, mean, percentile, stream_openai,
)

# A prompt that reliably writes past max_tokens, so every request produces the
# same number of output tokens and runs are comparable.
DEFAULT_PROMPT = ("Write a long, detailed story about a lighthouse keeper who finds a "
                  "message in a bottle. Keep going; do not stop early.")


def one_request(a, worker: int) -> dict:
    """One timed streaming request. Never raises: errors become {'error': ...}."""
    t_start = time.perf_counter()
    try:
        r = stream_openai(a.base_url, a.model, build_messages(a.prompt, not a.no_cache_bust),
                          a.max_tokens, a.temperature, a.seed)
    except BaseException as e:  # noqa: BLE001  (stream_probe exits on HTTP errors)
        r = {"error": str(e) or e.__class__.__name__}
    r["start"] = t_start
    r["end"] = time.perf_counter()
    r["worker"] = worker
    r.pop("text", None)
    return r


def run_closed_loop(a, concurrency: int, n_requests: int) -> tuple[list[dict], float]:
    """C workers; each takes the next request number until n_requests are sent."""
    lock = threading.Lock()
    counter = {"next": 0}
    results: list[dict] = []

    def worker(w: int):
        while True:
            with lock:
                if counter["next"] >= n_requests:
                    return
                counter["next"] += 1
            r = one_request(a, w)
            with lock:
                results.append(r)
                done = len(results)
            progress(done, n_requests)

    t0 = time.perf_counter()
    threads = [threading.Thread(target=worker, args=(w,), daemon=True) for w in range(concurrency)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    return results, time.perf_counter() - t0


def run_open_loop(a, rate: float, n_requests: int) -> tuple[list[dict], float]:
    """Poisson arrivals at `rate` requests/s. Each request starts at its own
    scheduled time, even if the server is still busy with earlier ones."""
    # Random (exponential) gaps make arrivals bursty, like real traffic. With few
    # requests the random draw can be far from the asked-for rate, so rescale the
    # gaps: still bursty, but the average rate is exactly `rate`.
    rng = random.Random(a.seed)
    gaps = [rng.expovariate(rate) for _ in range(max(n_requests - 1, 1))]
    scale = (len(gaps) / rate) / sum(gaps)
    gaps = [g * scale for g in gaps]
    results: list[dict] = []
    lock = threading.Lock()
    t0 = time.perf_counter()
    with ThreadPoolExecutor(max_workers=min(n_requests, 256)) as pool:
        futures, t_next = [], t0
        for i in range(n_requests):
            delay = t_next - time.perf_counter()
            if delay > 0:
                time.sleep(delay)
            futures.append(pool.submit(one_request, a, i))
            if i < len(gaps):
                t_next += gaps[i]
        for f in futures:
            r = f.result()
            with lock:
                results.append(r)
                progress(len(results), n_requests)
    return results, time.perf_counter() - t0


def progress(done: int, total: int) -> None:
    if sys.stderr.isatty():
        sys.stderr.write(f"\r  {done}/{total} requests done")
        sys.stderr.flush()
        if done == total:
            sys.stderr.write("\r" + " " * 30 + "\r")


def summarize_level(label: str, load: str, results: list[dict], wall_s: float) -> dict:
    ok = [r for r in results if "error" not in r]
    ttft = [r["ttft_ms"] for r in ok]
    e2e = [r["e2e_ms"] for r in ok]
    out_tokens = sum(r["output_tokens"] or 0 for r in ok)
    return {
        "label": label,
        "load": load,
        "requests": len(results),
        "errors": len(results) - len(ok),
        "out_tok": round(mean([r["output_tokens"] for r in ok])) if ok else None,
        "ttft_p50": percentile(ttft, 50), "ttft_p95": percentile(ttft, 95), "ttft_p99": percentile(ttft, 99),
        "e2e_p50": percentile(e2e, 50), "e2e_p95": percentile(e2e, 95), "e2e_p99": percentile(e2e, 99),
        "itl_mean": mean([r["itl_mean_ms"] for r in ok]),
        "itl_p95": percentile([x for r in ok for x in r["itl_ms"]], 95),
        "decode_tps": mean([r["decode_tps"] for r in ok]),
        "throughput": out_tokens / wall_s if wall_s > 0 else float("nan"),
        "rps": len(ok) / wall_s if wall_s > 0 else float("nan"),
        "wall_s": wall_s,
    }


def print_level(s: dict) -> None:
    err = f" | {s['errors']} ERRORS" if s["errors"] else ""
    print(f"  TTFT p50/p95/p99 {fmt(s['ttft_p50'])} / {fmt(s['ttft_p95'])} / {fmt(s['ttft_p99'])} ms | "
          f"ITL mean {fmt(s['itl_mean'], 1)} ms | decode {fmt(s['decode_tps'], 1)} tok/s per user")
    print(f"  E2E  p50/p95/p99 {fmt(s['e2e_p50'])} / {fmt(s['e2e_p95'])} / {fmt(s['e2e_p99'])} ms | "
          f"throughput {fmt(s['throughput'], 1)} tok/s | {fmt(s['rps'], 2)} req/s | "
          f"{s['requests']} requests in {fmt(s['wall_s'], 1)} s{err}")


def print_table(rows: list[dict]) -> None:
    hdr = (f"  {'load':<8}{'TTFT p50':>10}{'p95':>8}{'p99':>8}{'ITL ms':>8}{'tok/s/user':>12}"
           f"{'E2E p50':>10}{'p99':>8}{'throughput':>12}{'req/s':>7}")
    print(hdr)
    print("  " + "-" * (len(hdr) - 2))
    for r in rows:
        print(f"  {r['load']:<8}{fmt(r['ttft_p50']):>10}{fmt(r['ttft_p95']):>8}{fmt(r['ttft_p99']):>8}"
              f"{fmt(r['itl_mean'], 1):>8}{fmt(r['decode_tps'], 1):>12}{fmt(r['e2e_p50']):>10}"
              f"{fmt(r['e2e_p99']):>8}{fmt(r['throughput'], 1):>12}{fmt(r['rps'], 2):>7}")


CSV_FIELDS = ["label", "load", "requests", "ttft_p50", "ttft_p95", "ttft_p99", "itl_mean",
              "decode_tps", "e2e_p50", "e2e_p95", "e2e_p99", "throughput", "rps"]


def print_csv(rows: list[dict]) -> None:
    print("\nCSV (paste into the Lesson 2 plotter, or a spreadsheet):\n")
    print(",".join(CSV_FIELDS))
    for r in rows:
        print(",".join(str(r[k]) if not isinstance(r[k], float) else
                       (f"{r[k]:.2f}" if k == "rps" else f"{r[k]:.1f}") for k in CSV_FIELDS))


def print_markdown(rows: list[dict], model: str) -> None:
    print(f"\nMarkdown (paste into portfolio/LOG.md), model `{model}`, run `{rows[0]['label']}`:\n")
    print("| load | TTFT p50 | TTFT p95 | TTFT p99 | ITL mean | tok/s per user | E2E p50 | E2E p99 | throughput tok/s | req/s |")
    print("|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|")
    for r in rows:
        print(f"| {r['load']} | {fmt(r['ttft_p50'])} | {fmt(r['ttft_p95'])} | {fmt(r['ttft_p99'])} | "
              f"{fmt(r['itl_mean'], 1)} | {fmt(r['decode_tps'], 1)} | {fmt(r['e2e_p50'])} | {fmt(r['e2e_p99'])} | "
              f"{fmt(r['throughput'], 1)} | {fmt(r['rps'], 2)} |")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--base-url", default=DEFAULT_BASE_URL, help="OpenAI-compatible base URL (default: Ollama)")
    p.add_argument("--model", default=DEFAULT_MODEL)
    p.add_argument("--prompt", default=DEFAULT_PROMPT)
    p.add_argument("--max-tokens", type=int, default=128)
    p.add_argument("--concurrency", default="1,2,4,8", help="comma-separated levels for the closed-loop sweep")
    p.add_argument("--rate", type=float, help="open loop instead: average new requests per second")
    p.add_argument("--requests", type=int, default=24, help="requests per level (more = steadier p99)")
    p.add_argument("--label", default="run", help="a name for this run, e.g. np1 or np4")
    p.add_argument("--temperature", type=float, default=0.0)
    p.add_argument("--seed", type=int, default=7)
    p.add_argument("--no-cache-bust", action="store_true", help="let the server reuse cached prompt prefixes")
    p.add_argument("--csv", action="store_true", help="also print CSV for plotting")
    p.add_argument("--md", action="store_true", help="also print a markdown table")
    p.add_argument("--json", metavar="FILE", help="save the summary and every request (incl. raw ITLs) to FILE")
    a = p.parse_args()

    if a.rate:
        plan = [("open", f"{a.rate:g}/s", a.rate)]
    else:
        levels = [int(x) for x in a.concurrency.split(",") if x.strip()]
        plan = [("closed", f"C={c}", c) for c in levels]

    print(f"\nload_test | server {a.base_url} | model {a.model} | label {a.label} | "
          f"max_tokens {a.max_tokens} | {a.requests} requests per level | "
          f"cache-bust {'off' if a.no_cache_bust else 'on'}")
    print("\nwarm-up request (not counted)...")
    w = one_request(a, -1)
    if "error" in w:
        sys.exit(f"warm-up failed: {w['error']}")
    print(f"  TTFT {fmt(w['ttft_ms'])} ms | ITL mean {fmt(w['itl_mean_ms'], 1)} ms | "
          f"{fmt(w['output_tokens'])} output tokens")
    if w["output_tokens"] and w["output_tokens"] < a.max_tokens * 0.8:
        print(f"  note: the answer stopped at {w['output_tokens']} of {a.max_tokens} tokens. "
              "Lengths will vary, so compare throughput with care.")

    rows, raw = [], {}
    for kind, name, value in plan:
        if kind == "closed":
            print(f"\n[{name}] {value} users, each sending its next request when the last one finishes")
            results, wall = run_closed_loop(a, value, a.requests)
        else:
            print(f"\n[{name}] open loop: random arrivals, {value:g} requests/s on average")
            results, wall = run_open_loop(a, value, a.requests)
        s = summarize_level(a.label, name, results, wall)
        print_level(s)
        rows.append(s)
        raw[name] = results

    print("\nSummary (latencies in ms; throughput in output tok/s for the whole server)")
    print_table(rows)
    if len(rows) > 1 and rows[0]["throughput"] == rows[0]["throughput"]:
        first, last = rows[0], rows[-1]
        print(f"\n  {first['load']} -> {last['load']}: throughput x{last['throughput'] / first['throughput']:.2f}, "
              f"TTFT p50 x{last['ttft_p50'] / first['ttft_p50']:.1f}, ITL x{last['itl_mean'] / first['itl_mean']:.2f}, "
              f"E2E p50 x{last['e2e_p50'] / first['e2e_p50']:.2f}")
    n = a.requests
    print(f"\n  note: with {n} requests per level, p99 is basically your slowest request "
          f"(you need >= 100 for p99 to mean '1 in 100').")
    if a.csv:
        print_csv(rows)
    if a.md:
        print_markdown(rows, a.model)
    if a.json:
        with open(a.json, "w") as f:
            json.dump({"args": vars(a), "summary": rows, "requests": raw}, f, indent=1)
        print(f"\nsaved raw results to {a.json}")
    print()


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""mini_eval.py: is this model good enough, fast enough and cheap enough for my app?

Runs a small task set (JSON) against one or more models on any OpenAI-compatible
server and grades every answer with automatic checks, the "unit tests" level of
evaluation (Hamel Husain, "Your AI Product Needs Evals"). For each model it reports:

  pass         tasks passed / total, and per task kind (classify, extract, ...)
  E2E p50/p95  end-to-end latency per request, as percentiles across tasks
  TTFT p50     time to first token
  out tok      mean output tokens per request (thinking tokens included)
  decode TPS   per-user stream speed
  $/1k req     optional: cost per 1,000 requests at the prices you pass

Then it prints every failure with the model's raw answer, because the numbers
only tell you *that* a model fails; the answers tell you *why*.

Reasoning models: Qwen3 thinks out loud before it answers. The checks only grade
the answer, not the thinking, but the thinking still costs tokens and time. Add
"+nothink" to a model name to send reasoning_effort "none", which switches the
thinking off (e.g. qwen3:1.7b+nothink). Checked on Ollama 0.40; Qwen3's old
" /no_think" prompt switch no longer works there.

Builds on stream_probe.py (same folder). Standard library only.

Examples
  python3 labs/tools/mini_eval.py                                   # llama3.2 vs qwen3:1.7b+nothink
  python3 labs/tools/mini_eval.py --models llama3.2,qwen3:1.7b,qwen3:1.7b+nothink
  python3 labs/tools/mini_eval.py --only triage-arabic,reply-arabic # a few tasks
  python3 labs/tools/mini_eval.py --price-in 0.10 --price-out 0.40  # add $/1k requests
  python3 labs/tools/mini_eval.py --save labs/0003-mini-eval/results.jsonl
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from stream_probe import DEFAULT_BASE_URL, fmt, mean, percentile, stream_openai  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_TASKS = os.path.join(HERE, "..", "0003-mini-eval", "tasks.json")
DEFAULT_MODELS = "llama3.2,qwen3:1.7b+nothink"

THINK_RE = re.compile(r"<think>.*?(</think>|$)", re.S)
EMOJI_RE = re.compile("[\U0001F300-\U0001FAFF☀-➿]")
ARABIC_RE = re.compile("[؀-ۿ]")
LATIN_RE = re.compile("[A-Za-z]")
NUMBER_RE = re.compile(r"-?\d+(?:[.,]\d+)?")


# ---------------------------------------------------------------- checks
def answer_part(text: str) -> str:
    """Drop the <think>...</think> block: we grade the answer, not the thinking."""
    return THINK_RE.sub("", text).strip()


def normalize(s: str) -> str:
    return re.sub(r"[^a-z0-9_]", "", s.lower())


def first_json(s: str):
    """Parse the first {...} object in s (models love wrapping JSON in ``` fences)."""
    start = s.find("{")
    while start != -1:
        depth = 0
        for i in range(start, len(s)):
            depth += {"{": 1, "}": -1}.get(s[i], 0)
            if depth == 0:
                try:
                    return json.loads(s[start:i + 1])
                except json.JSONDecodeError:
                    break
        start = s.find("{", start + 1)
    return None


def run_check(check: dict, ans: str) -> str | None:
    """Return None if the check passes, else a short reason."""
    t = check["type"]
    if t == "exact":
        return None if normalize(ans) == normalize(check["value"]) else f"expected '{check['value']}'"
    if t == "number":
        nums = NUMBER_RE.findall(ans.replace(",", ""))
        if not nums:
            return "no number in answer"
        if len(nums) > 1:
            return f"expected one number, got {len(nums)}"
        return None if abs(float(nums[0]) - check["value"]) < 1e-6 else f"expected {check['value']}"
    if t == "json":
        obj = first_json(ans)
        if not isinstance(obj, dict):
            return "no valid JSON object"
        for k, v in check["fields"].items():
            if str(obj.get(k, "")).strip().lower() != str(v).lower():
                return f"{k}: expected '{v}', got '{obj.get(k)}'"
        return None
    if t == "max_words":
        n = len(ans.split())
        return None if n <= check["value"] else f"{n} words > {check['value']}"
    if t == "contains_any":
        return None if any(w in ans.lower() for w in check["value"]) else f"none of {check['value']}"
    if t == "no_emoji":
        return "contains an emoji" if EMOJI_RE.search(ans) else None
    if t == "arabic_only":
        if not ARABIC_RE.search(ans):
            return "no Arabic text"
        return "contains Latin letters" if LATIN_RE.search(ans) else None
    return f"unknown check type '{t}'"


def grade(task: dict, text: str) -> list[str]:
    ans = answer_part(text)
    if not ans:
        return ["empty answer (out of tokens while thinking?)"]
    return [r for c in task["checks"] if (r := run_check(c, ans))]


# ---------------------------------------------------------------- running
def parse_model(spec: str) -> tuple[str, dict]:
    """'qwen3:1.7b+nothink' -> ('qwen3:1.7b', {'reasoning_effort': 'none'})."""
    if spec.endswith("+nothink"):
        return spec[: -len("+nothink")], {"reasoning_effort": "none"}
    return spec, {}


def warm_up(a, model: str) -> None:
    """Load the model before timing, so the first task doesn't pay the load time."""
    stream_openai(a.base_url, model, [{"role": "user", "content": "Hi"}], 1, 0.0, a.seed)


def eval_model(a, spec: str, suite: dict, tasks: list[dict]) -> list[dict]:
    model, extra = parse_model(spec)
    print(f"\n== {spec} ==  ({len(tasks)} tasks)", flush=True)
    warm_up(a, model)
    rows = []
    for t in tasks:
        messages = [{"role": "system", "content": suite.get("system", "")},
                    {"role": "user", "content": t["prompt"]}]
        r = stream_openai(a.base_url, model, messages, a.max_tokens, a.temperature, a.seed, extra)
        text = r.get("text", "")
        reasons = grade(t, text) if "error" not in r else [r["error"]]
        row = {"model": spec, "task": t["id"], "kind": t.get("kind", "task"),
               "pass": not reasons, "reasons": reasons, "answer": answer_part(text),
               "thought": len(text) - len(answer_part(text)) > 20,
               "ttft_ms": r.get("ttft_ms"), "e2e_ms": r.get("e2e_ms"),
               "prompt_tokens": r.get("prompt_tokens"), "output_tokens": r.get("output_tokens"),
               "decode_tps": r.get("decode_tps")}
        rows.append(row)
        mark = "PASS" if row["pass"] else "FAIL"
        print(f"  {mark}  {t['id']:<16} {fmt(row['e2e_ms']):>7} ms  {row['output_tokens'] or 0:>5} tok", flush=True)
    return rows


# ---------------------------------------------------------------- report
def summarize(a, spec: str, rows: list[dict]) -> dict:
    ok = lambda xs: [x for x in xs if isinstance(x, (int, float))]  # noqa: E731
    e2e, ttft = ok([r["e2e_ms"] for r in rows]), ok([r["ttft_ms"] for r in rows])
    s = {"model": spec, "passed": sum(r["pass"] for r in rows), "total": len(rows),
         "e2e_p50": percentile(e2e, 50), "e2e_p95": percentile(e2e, 95),
         "ttft_p50": percentile(ttft, 50),
         "in_tok": mean(ok([r["prompt_tokens"] for r in rows])),
         "out_tok": mean(ok([r["output_tokens"] for r in rows])),
         "tps": mean(ok([r["decode_tps"] for r in rows]))}
    s["cost_1k"] = ((s["in_tok"] * a.price_in + s["out_tok"] * a.price_out) / 1e6 * 1000
                    if a.price_in or a.price_out else None)
    kinds = {}
    for r in rows:
        p, n = kinds.get(r["kind"], (0, 0))
        kinds[r["kind"]] = (p + r["pass"], n + 1)
    s["kinds"] = kinds
    return s


def print_report(a, summaries: list[dict], rows: list[dict]) -> None:
    print("\n" + "=" * 78)
    head = f"{'model':<22}{'pass':>7}{'E2E p50':>9}{'E2E p95':>9}{'TTFT p50':>9}{'out tok':>8}{'dec TPS':>8}"
    if summaries and summaries[0]["cost_1k"] is not None:
        head += f"{'$/1k req':>10}"
    print(head)
    for s in summaries:
        line = (f"{s['model']:<22}{s['passed']:>3}/{s['total']:<3}{fmt(s['e2e_p50']):>9}"
                f"{fmt(s['e2e_p95']):>9}{fmt(s['ttft_p50']):>9}{fmt(s['out_tok']):>8}{fmt(s['tps']):>8}")
        if s["cost_1k"] is not None:
            line += f"{s['cost_1k']:>10.4f}"
        print(line)
    print("(latency in ms; out tok includes any <think> tokens)")
    print("\nby kind: " + "   ".join(
        f"{s['model']}: " + ", ".join(f"{k} {p}/{n}" for k, (p, n) in s["kinds"].items())
        for s in summaries))

    fails = [r for r in rows if not r["pass"]]
    print(f"\nFailures ({len(fails)}). Read them: is it the model, the prompt, or the check?")
    for r in fails:
        ans = r["answer"].replace("\n", " ")
        ans = ans if len(ans) <= 110 else ans[:107] + "..."
        print(f"  [{r['model']}] {r['task']}: {'; '.join(r['reasons'])}\n      answer: {ans!r}")

    if a.markdown:
        print("\n| model | pass | E2E p50 ms | E2E p95 ms | out tok | decode TPS |\n|---|---|---|---|---|---|")
        for s in summaries:
            print(f"| {s['model']} | {s['passed']}/{s['total']} | {fmt(s['e2e_p50'])} | "
                  f"{fmt(s['e2e_p95'])} | {fmt(s['out_tok'])} | {fmt(s['tps'])} |")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--models", default=DEFAULT_MODELS,
                   help=f"comma-separated; add +nothink for Qwen3's no-thinking switch (default {DEFAULT_MODELS})")
    p.add_argument("--tasks", default=DEFAULT_TASKS, help="task set JSON (default: Lesson 3's delivery-app set)")
    p.add_argument("--only", default="", help="comma-separated task ids to run")
    p.add_argument("--base-url", default=DEFAULT_BASE_URL)
    p.add_argument("--max-tokens", type=int, default=1500,
                   help="per answer; thinking models need room (default 1500)")
    p.add_argument("--temperature", type=float, default=0.0, help="0 = as repeatable as possible")
    p.add_argument("--seed", type=int, default=42)
    p.add_argument("--price-in", type=float, default=0.0, help="$ per 1M input tokens, for $/1k req")
    p.add_argument("--price-out", type=float, default=0.0, help="$ per 1M output tokens, for $/1k req")
    p.add_argument("--markdown", action="store_true", help="also print a table for portfolio/LOG.md")
    p.add_argument("--save", default="", help="write one JSON line per (model, task) to this file")
    a = p.parse_args()

    with open(a.tasks, encoding="utf-8") as f:
        suite = json.load(f)
    tasks = suite["tasks"]
    if a.only:
        want = set(a.only.split(","))
        tasks = [t for t in tasks if t["id"] in want]
        if not tasks:
            sys.exit(f"No tasks match --only {a.only}")

    print(f"Task set: {suite.get('name', a.tasks)}  |  server: {a.base_url}  |  temperature {a.temperature}")
    t0 = time.perf_counter()
    all_rows, summaries = [], []
    for spec in [m.strip() for m in a.models.split(",") if m.strip()]:
        rows = eval_model(a, spec, suite, tasks)
        all_rows += rows
        summaries.append(summarize(a, spec, rows))
    print_report(a, summaries, all_rows)
    print(f"\nTotal wall time: {time.perf_counter() - t0:.0f} s")

    if a.save:
        with open(a.save, "w", encoding="utf-8") as f:
            for r in all_rows:
                f.write(json.dumps(r, ensure_ascii=False) + "\n")
        print(f"Saved {len(all_rows)} rows to {a.save}")


if __name__ == "__main__":
    main()

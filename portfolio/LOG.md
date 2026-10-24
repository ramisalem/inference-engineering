# Inference Engineering: Lab Log

One entry per lab: the setup, the numbers, and a one-sentence takeaway in your own words.
This log is the evidence behind your capstone and the stories you tell in interviews ("I measured X, found Y, changed Z").

**Machine:** Apple M1 Pro, 16 GB unified memory · macOS · Ollama 0.6.8

---

## 0001: First served model (date: ____)

**Setup:** `llama3.2` (3.2B params, Q4_K_M, 2.0 GB) served by Ollama, measured with `labs/tools/stream_probe.py`.

Prompt-length experiment (paste the `--md` table here):

python3 labs/tools/stream_probe.py --runs 3

stream_probe | server http://localhost:11434/v1 | model llama3.2 | experiment single | cache-bust on

[default] max_tokens=200
  run w1 (warm-up, not counted): TTFT 2,986 ms | ITL mean 18.5 ms (p95 19.7) | decode 54.3 tok/s | E2E 5,935 ms | tokens in/out 56/160
  run 1: TTFT 151 ms | ITL mean 19.0 ms (p95 21.7) | decode 52.9 tok/s | E2E 3,176 ms | tokens in/out 60/160
  run 2: TTFT 146 ms | ITL mean 18.4 ms (p95 19.0) | decode 54.5 tok/s | E2E 3,079 ms | tokens in/out 57/160
  run 3: TTFT 140 ms | ITL mean 18.5 ms (p95 19.5) | decode 54.4 tok/s | E2E 3,083 ms | tokens in/out 58/160

Summary
  condition      prompt tok output tok  TTFT p50 ms  ITL mean ms  decode tok/s  E2E p50 ms
  ----------------------------------------------------------------------------------------
  default                60        160          146         18.7          53.9       3,083

➜  learning python3 labs/tools/stream_probe.py --experiment prompt-length --runs 3 --md 

stream_probe | server http://localhost:11434/v1 | model llama3.2 | experiment prompt-length | cache-bust on

[short prompt] max_tokens=120
  run w1 (warm-up, not counted): TTFT 919 ms | ITL mean 18.4 ms (p95 19.2) | decode 55.0 tok/s | E2E 2,174 ms | tokens in/out 79/69
  run 1: TTFT 145 ms | ITL mean 18.6 ms (p95 22.0) | decode 54.5 tok/s | E2E 1,403 ms | tokens in/out 78/69
  run 2: TTFT 144 ms | ITL mean 18.4 ms (p95 19.8) | decode 55.2 tok/s | E2E 1,394 ms | tokens in/out 80/69
  run 3: TTFT 140 ms | ITL mean 18.5 ms (p95 19.3) | decode 54.9 tok/s | E2E 1,397 ms | tokens in/out 81/69

[long prompt] max_tokens=120
  run w1 (warm-up, not counted): TTFT 2,623 ms | ITL mean 22.8 ms (p95 24.3) | decode 44.3 tok/s | E2E 4,406 ms | tokens in/out 1,425/79
  run 1: TTFT 2,626 ms | ITL mean 23.0 ms (p95 25.6) | decode 44.0 tok/s | E2E 4,425 ms | tokens in/out 1,423/79
  run 2: TTFT 2,644 ms | ITL mean 23.2 ms (p95 24.5) | decode 43.6 tok/s | E2E 4,433 ms | tokens in/out 1,424/78
  run 3: TTFT 2,619 ms | ITL mean 22.9 ms (p95 23.8) | decode 44.3 tok/s | E2E 4,382 ms | tokens in/out 1,423/78

Summary
  condition      prompt tok output tok  TTFT p50 ms  ITL mean ms  decode tok/s  E2E p50 ms
  ----------------------------------------------------------------------------------------
  short prompt           78         69          144         18.5          54.9       1,397
  long prompt         1,423         78        2,626         23.1          43.9       4,425

  prompt tokens: short prompt -> long prompt changed 18.24x
  output tokens: short prompt -> long prompt changed 1.13x
  TTFT        : short prompt -> long prompt changed 18.29x
  ITL         : short prompt -> long prompt changed 1.25x
  E2E         : short prompt -> long prompt changed 3.17x

Markdown (paste into portfolio/LOG.md), model `llama3.2`:

| condition | prompt tok | output tok | TTFT p50 (ms) | ITL mean (ms) | decode tok/s | E2E p50 (ms) |
|---|---:|---:|---:|---:|---:|---:|
| short prompt | 78 | 69 | 144 | 18.5 | 54.9 | 1,397 |
| long prompt | 1,423 | 78 | 2,626 | 23.1 | 43.9 | 4,425 |

➜  learning python3 labs/tools/stream_probe.py --experiment prompt-length --runs 3 --md 

stream_probe | server http://localhost:11434/v1 | model llama3.2 | experiment prompt-length | cache-bust on

[short prompt] max_tokens=120
  run w1 (warm-up, not counted): TTFT 2,772 ms | ITL mean 18.3 ms (p95 19.7) | decode 55.4 tok/s | E2E 4,019 ms | tokens in/out 81/69
  run 1: TTFT 167 ms | ITL mean 18.7 ms (p95 20.5) | decode 54.1 tok/s | E2E 1,442 ms | tokens in/out 79/69
  run 2: TTFT 150 ms | ITL mean 18.4 ms (p95 19.5) | decode 55.1 tok/s | E2E 1,402 ms | tokens in/out 81/69
  run 3: TTFT 141 ms | ITL mean 18.5 ms (p95 19.8) | decode 55.0 tok/s | E2E 1,397 ms | tokens in/out 79/69

[long prompt] max_tokens=120
  run w1 (warm-up, not counted): TTFT 2,616 ms | ITL mean 22.7 ms (p95 23.8) | decode 44.7 tok/s | E2E 4,384 ms | tokens in/out 1,423/79
  run 1: TTFT 2,613 ms | ITL mean 22.7 ms (p95 23.5) | decode 44.6 tok/s | E2E 4,518 ms | tokens in/out 1,422/85
  run 2: TTFT 2,612 ms | ITL mean 22.7 ms (p95 23.6) | decode 44.5 tok/s | E2E 4,456 ms | tokens in/out 1,421/82
  run 3: TTFT 2,622 ms | ITL mean 22.8 ms (p95 23.6) | decode 44.5 tok/s | E2E 4,396 ms | tokens in/out 1,421/79

Summary
  condition      prompt tok output tok  TTFT p50 ms  ITL mean ms  decode tok/s  E2E p50 ms
  ----------------------------------------------------------------------------------------
  short prompt           79         69          150         18.5          54.7       1,402
  long prompt         1,422         82        2,613         22.7          44.5       4,456

  prompt tokens: short prompt -> long prompt changed 18.00x
  output tokens: short prompt -> long prompt changed 1.19x
  TTFT        : short prompt -> long prompt changed 17.47x
  ITL         : short prompt -> long prompt changed 1.23x
  E2E         : short prompt -> long prompt changed 3.18x

Markdown (paste into portfolio/LOG.md), model `llama3.2`:

| condition | prompt tok | output tok | TTFT p50 (ms) | ITL mean (ms) | decode tok/s | E2E p50 (ms) |
|---|---:|---:|---:|---:|---:|---:|
| short prompt | 79 | 69 | 150 | 18.5 | 54.7 | 1,402 |
| long prompt | 1,422 | 82 | 2,613 | 22.7 | 44.5 | 4,456 |

➜  learning python3 labs/tools/stream_probe.py --experiment cold-start --server-timings 

stream_probe | server http://localhost:11434/v1 | model llama3.2 | experiment cold-start | cache-bust on | server timings on

[cold (unloaded)] max_tokens=60
  (model unloaded; this request includes loading it again)
  run 1: TTFT 2,568 ms | ITL mean 23.2 ms (p95 29.7) | decode 43.2 tok/s | E2E 3,935 ms | tokens in/out 61/60
         server clock: load 2,019 ms | prefill 531 ms | decode 1,378 ms | total 3,932 ms

[warm (loaded)] max_tokens=60
  run 1: TTFT 165 ms | ITL mean 18.3 ms (p95 19.1) | decode 54.8 tok/s | E2E 1,243 ms | tokens in/out 60/60
         server clock: load 24 ms | prefill 122 ms | decode 1,078 ms | total 1,227 ms

Summary
  condition      prompt tok output tok  TTFT p50 ms  ITL mean ms  decode tok/s  E2E p50 ms
  ----------------------------------------------------------------------------------------
  cold (unloaded)         61         60        2,568         23.2          43.2       3,935
  warm (loaded)          60         60          165         18.3          54.8       1,243

  prompt tokens: cold (unloaded) -> warm (loaded) changed 0.98x
  output tokens: cold (unloaded) -> warm (loaded) changed 1.00x
  TTFT        : cold (unloaded) -> warm (loaded) changed 0.06x
  ITL         : cold (unloaded) -> warm (loaded) changed 0.79x
  E2E         : cold (unloaded) -> warm (loaded) changed 0.32x

➜  learning python3 labs/tools/stream_probe.py --experiment prompt-length --runs 2 --no-cache-bust 

stream_probe | server http://localhost:11434/v1 | model llama3.2 | experiment prompt-length | cache-bust off

[short prompt] max_tokens=120
  run w1 (warm-up, not counted): TTFT 986 ms | ITL mean 18.3 ms (p95 19.2) | decode 55.3 tok/s | E2E 2,233 ms | tokens in/out 69/69
  run 1: TTFT 38 ms | ITL mean 18.4 ms (p95 20.3) | decode 55.0 tok/s | E2E 1,292 ms | tokens in/out 69/69
  run 2: TTFT 33 ms | ITL mean 18.5 ms (p95 20.0) | decode 55.0 tok/s | E2E 1,290 ms | tokens in/out 69/69

[long prompt] max_tokens=120
  run w1 (warm-up, not counted): TTFT 2,614 ms | ITL mean 22.6 ms (p95 23.3) | decode 44.9 tok/s | E2E 4,131 ms | tokens in/out 1,412/68
  run 1: TTFT 49 ms | ITL mean 22.7 ms (p95 23.5) | decode 44.6 tok/s | E2E 1,573 ms | tokens in/out 1,412/68
  run 2: TTFT 42 ms | ITL mean 22.8 ms (p95 23.9) | decode 44.5 tok/s | E2E 1,571 ms | tokens in/out 1,412/68

Summary
  condition      prompt tok output tok  TTFT p50 ms  ITL mean ms  decode tok/s  E2E p50 ms
  ----------------------------------------------------------------------------------------
  short prompt           69         69           36         18.4          55.0       1,291
  long prompt         1,412         68           45         22.8          44.6       1,572

  prompt tokens: short prompt -> long prompt changed 20.46x
  output tokens: short prompt -> long prompt changed 0.99x
  TTFT        : short prompt -> long prompt changed 1.28x
  ITL         : short prompt -> long prompt changed 1.23x
  E2E         : short prompt -> long prompt changed 1.22x

➜  learning python3 labs/tools/stream_probe.py --experiment prompt-length --runs 2 --no-cache-bust  --server-timings 

stream_probe | server http://localhost:11434/v1 | model llama3.2 | experiment prompt-length | cache-bust off | server timings on

[short prompt] max_tokens=120
  run w1 (warm-up, not counted): TTFT 1,090 ms | ITL mean 18.4 ms (p95 20.1) | decode 55.1 tok/s | E2E 2,344 ms | tokens in/out 69/69
  run 1: TTFT 43 ms | ITL mean 18.9 ms (p95 23.4) | decode 53.8 tok/s | E2E 1,325 ms | tokens in/out 69/69
         server clock: load 14 ms | prefill 18 ms | decode 1,283 ms | total 1,317 ms
  run 2: TTFT 42 ms | ITL mean 18.3 ms (p95 19.1) | decode 55.6 tok/s | E2E 1,283 ms | tokens in/out 69/69
         server clock: load 13 ms | prefill 21 ms | decode 1,243 ms | total 1,279 ms

[long prompt] max_tokens=120
  run w1 (warm-up, not counted): TTFT 2,618 ms | ITL mean 22.5 ms (p95 24.0) | decode 45.2 tok/s | E2E 4,123 ms | tokens in/out 1,412/68
  run 1: TTFT 54 ms | ITL mean 22.8 ms (p95 24.1) | decode 44.4 tok/s | E2E 1,585 ms | tokens in/out 1,412/68
         server clock: load 20 ms | prefill 27 ms | decode 1,532 ms | total 1,581 ms
  run 2: TTFT 44 ms | ITL mean 22.8 ms (p95 24.6) | decode 44.5 tok/s | E2E 1,572 ms | tokens in/out 1,412/68
         server clock: load 12 ms | prefill 24 ms | decode 1,531 ms | total 1,570 ms

Summary
  condition      prompt tok output tok  TTFT p50 ms  ITL mean ms  decode tok/s  E2E p50 ms
  ----------------------------------------------------------------------------------------
  short prompt           69         69           42         18.6          54.7       1,304
  long prompt         1,412         68           49         22.8          44.5       1,578

  prompt tokens: short prompt -> long prompt changed 20.46x
  output tokens: short prompt -> long prompt changed 0.99x
  TTFT        : short prompt -> long prompt changed 1.15x
  ITL         : short prompt -> long prompt changed 1.23x
  E2E         : short prompt -> long prompt changed 1.21x



**Takeaway (one sentence, your words):**

**Open question I still have:**

---

## 0002: Latency vs throughput (date: 2026-10-17)

**Setup:** `llama3.2` (3B Q4_K_M) on Ollama 0.6.8, `labs/tools/load_test.py`, 128 output tokens, 24 requests per level, closed loop C = 1, 2, 4, 8. Raw data: `portfolio/data/0002-np1.json`, `0002-np4.json`.

One slot (`OLLAMA_NUM_PARALLEL=1`), paste the `--md` table:

| Load | TTFT p50 | TTFT p95 | ITL mean | E2E p50 | Throughput | Req/s |
|---|---|---|---|---|---|---|
| C=1 | 4,594 ms | 6,902 ms | 144.4 ms | 21.9 s | 5.5 tok/s | 0.043 |
| C=2 | 30,268 ms | 53,391 ms | 178.7 ms | 49.0 s | 4.5 tok/s | 0.035 |
| C=4 | 56,262 ms | 61,907 ms | 105.3 ms | 70.2 s | 7.3 tok/s | 0.057 |
| C=8 | 122,432 ms | 127,940 ms | 101.6 ms | 136.7 s | 7.5 tok/s | 0.058 |

Run on 17 Oct 2026 (Ollama 0.6.8). The Mac was busy during this run: ITL at C=1 was 144 ms vs ~18.5 ms normally, so every number is ~7× slower than a clean run.

Four slots (`OLLAMA_NUM_PARALLEL=4`), paste the `--md` table:


Open loop (optional), rate and TTFT p50/p99:


**What one slot did (one sentence):**

**What four slots did (one sentence):**

**What I'd tell a PM who asks "can we just add more users?":**

**Open question I still have:**

---

## 0003: Choosing a model (date: ____)

**Setup:** Ollama 0.40.10, `labs/tools/mini_eval.py`, 12 tasks from `labs/0003-mini-eval/tasks.json` (classify, extract, math, write; two in Arabic), temperature 0, seed 42. Setups: `llama3.2` (3B), `qwen3:1.7b+nothink`, `qwen3:1.7b` (thinking). Raw data: `portfolio/data/0003-eval.jsonl`.

Eval table, paste the `--markdown` output:


Lab write-ups, paste from the lesson's **Copy my write-ups as Markdown** button:


### Model-selection memo (one page)

**Use case and constraints** (the job, latency target, volume, budget, data rules):

**Candidates** (and why these):

**Eval** (tasks, kinds, checks, settings):

**Results** (the numbers that decided it):

**Recommendation:**

**Why not the others:**

**Risks, and what would change my mind:**

**Next step:**

# Labs

Every lesson has a hands-on lab. Run all commands **from the workspace root**:

```bash
cd ~/Desktop/learning
```

## Layout

- `labs/tools/`: reusable tools that later lessons build on.
  - `stream_probe.py` measures TTFT, ITL, decode tokens/s and end-to-end latency against any OpenAI-compatible server (Ollama, llama.cpp, vLLM, SGLang). Standard library only. Run `python3 labs/tools/stream_probe.py --help`.
  - `load_test.py` (Lesson 2) sends many requests at once, closed loop (`--concurrency 1,2,4,8`) or open loop (`--rate 0.3`), and reports TTFT/E2E p50/p95/p99, ITL, throughput and req/s per load level. `--csv` output pastes into the Lesson 2 plotter. Reuses `stream_probe.py`; standard library only.
  - `mini_eval.py` (Lesson 3) runs a task set (`labs/0003-mini-eval/tasks.json`) against several models and reports pass rate, E2E/TTFT p50/p95, output tokens, decode tok/s and, with `--price-in/--price-out`, $ per 1,000 requests, then prints every failing answer. Add `+nothink` to a model name (`qwen3:1.7b+nothink`) to turn thinking off. `--only id1,id2` runs a subset, `--markdown` prints a table for `LOG.md`. Reuses `stream_probe.py`; standard library only.
- `labs/NNNN-*/`: files for one lesson's lab (notebooks for Colab/Kaggle, configs, data).
- `portfolio/LOG.md`: where each lab's results go.

## Environments

| Where | Used for | Status |
|---|---|---|
| Mac: Ollama | Lessons 1–3 (serving and measuring) | Installed: **0.40.10** in `/Applications/Ollama.app` (auto-updated from 0.6.8 during Week 1); `llama3.2` and `qwen3:1.7b` downloaded |
| Mac: Python 3.12 + uv | PyTorch/MLX/HF labs and load-test tools from Lesson 4 | Set up in Lesson 4 |
| Mac: llama.cpp | Benchmarks, quantization, speculative decoding, caching, `/metrics` | Installed when needed (`brew install llama.cpp`) |
| Mac: mlx-lm | Apple's own engine: generation, quantization, draft models | Installed when needed (`uv pip install mlx-lm`) |
| Google Colab (free GPU, usually a T4) | NVIDIA labs: vLLM, profiling, Triton | Needs a Google account; notebooks come with each lesson |
| Kaggle (free 2×T4) | Tensor parallelism (Lesson 20) | Needs a phone-verified Kaggle account |
| Modal (optional) | Labs that need a newer GPU (bf16/FP8, FlashAttention-2) | $30/month of free credit on the Starter plan; only if you want it, never required |

**Why Python 3.12, not your default 3.14:** several tools we'll use don't support newer Pythons yet (aiperf needs < 3.14, genai-bench needs < 3.13). Lesson 4 sets this up:

```bash
uv python install 3.12
uv venv --python 3.12 .venv-labs
source .venv-labs/bin/activate
```

## Main lab models

Small, ungated (no Hugging Face token needed), and the same family, so the draft model and the target model share a vocabulary for speculative decoding.

| Role | Model | Size on disk |
|---|---|---|
| Main Mac model | Qwen3-4B (GGUF Q4_K_M / MLX 4-bit) | ≈ 2.3–2.5 GB |
| Draft model, quick tests | Qwen3-0.6B (GGUF Q8_0 / MLX 4-bit) | ≈ 0.3–0.6 GB |
| T4 vLLM labs | Qwen3-1.7B or 0.6B in fp16 | ≈ 4 GB / 1.5 GB |
| Speech | whisper.cpp base / small | 142 MB / 466 MB |

Keep the total under about 10 GB. Full-precision Qwen3-4B (8 GB) is for Colab/Kaggle only. On 16 GB, about 8B at 4-bit is the practical ceiling for Mac labs.

## Gotchas to know in advance

- **No FlashAttention-2 and no bf16 on a T4.** Always use `--dtype half` there. Lesson 11 explains why.
- **The Ollama app updates itself** (it checks about once an hour). Lessons 1–2 were measured on 0.6.8; it moved to 0.40.10 during Week 1. Single-stream llama3.2 was re-checked on 0.40.10 at ~18 ms ITL, the same as before, but note the version next to every result in `LOG.md` and re-measure a baseline before comparing across versions.
- **Turning off Qwen3's thinking on Ollama 0.40:** the `/no_think` prompt switch from Qwen's blog didn't work in testing. Send `"reasoning_effort": "none"` in the request instead (that's what `mini_eval.py`'s `+nothink` does). The thinking text streams in `delta.reasoning`, separately from `delta.content`.
- **Set `OLLAMA_NUM_PARALLEL` yourself for load tests.** In 0.6.8 the default was "auto", which picked 2 parallel slots on this Mac; on 0.40 the default is 1. Quit the menu-bar app, then run `OLLAMA_NUM_PARALLEL=1 ollama serve` in its own tab; the startup log prints the value, and the model-load line shows `--parallel N --ctx-size M`. Each slot gets its own context, so memory grows with the slot count.
- **In 0.6.8, `ollama serve` doesn't launch the menu-bar app**, and only one server can hold port 11434 (`address already in use` means the app is still running).
- **Always pass `--port`.** llama-server and mlx_lm.server both default to 8080, and Prometheus and macmon both use 9090.
- **llama.cpp flags change often**, and many tutorials are stale. Trust `llama-server --help` and the lesson.
- **Docker on a Mac can't use the GPU.** Containerized servers run on the CPU, which is fine for the production labs, but they're slow.
- **Free GPUs aren't guaranteed.** Colab may hand you a different GPU or none, and sessions end after at most 12 hours. Save results as you go.

## Disk hygiene (about 77 GB free)

- Ollama models: `ollama list`, then `ollama rm <name>` for any you're done with.
- Hugging Face cache (from Lesson 4): `du -sh ~/.cache/huggingface`, then `hf cache ls` and `hf cache prune`.
- Ollama and Hugging Face keep separate copies, so the same model can sit on disk twice.
- Each lesson says how much disk its lab needs, and what to delete afterwards.

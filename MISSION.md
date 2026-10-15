# Mission: Inference Engineering

## Why
Move from app development (web, mobile, backend) into an **inference / ML-infrastructure engineering role**. The goal is a portfolio and interview-level understanding that prove I can make open models faster, cheaper and more reliable to serve, following [roadmap.sh/inference-engineering](https://roadmap.sh/inference-engineering).

## Success looks like
- Do the napkin math interviewers ask for: estimate TTFT, inter-token latency, KV-cache size, max batch size and $/1M tokens for a given model and GPU, and explain *why* decode is memory-bandwidth-bound.
- Serve an open model with **vLLM** on a cloud GPU and with **llama.cpp/MLX** on my Mac, load-test both, and report p50/p95/p99 TTFT, ITL and throughput.
- Apply and measure the core optimizations (quantization, speculative decoding, prefix caching, continuous batching, tensor parallelism), with a quality check, and explain each one's tradeoffs.
- Ship a public **capstone repo + write-up**: a benchmarked, observable, cost-estimated model deployment I can show recruiters.
- Answer a mock "design an LLM serving system" interview end to end.

## Constraints
- **~5 hours/week for 13 weeks** (Mon 12 Oct 2026 → Sun 10 Jan 2027), ≈ 65 hours total. Tight for 136 roadmap topics, so core LLM-serving topics get depth and peripheral ones get a lighter touch.
- **Background:** strong software engineer, new to ML. No PyTorch or GPU experience yet, so ML prerequisites are taught just-in-time.
- **Hardware:** Apple M1 Pro, 16 GB, ~77 GB free disk, no NVIDIA GPU. NVIDIA-specific labs run on **free Colab/Kaggle GPUs**. Budget: $0.
- Every lesson has a hands-on lab and exercises with immediate feedback.

## Out of scope
- Training or pre-training models, and ML theory beyond what serving needs.
- CUDA kernel mastery: one hands-on taste of Triton/CUDA, not a kernel-engineer track.
- Datacenter operations and GPU procurement contracts: awareness level only.

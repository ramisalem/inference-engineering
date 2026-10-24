# Inference Engineering Resources

Curated, high-trust sources for this course. Every lesson's citations come from here. Entries marked ✓ were opened and checked while building the course (2026-10-12). Lab-fit tags: **[M1]** runs on your MacBook, **[T4]** runs on a free Colab/Kaggle T4, **[read]** needs data-centre GPUs, so read only.

Vendor speed numbers ("up to 3.6x") are the vendor's own and rarely reproduce on other hardware. In lessons we use them as ratios, then measure our own.

## Knowledge

### Course backbone (use in every part)
- ✓ [Roadmap: roadmap.sh/inference-engineering](https://roadmap.sh/inference-engineering)
  The 136-node map this course follows. Its node text closely tracks Baseten's book. Use for: deciding scope and coverage (see `reference/syllabus.html`).
- ✓ [Book: _Inference Engineering_, Philip Kiely (Baseten Books, 2026), free to read online](https://www.baseten.co/inference-engineering/book/)
  The roadmap's backbone book, 256 pages, NVIDIA/data-centre focused. The full text is free online with no login; PDF/EPUB/audiobook need a sign-up form ([download page](https://www.baseten.co/inference-engineering/digital-download/)); paperback $25. Use for: the primary reading of most lessons. Each lesson links the exact section. Skip §7.6 (product overview). Known errata: Appendix B misnames the TeaCache paper (real: arXiv 2411.19108, Feng Liu et al.) and the Ring Attention author (Hao Liu); its RTF is a speed multiple (higher = better), the inverse of classic ASR papers.
- ✓ [Handbook: _LLM Inference Handbook_ (BentoML, now hosted by Modular)](https://handbook.modular.com/)
  Free, short pages from basics to infrastructure, with interactive tools (latency playground, GPU memory calculator). Moved from bentoml.com/llm. Vendor-written; the kernel pages steer toward Mojo/MAX, and its multi-request ITL formula differs from NVIDIA's. Use for: a second explanation of any topic.
- ✓ [Article: "Inside vLLM: Anatomy of a High-Throughput LLM Inference System", Aleksa Gordić (2025)](https://vllm.ai/blog/2025-09-05-anatomy-of-vllm)
  Scheduler, continuous batching, paged KV cache, prefix caching, speculative decoding and disaggregation in one real codebase. Use for: Parts 4–5; re-read after Lesson 12.

### Part 1 · Outside in (Lessons 1–3)
- ✓ [Docs: "Metrics", NVIDIA NIM LLM Benchmarking Guide](https://docs.nvidia.com/nim/benchmarking/llm/metrics)
  Precise definitions of TTFT, E2E, ITL = (E2E − TTFT)/(N − 1), system TPS vs TPS per user, and RPS, as implemented by AIPerf. It warns: "compare results only when definitions align". Use for: exact metric definitions; primary source of Lesson 1.
- ✓ [Article: "LLM Inference Performance Engineering: Best Practices", Databricks (2023)](https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices)
  TTFT/TPOT, the latency formula, Model Bandwidth Utilization (MBU), and batch size vs latency (batch 64 gave 14× throughput at 4× latency on one A100). Use for: Lessons 1, 2, 8 and 13.
- ✓ [Book §1.4 "Measuring Latency and Throughput"](https://www.baseten.co/inference-engineering/book/01-prerequisites/measuring-latency-and-throughput/) and [§1.2 "About Your App"](https://www.baseten.co/inference-engineering/book/01-prerequisites/about-your-app/)
  Percentiles, end-to-end metrics, online vs offline, consumer vs B2B. Use for: Lessons 1–2 (primary reading of Lesson 2).
- ✓ [Article: "Reproducible Performance Metrics for LLM Inference", Anyscale (2023)](https://www.anyscale.com/blog/reproducible-performance-metrics-for-llm-inference) + [LLMPerf](https://github.com/ray-project/llmperf)
  Benchmarking pitfalls (tokenizers, input-length mix, concurrency). Its ITL average *includes* TTFT, a useful contrast with NVIDIA. Use for: Lessons 2 and 13.
- ✓ [Talk: "How NOT to Measure Latency", Gil Tene (YouTube)](https://www.youtube.com/watch?v=lJ8ydIuPFeU) and [Google SRE Book, "Service Level Objectives"](https://sre.google/sre-book/service-level-objectives/)
  Why averages lie, coordinated omission, and how SLOs use percentiles. Use for: Lesson 2 (primary talk; SRE quotes in the percentiles section).
- ✓ [Docs: "Async inference", Baseten](https://docs.baseten.co/inference/async) (checked 2026-10-15)
  "A *fire and forget* pattern": request ID returned at once, queue, webhook POST; "sync requests take priority". Use for: Lesson 2 (asynchronous inference), Lesson 26 (queues and autoscaling).
- ✓ [Handbook: "LLM inference metrics"](https://handbook.modular.com/llm-inference-basics/llm-inference-metrics/) (checked 2026-10-15)
  Goodput (requests/s meeting the SLO), an example SLO ("95% of chatbot interactions should have a TTFT below 200 milliseconds"), RPS formula. Use for: Lesson 2 (SLOs, goodput), Lesson 13.
- ✓ [Docs: Ollama FAQ, "How does Ollama handle concurrent requests?"](https://docs.ollama.com/faq) and [Wikipedia, "Little's law"](https://en.wikipedia.org/wiki/Little%27s_law) (checked 2026-10-15)
  `OLLAMA_NUM_PARALLEL` ("maximum number of parallel requests each model will process at the same time"; RAM scales with NUM_PARALLEL × context). Little's law L = λW holds regardless of arrival process or service order. Use for: Lesson 2 lab.
- ✓ [Book §1.3 "Model Selection"](https://www.baseten.co/inference-engineering/book/01-prerequisites/model-selection/) and [Artificial Analysis methodology](https://artificialanalysis.ai/methodology)
  Evaluation, fine-tuning, distillation; how public speed/price/quality leaderboards are measured. Use for: Lesson 3.
- ✓ [Article: "Your AI Product Needs Evals", Hamel Husain (2024)](https://hamel.dev/blog/posts/evals/) and [HF Evaluation Guidebook](https://huggingface.co/spaces/OpenEvals/evaluation-guidebook)
  Practical evals: unit tests, model/human eval, A/B. Use for: Lessons 3 and 17.
- ✓ [Blog: "Qwen3: Think Deeper, Act Faster", Qwen team (2025)](https://qwenlm.github.io/blog/qwen3/) (checked 2026-10-24)
  Hybrid thinking/non-thinking modes ("quick, near-instant responses" vs step-by-step), performance "directly correlated with the computational reasoning budget", six dense sizes 0.6B–32B, "open-weighted ... under Apache 2.0 license". `/no_think` switch documented, but didn't work on Ollama 0.40 (use `reasoning_effort: "none"`). Use for: Lesson 3 (reasoning models, open licenses), Lesson 16 (speculative decoding with a 0.6B draft).
- ✓ [License: Llama 3.2 Community License, Meta](https://github.com/meta-llama/llama-models/blob/main/models/llama3_2/LICENSE) (checked 2026-10-24; dev.meta.ai links 404, use the GitHub copy)
  "Built with Llama" display requirement, derived names must start with "Llama", >700M MAU on the release date must "request a license from Meta". Use for: Lesson 3 (open ≠ no terms).
- ✓ [Docs: "Usage", Ollama API](https://docs.ollama.com/api/usage)
  Server-side timing fields (`load_duration`, `prompt_eval_duration` for *uncached* prompt tokens, `eval_duration`, in nanoseconds). Use for: `stream_probe.py --server-timings`.
- ✓ [Docs: "OpenAI compatibility", Ollama](https://docs.ollama.com/api/openai-compatibility)
  What Ollama's `/v1` endpoints support. Use for: pointing OpenAI-style clients at local models.
- ✓ [Docs: "Using server-sent events", MDN](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
  The streaming protocol OpenAI-compatible servers use. Use for: the raw stream in Lab 1.
- ✓ [Article: "What's the Difference Between Deep Learning Training and Inference?", NVIDIA blog](https://blogs.nvidia.com/blog/difference-deep-learning-training-inference-ai/) and [Book Ch 0 "Inference"](https://www.baseten.co/inference-engineering/book/00-inference/)
  Training vs inference; the runtime / infrastructure / tooling stack. Use for: Lesson 1 framing.

### Part 2 · Inside the model (Lessons 4–6)
- ✓ [Book §2.1 "Neural Networks"](https://www.baseten.co/inference-engineering/book/02-models/neural-networks/) and [§2.2 "LLM Inference Mechanics"](https://www.baseten.co/inference-engineering/book/02-models/llm-inference-mechanics/)
  Matmuls, activations, transformer blocks, attention, prefill vs decode, MoE. Primary for Lessons 4–6.
- ✓ [Videos: 3Blue1Brown Deep Learning ch. 5–7](https://www.youtube.com/watch?v=wjZofJX0v4M) ([ch. 6 attention](https://www.youtube.com/watch?v=eMlx5fFNoYc), [ch. 7 MLPs](https://www.youtube.com/watch?v=9-Jl0dxWQs8))
  The best visual intuition for transformers; no maths background needed. Use for: Lessons 4–5.
- ✓ [Video: "Deep Dive into LLMs like ChatGPT", Andrej Karpathy](https://www.youtube.com/watch?v=7xTGNNLPyMI) (inference section at 26:01) and ["Let's build GPT"](https://www.youtube.com/watch?v=kCc8FmEb1nY)
  End-to-end picture of tokens, training and sampling; then build one. Use for: Lesson 5.
- ✓ [Course chapter: "Tokenizers", Hugging Face LLM Course](https://huggingface.co/learn/llm-course/chapter2/4)
  How text becomes tokens. Use for: Lessons 1 and 5.
- ✓ [Article: "Understanding and Coding the KV Cache in LLMs from Scratch", Sebastian Raschka (2025)](https://magazine.sebastianraschka.com/p/coding-the-kv-cache-in-llms) **[M1]**
  A runnable KV cache. Use for: Lesson 6 lab. Companions: ["Visual Guide to Attention Variants"](https://magazine.sebastianraschka.com/p/visual-attention-variants) (MHA/GQA/MLA) and [LLMs-from-scratch repo](https://github.com/rasbt/LLMs-from-scratch).
- ✓ [Interactive: Transformer Explainer](https://poloclub.github.io/transformer-explainer/) and [bbycroft LLM visualization](https://bbycroft.net/llm); [Illustrated Transformer, Jay Alammar](https://jalammar.github.io/illustrated-transformer/)
  Click-through diagrams. Use for: Lesson 5.
- ✓ [Article: "A Visual Guide to Mixture of Experts", Maarten Grootendorst](https://newsletter.maartengrootendorst.com/p/a-visual-guide-to-mixture-of-experts)
  Total vs active parameters (Mixtral ≈ 46.7B total, ≈ 12.8B active). Use for: Lessons 5 and 21.

### Part 3 · Performance physics & hardware (Lessons 7–10)
- ✓ [Book §2.4 "Calculating Inference Bottlenecks"](https://www.baseten.co/inference-engineering/book/02-models/calculating-inference-bottlenecks/)
  Ops:byte ratio and arithmetic intensity for LLMs and image models. Primary for Lessons 7–8.
- ✓ [Article: "Making Deep Learning Go Brrrr From First Principles", Horace He](https://horace.io/brrr_intro.html)
  Compute vs memory bandwidth vs overhead; read before any profiling. Use for: Lesson 7.
- ✓ [Article: "Transformer Inference Arithmetic", kipply (2022)](https://kipp.ly/p/transformer-inference-arithmetic)
  Hand-calculate KV size, decode latency and batch effects. MHA-only and A100-40GB numbers; use the `/p/` URL. Use for: Lessons 6–8.
- ✓ [Docs: "GPU Performance Background User's Guide", NVIDIA](https://docs.nvidia.com/deeplearning/performance/dl-performance-gpu-background/index.html)
  The official definition of arithmetic intensity and ops:byte, with worked tables. Use for: Lesson 7.
- ✓ [Book: "How to Scale Your Model", Google DeepMind (2025)](https://jax-ml.github.io/scaling-book/)
  Rooflines, transformer accounting, inference chapter. TPU/JAX-centric: take the reasoning, not the numbers. Use for: Lessons 7–8, 20.
- ✓ [Reference: Modal GPU Glossary](https://modal.com/gpu-glossary)
  SMs, warps, tensor cores, memory hierarchy, roofline, memory-bound vs compute-bound. Use for: Lessons 7, 9, 10, 15 (look-up while reading).
- ✓ [Book Ch 3 "Hardware" §3.1–3.5](https://www.baseten.co/inference-engineering/book/03-hardware/gpu-architecture/)
  GPU architecture, generations (Hopper → Rubin), instances/MIG, other accelerators, local inference. Primary for Lessons 9–10.
- ✓ [Spec pages: NVIDIA H100](https://www.nvidia.com/en-us/data-center/h100/), [A100](https://www.nvidia.com/en-us/data-center/a100/), [T4](https://www.nvidia.com/en-us/data-center/tesla-t4/), [L4](https://www.nvidia.com/en-us/data-center/l4/), [H200](https://www.nvidia.com/en-us/data-center/h200/)
  Primary specs. H100 SXM: 3.35 TB/s, 80 GB, 989.4 TFLOPS dense BF16 (headline numbers are with sparsity = 2× dense). T4: 65 TFLOPS FP16, 320 GB/s, 16 GB, **no BF16, no FP8**. Use for: Lesson 10 sizing tables.
- ✓ [Article: "Inside NVIDIA GPUs: anatomy of high-performance matmul kernels", Aleksa Gordić (2025)](https://www.aleksagordic.com/blog/matmul)
  How the memory hierarchy shapes kernels. Use for: Lessons 9 and 15 (optional deep dive).
- ✓ [Thread: llama.cpp Apple Silicon benchmarks](https://github.com/ggml-org/llama.cpp/discussions/4167) **[M1]**
  Community numbers per Apple chip (M1 Pro: ~36 tok/s generation for a 7B Q4_0). Use for: checking your Mac's numbers in Lessons 8 and 10.

### Part 4 · The software stack (Lessons 11–15)
- ✓ [Book §2.5 "Optimizing Attention"](https://www.baseten.co/inference-engineering/book/02-models/optimizing-attention/) and [Ch 4 "Software" §4.1–4.5](https://www.baseten.co/inference-engineering/book/04-software/cuda/)
  Attention optimization, CUDA/kernels, frameworks and formats, engines, Dynamo, benchmarking. Primary for Lessons 11–15.
- ✓ [Paper: FlashAttention (arXiv 2205.14135)](https://arxiv.org/abs/2205.14135), [FlashAttention-2 blog](https://crfm.stanford.edu/2023/07/17/flash2.html), [PagedAttention / vLLM blog](https://vllm.ai/blog/2023-06-20-vllm)
  The two attention ideas every interview asks about. **T4 note:** official FA2 doesn't support Turing; use PyTorch SDPA on a T4. Use for: Lessons 11–12.
- ✓ [Video: GPU MODE lecture 12, FlashAttention](https://www.youtube.com/watch?v=zEuwuCTEf_0)
  Walkthrough of the algorithm. Use for: Lesson 11.
- ✓ [Docs: vLLM](https://docs.vllm.ai/en/latest/) **[T4]**
  The reference engine for labs (quickstart, architecture overview, bench CLI). Flags change often; match docs to your installed version. Runs on a T4 in FP16. Use for: Lessons 12–13, 16, 18–19, 25, 27.
- ✓ [Docs: llama.cpp](https://github.com/ggml-org/llama.cpp) and [mlx-lm](https://github.com/ml-explore/mlx-lm) **[M1]**
  The engines that run well on your Mac (vLLM is not first-class on Apple Silicon). Use for: Mac labs throughout.
- ✓ [Docs: SGLang](https://docs.sglang.io/) and [TensorRT-LLM](https://nvidia.github.io/TensorRT-LLM/)
  The other two major engines. Use for: Lessons 14 and 19.
- ✓ [Docs: vLLM benchmark CLI](https://docs.vllm.ai/en/latest/benchmarking/cli/), [AIPerf](https://github.com/ai-dynamo/aiperf), [GuideLLM](https://github.com/vllm-project/guidellm)
  Load-testing tools (AIPerf replaces GenAI-Perf). vLLM warns that repeated runs can hit the prefix cache and inflate results. Use for: Lesson 13.
- ✓ [Article: "LLM benchmarking: fundamental concepts", NVIDIA (2025)](https://developer.nvidia.com/blog/llm-benchmarking-fundamental-concepts/)
  Benchmark methodology. Use for: Lesson 13.
- ✓ [Docs: PyTorch profiler recipe](https://docs.pytorch.org/tutorials/recipes/recipes/profiler_recipe.html) and [GPU MODE lecture 1, "Profiling CUDA kernels in PyTorch"](https://www.youtube.com/watch?v=LuhJEEJQgUM)
  First profiling steps. Use for: Lessons 9 and 13.
- ✓ [Docs: Safetensors](https://huggingface.co/docs/safetensors/index), [GGUF spec](https://github.com/ggml-org/ggml/blob/master/docs/gguf.md), [ONNX Runtime](https://onnxruntime.ai/docs/)
  Model file formats and runtimes. Use for: Lesson 14.
- ✓ [Tutorials: Triton](https://triton-lang.org/main/getting-started/tutorials/index.html) **[T4]**
  Vector add → fused softmax → matmul. Which tutorials run on a T4 is not yet checked. Use for: Lesson 15.
- ✓ [Article: "An Even Easier Introduction to CUDA", NVIDIA (2025)](https://developer.nvidia.com/blog/even-easier-introduction-cuda/)
  Gentle CUDA intro. Use for: Lesson 15 background.
- ✓ [Article: "Accelerating Generative AI with PyTorch II: GPT, Fast"](https://pytorch.org/blog/accelerating-generative-ai-2/)
  torch.compile, quantization and speculative decoding in ~1,000 lines. Use for: Lessons 14 and 16.

### Part 5 · Inference techniques (Lessons 16–21)
- ✓ [Book Ch 5 "Techniques" §5.1–5.5](https://www.baseten.co/inference-engineering/book/05-techniques/quantization/)
  Quantization, speculative decoding, caching, parallelism, disaggregation. Primary for Lessons 16–21.
- ✓ [Docs: vLLM quantization + hardware matrix](https://docs.vllm.ai/en/latest/features/quantization/) **[T4]**
  Which formats run on which GPU. On a T4 use INT8, AWQ, GPTQ or bitsandbytes (no FP8). Use for: Lesson 16.
- ✓ [Docs: llama.cpp quantize, imatrix and perplexity tools](https://github.com/ggml-org/llama.cpp/tree/master/tools) **[M1]**
  Quantize and measure quality loss (perplexity, KL divergence) locally. Use for: Lessons 16–17.
- ✓ [Paper: "Give Me BF16 or Give Me Death?" (arXiv 2411.02355)](https://arxiv.org/abs/2411.02355) and [lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness)
  Large-scale evidence on accuracy after quantization; the standard eval tool. Use for: Lesson 17.
- ✓ [Course: DeepLearning.AI "Quantization Fundamentals"](https://www.deeplearning.ai/courses/quantization-fundamentals) (free, 1h14m)
  Hands-on intro. Use for: Lesson 16 (optional).
- ✓ [Article: "Introducing NVFP4", NVIDIA (2025)](https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference/) **[read]**
  Where low-precision formats are heading (Blackwell). Use for: Lesson 16.
- ✓ [Docs: vLLM speculative decoding](https://docs.vllm.ai/en/latest/features/speculative_decoding/) and [blog: "up to 2.8x"](https://vllm.ai/blog/2024-10-17-spec-decode)
  The honest trade-off: 2.8× faster at low load, 1.4–1.8× *slower* at high QPS. Use for: Lesson 18.
- ✓ [Article: "Assisted Generation", Hugging Face](https://huggingface.co/blog/assisted-generation) **[M1] [T4]**
  A small runnable speculative-decoding demo. Use for: Lesson 18 lab.
- ✓ [Article: SGLang / RadixAttention, LMSYS (2024)](https://www.lmsys.org/blog/2024-01-17-sglang/) and [vLLM prefix caching design](https://docs.vllm.ai/en/latest/design/prefix_caching/)
  Prefix and KV reuse. Primary for Lesson 19.
- ✓ [Article: "KV-cache wins you can see", llm-d (2025)](https://llm-d.ai/blog/kvcache-wins-you-can-see) **[read]**
  Cache-aware routing results (vendor benchmark). Use for: Lessons 19 and 26.
- ✓ [Docs: vLLM parallelism and scaling](https://docs.vllm.ai/en/latest/serving/parallelism_scaling/)
  Tensor, pipeline, data and expert parallelism in practice. Primary for Lesson 20. Background: [HF Ultra-Scale Playbook](https://huggingface.co/spaces/nanotron/ultrascale-playbook) (training-focused; read the TP/PP/EP chapters).
- ✓ [Article: "Disaggregated Inference: 18 Months Later", Hao AI Lab (2025)](https://haoailab.com/blogs/distserve-retro/) **[read]**
  Why prefill/decode disaggregation took over. Primary for Lesson 21. Contrast: [vLLM disaggregated prefill](https://docs.vllm.ai/en/latest/features/disagg_prefill/) ("DOES NOT improve throughput").
- ✓ [Article: "Deploying DeepSeek with PD disaggregation and large-scale EP", LMSYS (2025)](https://www.lmsys.org/blog/2025-05-05-large-scale-ep/) **[read]**
  A real expert-parallel deployment. Use for: Lesson 21.
- ✓ [Article: "How continuous batching enables 23x throughput", Anyscale (2023)](https://www.anyscale.com/blog/continuous-batching-llm-inference)
  The batching idea behind every modern engine. Use for: Lessons 2, 12 and 26.

### Part 6 · Beyond LLMs (Lessons 22–24)
- ✓ [Book Ch 6 "Modalities" §6.1–6.6](https://www.baseten.co/inference-engineering/book/06-modalities/vision-language-models/)
  VLMs, embeddings, ASR, TTS, image and video generation. Primary for Lessons 22–24.
- ✓ [Docs: Text Embeddings Inference](https://huggingface.co/docs/text-embeddings-inference/index) and [Sentence Transformers efficiency](https://sbert.net/docs/sentence_transformer/usage/efficiency.html) **[M1] [T4]**
  Serving embedding models fast. Use for: Lesson 22.
- ✓ [Article: "Vision Language Models (Better, Faster, Stronger)", Hugging Face (2025)](https://huggingface.co/blog/vlms-2025) and [vLLM multimodal inputs](https://docs.vllm.ai/en/latest/features/multimodal_inputs/)
  VLM landscape and how engines take images. Use for: Lesson 22.
- ✓ [Repo: faster-whisper](https://github.com/SYSTRAN/faster-whisper) **[T4]** and [whisper.cpp](https://github.com/ggml-org/whisper.cpp) **[M1]**
  Fast speech recognition. Use for: Lesson 23. Watch the RTF convention (speed multiple vs time ratio).
- ✓ [Guide: "Voice AI & Voice Agents: An Illustrated Primer"](https://voiceaiandvoiceagents.com/) and [Modal "One-second voice-to-voice latency"](https://modal.com/blog/low-latency-voice-bot)
  Latency budgets for voice pipelines (VAD → ASR → LLM → TTS). Use for: Lesson 23. The primer's latency table doesn't add up exactly; cite carefully.
- ✓ [Model: Kokoro-82M TTS](https://huggingface.co/hexgrad/Kokoro-82M) and [Silero VAD](https://github.com/snakers4/silero-vad) **[M1] [T4]**
  Tiny speech models that run anywhere. Use for: Lesson 23 lab.
- ✓ [Docs: Diffusers optimization](https://huggingface.co/docs/diffusers/optimization/fp16) and [PyTorch "Flux Fast"](https://pytorch.org/blog/presenting-flux-fast-making-flux-go-brrr-on-h100s/)
  Diffusion is compute-bound (unlike LLM decode); how to speed it up. Use for: Lesson 24.
- ✓ [Video: "But how do AI images and videos actually work?" (3Blue1Brown × Welch Labs)](https://www.youtube.com/watch?v=iv-5mZ_9CPY)
  Diffusion intuition. Use for: Lesson 24.

### Part 7 · Production (Lessons 25–28)
- ✓ [Book Ch 7 "Production" §7.1–7.5](https://www.baseten.co/inference-engineering/book/07-production/containerization/)
  Containers, autoscaling, multi-cloud capacity, testing/deployment, client code. Primary for Lessons 25–28.
- ✓ [Docs: vLLM Docker deployment](https://docs.vllm.ai/en/latest/deployment/docker/) and [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/index.html)
  Packaging an engine. Use for: Lesson 25.
- ✓ [Article: "GPU memory snapshots", Modal](https://modal.com/blog/gpu-mem-snapshots) and [cold-start guide](https://modal.com/docs/guide/cold-start)
  Cutting cold starts (45 s → 5 s for a small vLLM model). Use for: Lesson 25.
- ✓ [Docs: KEDA concepts](https://keda.sh/docs/2.21/concepts/) and [Gateway API Inference Extension](https://gateway-api-inference-extension.sigs.k8s.io/)
  Autoscaling on custom metrics and model-aware routing on Kubernetes. Use for: Lesson 26.
- ✓ [Docs: vLLM production stack](https://docs.vllm.ai/projects/production-stack/en/latest/)
  A reference Kubernetes setup for vLLM. Use for: Lessons 26–27.
- ✓ [Docs: vLLM metrics](https://docs.vllm.ai/en/latest/usage/metrics/) and [Prometheus/Grafana example](https://docs.vllm.ai/en/latest/examples/observability/prometheus_grafana/) **[M1] [T4]**
  `vllm:time_to_first_token_seconds`, `vllm:kv_cache_usage_perc`, etc. Primary for Lesson 27.
- ✓ [Spec: OpenTelemetry GenAI semantic conventions](https://github.com/open-telemetry/semantic-conventions-genai)
  Standard names like `gen_ai.server.time_to_first_token` (still in development). Use for: Lesson 27.
- ✓ [Docs: vLLM security guide](https://docs.vllm.ai/en/latest/usage/security/) and [OWASP Top 10 for LLM Apps](https://genai.owasp.org/llm-top-10/)
  Don't rely only on `--api-key`; LLM-specific risks. Use for: Lessons 25 and 27.
- ✓ [Article: "How we built multi-cloud capacity management", Baseten (2025)](https://www.baseten.co/blog/how-we-built-multi-cloud-capacity-management/) and [SkyPilot docs](https://docs.skypilot.ai/en/latest/) **[read]**
  GPU capacity across clouds. Use for: Lesson 26 (awareness).
- ✓ Cost (Lesson 28): Databricks MBU (Part 1), Artificial Analysis methodology (Part 1) and Book §7.4 cost estimation. No neutral cost-per-million-tokens method yet (see Gaps).

### Part 8 · Capstone & interview (Lessons 29–30)
- ✓ [Course: Stanford CS336, lecture 10 "Inference"](https://www.youtube.com/watch?v=EfM546A79aM) (1h25m)
  A university-level review of the whole inference picture. Use for: Lesson 30 revision.
- ✓ [Video: GPU MODE lecture 100, InferenceX](https://www.youtube.com/watch?v=sV0PJC1dOmM) and [InferenceX dashboard](https://inferencex.semianalysis.com/)
  How the industry benchmarks throughput vs interactivity across GPUs. Use for: capstone write-up.

### Free courses (cross-cutting)
- ✓ [Stanford CS336 (2026)](https://cs336.stanford.edu/): L5 GPUs, L6 kernels/Triton, L10 inference. Heavy, use selectively.
- ✓ [GPU MODE lectures](https://github.com/gpu-mode/lectures): L12 FlashAttention, L22 speculative decoding, L35 SGLang, L58 disaggregation, L73 quantization.
- ✓ [DeepLearning.AI short courses](https://www.deeplearning.ai/courses/fast-and-efficient-llm-inference-with-vllm): vLLM (1h38m), SGLang, efficiently-serving-llms, quantization. Free to enrol; certificate needs a paid plan.
- ✓ [MIT 6.5940 TinyML/efficient DL (2024)](https://hanlab.mit.edu/courses/2024-fall-65940): L13 LLM deployment, quantization lectures.

### Learning science (how this course is built)
- [Paper: Dunlosky et al., "Improving Students' Learning With Effective Learning Techniques" (2013)](https://doi.org/10.1177/1529100612453266)
  Evidence for retrieval practice and spacing, which is why lessons have "Reset exercises" and spaced reviews. (The DOI resolves; the publisher blocks automated fetches.)

### Do not use
- The PDF of Raschka's book at `dl.tehrandata.org` linked from the roadmap is an unauthorised copy. Use the [free repo](https://github.com/rasbt/LLMs-from-scratch) or the [Manning page](https://www.manning.com/books/build-a-large-language-model-from-scratch).
- Low-signal roadmap seed domains (SEO blogs, hosting-company explainers) are skipped in favour of the sources above.

## Wisdom (Communities)

Start with two: **GPU MODE** for "how it works" and **r/LocalLLaMA** for "what people actually run". Lurk first; post your benchmark write-ups from week 6 onward.

- ✓ [GPU MODE Discord](https://discord.gg/gpumode) (~31k members) + [YouTube lectures](https://github.com/gpu-mode/lectures)
  The highest-signal place for kernels, profiling and inference systems. Many inference engineers hang out here. Very high signal; can be advanced.
- [r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/) (blocks automated checks; alive as of 2026)
  Practitioners comparing engines, quantizations and hardware. Medium signal: great real-world numbers, some hype.
- ✓ [vLLM forum](https://discuss.vllm.ai/) and [vLLM Slack](https://slack.vllm.ai)
  Ask engine questions and read how maintainers debug. High signal.
- ✓ [llama.cpp GitHub Discussions](https://github.com/ggml-org/llama.cpp/discussions)
  The best source of Apple Silicon numbers. High signal.
- ✓ [Hugging Face Discord](https://hf.co/join/discord) and [forums](https://discuss.huggingface.co/)
  Huge (~242k); good for Transformers/Diffusers questions. Medium signal.
- ✓ [SGLang events / office hours](https://www.sglang.io/events)
  Weekly office hours; good for seeing how a top engine team thinks.
- ✓ [Latent Space](https://www.latent.space) (podcast + Discord) and [MLOps Community](https://mlops.community/)
  Industry context and production stories; useful for interview conversation. Medium signal.

## Gaps
- **Lab environments:** free-tier quotas (Kaggle ≈ 30 GPU-h/week, 2×T4) are unverified because the docs block automated reads; Colab doesn't guarantee a T4. Confirm in your own account in week 4.
- **Which Triton tutorials run on a T4:** to test before Lesson 15.
- **Apple M1 Pro compute peak:** Apple publishes bandwidth (200 GB/s) but no official TFLOPS, so the Mac's ops:byte (~26) is an estimate. We'll measure it in Lesson 8.
- **Hands-on paths for multi-GPU:** disaggregation and multi-node parallelism have no free lab; Lesson 20 uses Kaggle's 2×T4 and Lesson 21 is read-only.
- **Cost:** no neutral, current cost-per-million-tokens methodology found; Lesson 28 builds one from first principles.
- **Production:** no free source on LLM-specific zero-downtime rollouts or geo load balancing.
- **Newer chips:** MI325X, GB300, Groq and Cerebras specs not yet verified.

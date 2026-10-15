# Inference Engineering: verified sources for modules M0 to M8

Prepared 2026-10-12 for a 3-month self-study course that follows https://roadmap.sh/inference-engineering . Learner: working software engineer with an Apple M1 Pro 16 GB MacBook plus free Colab/Kaggle GPUs.

**How to read this document**
- Every URL below was fetched during this research pass (2026-10-12) unless it is tagged UNVERIFIED with a reason. A few sources were read in an earlier pass of the same research and are labelled where it matters.
- "Free" means readable with no payment and no login. "Paid" says so. "Sign-up" means a free form.
- The roadmap page itself (https://roadmap.sh/inference-engineering) could not be re-fetched in this pass (curl timed out, the WebFetch call errored), so its current liveness is UNVERIFIED. Its link list was read from a saved local copy.
- Vendor numbers are labelled as vendor numbers. NVIDIA "with sparsity" figures are twice the dense figures; dense is used unless stated.
- Lab fit: tags **[M1]** run on the M1 Pro 16 GB, **[T4]** run on a free Colab/Kaggle T4 (Turing: no FP8, no bf16 tensor cores), **[read]** need data-centre hardware, so read only.

**Checklist of the 13 requested items**

| # | Item | Verdict | Where |
|---|---|---|---|
| 1 | Baseten book | Free online, full text; PDF/EPUB/audiobook need a sign-up form; paperback $25 | B1, every module |
| 2 | BentoML LLM Inference Handbook | Free; moved to handbook.modular.com | B2 |
| 3 | How to Scale Your Model | Free; TPU/JAX-centric | M3 |
| 4 | HF Ultra-Scale Playbook | Free web and PDF; training-focused | M3, M4 |
| 5 | Horace He, Making Deep Learning Go Brrrr | Free | M3 |
| 6 | kipply, Transformer Inference Arithmetic | Free; use the /p/ URL | M3 |
| 7 | Modal GPU Glossary | Free | M4 |
| 8 | NVIDIA GPU Performance Background guide | Free | M3 |
| 9 | Databricks LLM Inference Performance Engineering | Free | M1, M3 |
| 10 | Key papers | arXiv IDs verified | per module |
| 11 | Free courses and videos | Verified, with timestamps | per module and "Cross-module courses" |
| 12 | Official docs | Verified; many paths moved | M5, M6, M8 |
| 13 | Communities | Listed; some invites bot-blocked | Communities |


## Backbone texts (use throughout the course)

### B1. *Inference Engineering*, by Philip Kiely (Baseten Books, 2026): the roadmap's backbone book [item 1, VERIFIED]
- **Links:** landing page https://www.baseten.co/inference-engineering/ ; the roadmap's link https://www.baseten.co/inference-engineering/digital-download/ goes to the download form.
- **Free or paid: free.** The complete text can be read online with no login at **https://www.baseten.co/inference-engineering/book/** ("Read the book online" on the landing page). It is also published as Markdown, with one file per chapter and one per numbered section:
  - index: https://www.baseten.co/inference-engineering/llms.txt
  - expanded table of contents: https://www.baseten.co/inference-engineering/book/overview.md
  - full text in one file (about 48.6K words): https://www.baseten.co/inference-engineering/llms-full.txt
- **Downloads and print:**
  - The "digital download" page embeds a HubSpot lead form named "Inference Engineering download", so the free PDF, EPUB and M4B audiobook require a sign-up. The form fields were not visible: UNVERIFIED, an email address is likely.
  - The paperback is $25.00 at https://books.baseten.com/products/inference-engineering .
  - The FAQ also mentions Amazon (print and digital) and free paperbacks handed out at events.
- **Format facts, quoted from the landing-page FAQ:** "256 pages, which is about 46,000 words or about 60,000 tokens"; "available in PDF, EPUB, paperback, hardcover, and audiobook (M4B) formats"; "Your free digital download includes the audiobook"; and the book has "a definite focus on NVIDIA GPUs and inference in the datacenter."
- **Table of contents, mapped to course modules.** Section URLs follow the pattern `https://www.baseten.co/inference-engineering/book/<chapter>/<slug>/`:

| Module | Book chapters and sections |
|---|---|
| M0 | Preface (open vs closed models); **Ch 0 Inference** (training vs inference; the three-layer stack of runtime, infrastructure and tooling) `/book/00-inference/`; **1.1 Scale and Specialization** (shared vs dedicated) `/book/01-prerequisites/scale-and-specialization/` |
| M1 | **1.2 About Your App** (1.2.1 AI-Native Applications, 1.2.2 Online versus Offline, 1.2.3 Consumer versus B2B); **1.3 Model Selection** (1.3.1 Model Evaluation, 1.3.2 Fine-Tuning, 1.3.3 Distillation); **1.4 Measuring Latency and Throughput** (1.4.1 Latency Percentiles, 1.4.2 End-to-End Metrics) `/book/01-prerequisites/measuring-latency-and-throughput/`; prefill and decode in 2.2; 7.5.2 Asynchronous Inference; real-time factor (RTF) in 6.3.2 |
| M2 | **2.1 Neural Networks** (linear layers and matmul, activations); **2.2 LLM Inference Mechanics** (LLM architecture, transformer blocks, attention, MoE); **2.3 Image Generation Inference Mechanics** (architecture, few-step models, video generation) |
| M3 | **2.4 Calculating Inference Bottlenecks** (2.4.1 Ops:Byte Ratio and Arithmetic Intensity, 2.4.2 LLM, 2.4.3 Image Generation) `/book/02-models/calculating-inference-bottlenecks/`; **2.5 Optimizing Attention** |
| M4 | **3.1 GPU Architecture** (compute; memory and caches); **3.2 GPU Architecture Generations** (Hopper, Ada Lovelace, Blackwell, Rubin, Grace and Vera); **3.3 Instances** (multi-GPU, MIG); **3.4 Other Datacenter Accelerator Options**; **3.5 Local Inference** (desktop, mobile) |
| M5 | **4.1 CUDA** (kernels for inference, kernel selection, kernel fusion); **4.2 Deep Learning Frameworks and Libraries** (PyTorch, model file formats, ONNX Runtime and TensorRT, Transformers and Diffusers); **4.3 Inference Engines** (vLLM, SGLang, TensorRT-LLM); **4.4 NVIDIA Dynamo**; **4.5 Performance Benchmarking and Load Testing** (tooling, tips, profiling) |
| M6 | **5.1 Quantization** (number formats, approaches, measuring quality impact); **5.2 Speculative Decoding** (draft-target, Medusa, EAGLE, n-gram and lookahead); **5.3 Caching** (prefix caching and KV reuse, where to store the KV cache, cache-aware routing, long context); **5.4 Model Parallelism** (tensor parallelism, expert parallelism, multi-node); **5.5 Disaggregation** (including dynamic disaggregation with Dynamo) |
| M7 | **6.1 VLMs** (video processing, omni-modal); **6.2 Embedding Models**; **6.3 ASR Models** (single-chunk latency, long files and RTF, diarization); **6.4 TTS Models** (streaming TTS, speech-to-speech); **6.5 Image Generation Models**; **6.6 Video Generation Models** (attention optimisation and quantization, context parallelism) |
| M8 | **7.1 Containerization** (dependency management, NIMs); **7.2 Autoscaling** (concurrency and batch sizing, cold starts, routing, load balancing and queueing, scale to zero, independent component scaling); **7.3 Multi-Cloud Capacity Management** (GPU procurement, geo-aware load balancing, reliability, security and compliance); **7.4 Testing and Deployment** (zero-downtime deployment, cost estimation, observability); **7.5 Client Code**. Skip 7.6, which is a Baseten product overview. |

- **Appendices:**
  - A: Inference Glossary, a good companion for lessons.
  - B: Recommended Reading. Most of the roadmap's seed links come straight from this list.
- **Errata found while verifying:**
  - Appendix B gives TeaCache's title as "Efficient KV Cache Compression via Tensor Decomposition" by "Feng Lu". The real paper is "Timestep Embedding Tells: It's Time to Cache for Video Diffusion Model", Feng Liu et al., arXiv 2411.19108.
  - Appendix B credits Ring Attention to "Hao Lin". The author is Hao Liu.
  - The book defines RTF as a speed multiple, where higher is better ("RTF of 1000X"). That is the inverse of the usual ASR convention; see M7.

### B2. *LLM Inference Handbook* (originally BentoML, now hosted by Modular) [item 2, VERIFIED]
- **Current URL: https://handbook.modular.com/** . `https://bentoml.com/llm/` returns a 301 to it, and old deep links redirect to new paths. For example, `bentoml.com/llm/llm-inference-basics/openai-compatible-api` now resolves to `handbook.modular.com/model-interaction/openai-compatible-api/`.
- **Why it moved:** BentoML announced "BentoML is joining Modular", calling it a "strategic product acquisition" (BentoML blog, "Last Updated: February 10, 2026": https://www.bentoml.com/blog/bentoml-is-joining-modular). The post says BentoML remains Apache 2.0.
- **Access:** free, no login. Append `.md` to any URL for Markdown; the index is at https://handbook.modular.com/llms.txt. Pages carry no author or date.
- **Section list (2026-10-12):**
  - *Foundations:* What is LLM inference?; Training vs. inference; How does an LLM work? (prefill and decode); Where is LLM inference run?; Key metrics for LLM inference.
  - *Planning your deployment:* choosing the right model, GPU and inference framework; calculating GPU memory; serverless vs. self-hosted; on-prem; BYOC.
  - *Model preparation:* quantization, fine-tuning, distillation.
  - *Model interaction:* OpenAI- and Anthropic-compatible APIs, inference parameters, structured outputs, function calling, prompt engineering, MCP, agent harnesses.
  - *Inference optimization:* static, dynamic and continuous batching; PagedAttention; prefix caching; KV cache offloading; speculative decoding; prefill-decode disaggregation; data, tensor, pipeline, expert and hybrid parallelism; inference routing; offline batch inference; LLM performance benchmarks.
  - *Kernel optimization:* GPU architecture fundamentals (SMs, tensor cores, threads, warps and blocks, the memory hierarchy); FlashAttention; kernel optimization for LLM inference; choosing kernel tools.
  - *Infrastructure and operations:* LLM inference infrastructure, distributed inference, fast scaling, multi-cloud and cross-region, multi-model pipelines, InferenceOps, observability, build and maintenance cost.
- **Interactive tools:** LLM Inference Visualizer, Latency Metrics Playground (TTFT, E2EL, TPOT, goodput), GPU Memory Calculator, GPU Comparison Table, Model Explorer.
- **Caveats:**
  - This is vendor-written content.
  - The kernel-optimization pages steer toward Mojo and MAX.
  - On the metrics page, the multi-request average-ITL formula divides by total output tokens instead of N−1 gaps. Use the NVIDIA definition in M1.

---

## M0: Orientation
**Primary:** *Inference Engineering* (Kiely, Baseten Books 2026). Free online. Read the Preface, **Chapter 0 "Inference"** and **§1.1 "Scale and Specialization"**:
- https://www.baseten.co/inference-engineering/book/00-inference/
- https://www.baseten.co/inference-engineering/book/01-prerequisites/scale-and-specialization/
- Preface (Markdown): https://www.baseten.co/inference-engineering/book/preface.md

What these sections cover:
- *Ch 0* defines training ("learning model weights from data") vs inference ("serving generative AI models in production") and the three-layer inference stack: **runtime** (one model on one GPU instance), **infrastructure** (scaling across clusters, regions and clouds) and **tooling**.
- *Preface* covers open vs closed models.
- *§1.1* covers shared vs dedicated inference, with a pros/cons table and three reasons to move to dedicated: scale, specialization and orchestration.

**Supporting:**
1. **LLM Inference Handbook "Foundations" pages** (Modular/BentoML, free). *Use for:* a second explanation plus interactive visualizers of the request lifecycle.
   - https://handbook.modular.com/llm-inference-basics/what-is-llm-inference/
   - https://handbook.modular.com/llm-inference-basics/training-inference-differences/
   - https://handbook.modular.com/getting-started/serverless-vs-self-hosted-llm-inference/
   - https://handbook.modular.com/infrastructure-and-operations/what-is-llm-inference-infrastructure/
2. **"Building A Generative AI Platform"** by Chip Huyen (2024-07-25, free): https://huyenchip.com/2024/07/25/genai-platform.html . *Use for:* where the inference service sits inside a full GenAI application stack (Step 3 model router and gateway, Step 4 caches, plus the Observability section). The post assumes third-party APIs and does not cover model serving itself.
3. **The Open Source AI Definition 1.0** (Open Source Initiative, free): https://opensource.org/ai/open-source-ai-definition . *Use for:* precise "open weights vs open source" vocabulary. Open source AI requires data information, code **and** parameters under OSI-approved terms.
4. **"A Guide to AI Inference Engineering"** (ByteByteGo newsletter, Jun 15 2026, free; this is a roadmap seed link): https://blog.bytebytego.com/p/a-guide-to-ai-inference-engineering . *Use for:* a 15-minute overview of prefill and decode and six optimization families (batching, prefix caching, quantization, speculative decoding, parallelism, disaggregation), plus when to invest in self-hosting.

**Verified facts:**
- "more than two million [open models] and counting on Hugging Face" (book Preface, https://www.baseten.co/inference-engineering/book/preface.md).
- Book length and formats are listed under B1.

## M1: Metrics and phases
**Primary:** *Inference Engineering* **Chapter 1** (free online), in particular **§1.4 "Measuring Latency and Throughput"**: https://www.baseten.co/inference-engineering/book/01-prerequisites/measuring-latency-and-throughput/ . Read it with §1.2 (online vs offline, consumer vs B2B, AI-native) and §1.3 (model selection, evaluation, fine-tuning, distillation):
- https://www.baseten.co/inference-engineering/book/01-prerequisites/about-your-app/
- https://www.baseten.co/inference-engineering/book/01-prerequisites/model-selection/

Then read §2.2 for prefill and decode: https://www.baseten.co/inference-engineering/book/02-models/llm-inference-mechanics/

**Supporting:**
1. **NVIDIA NIM / AIPerf "Metrics"** (NVIDIA docs, free): https://docs.nvidia.com/nim/benchmarking/llm/metrics . The roadmap's `.../llm/latest/metrics.html` link now redirects here. *Use for:* canonical formulas: TTFT, e2e = TTFT + generation time, ITL = (e2e − TTFT)/(output tokens − 1) ("also known as time per output token (TPOT)"), system TPS vs per-user TPS, and RPS. The page warns: "compare results only when definitions align."
2. **"LLM Inference Performance Engineering: Best Practices"** (Databricks; Agarwal, Qureshi, Sardana, Li, Quevedo, Khudia; Oct 12 2023; free) [item 9]: https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices . *Use for:* the latency formula, the throughput-vs-latency trade-off with batch size, and Model Bandwidth Utilization (MBU). Its sections cover TTFT/TPOT, MBU, batching, tensor-parallel scaling and quantization.
3. **"Reproducible Performance Metrics for LLM inference"** (Anyscale; Kadous et al.; Nov 1 2023; free): https://www.anyscale.com/blog/reproducible-performance-metrics-for-llm-inference , with the LLMPerf tool at https://github.com/ray-project/llmperf . *Use for:* benchmarking pitfalls (tokenizer differences, input-length distributions, concurrency). It also shows a **different ITL convention: its average includes TTFT**, a useful contrast with NVIDIA.
4. **LLM Inference Handbook "Key metrics for LLM inference"** (free): https://handbook.modular.com/llm-inference-basics/llm-inference-metrics/ . *Use for:* TPOT, E2EL, goodput and SLOs, with an interactive Latency Metrics Playground.

**Topic picks** (all fetched 2026-10-12):
- **Percentiles and SLOs:**
  - Google SRE Book, ch. "Service Level Objectives" (free): https://sre.google/sre-book/service-level-objectives/
  - Gil Tene, "How NOT to Measure Latency" (Strange Loop, YouTube, free): https://www.youtube.com/watch?v=lJ8ydIuPFeU . Covers coordinated omission and why averages lie.
- **Online, offline and async:**
  - Google ML Crash Course, "Static vs. dynamic inference" (free, 10 min): https://developers.google.com/machine-learning/crash-course/production-ml-systems/static-vs-dynamic-inference
  - vLLM "Offline Inference" docs: https://docs.vllm.ai/en/latest/serving/offline_inference/
  - OpenAI Batch API guide (product context; moved to developers.openai.com): https://developers.openai.com/api/docs/guides/batch
  - Baseten "Using asynchronous inference in production" (Jul 11 2024; vendor post, but it gives usable queueing and backpressure guidance): https://www.baseten.co/blog/using-asynchronous-inference-in-production/
- **Reasoning models:**
  - Sebastian Raschka, "Understanding Reasoning LLMs" (Feb 5 2025, free): https://magazine.sebastianraschka.com/p/understanding-reasoning-llms . Covers inference-time scaling ("increases inference costs") and R1 distillation.
  - DeepSeek-R1, arXiv 2501.12948: https://arxiv.org/abs/2501.12948
  - Snell et al., "Scaling LLM Test-Time Compute Optimally…", arXiv 2408.03314: https://arxiv.org/abs/2408.03314
- **Model selection:**
  - Artificial Analysis (intelligence, speed and price comparisons; methodology page): https://artificialanalysis.ai/methodology
  - LLM Inference Handbook "Choosing the right model": https://handbook.modular.com/getting-started/choosing-the-right-model/
  - LMArena has rebranded: lmarena.ai now redirects to https://arena.ai/ .
- **Evaluation:**
  - Hamel Husain, "Your AI Product Needs Evals" (Mar 29 2024, free): https://hamel.dev/blog/posts/evals/ . Three levels: unit tests, human and model eval, A/B tests.
  - Hugging Face *Evaluation Guidebook* (Clémentine Fourrier et al.; free, CC BY-NC-SA). Current edition: https://huggingface.co/spaces/OpenEvals/evaluation-guidebook (updated 2025-12-04); the original repo https://github.com/huggingface/evaluation-guidebook is no longer maintained.
  - EleutherAI lm-evaluation-harness: https://github.com/EleutherAI/lm-evaluation-harness
- **Fine-tuning:**
  - LoRA, arXiv 2106.09685: https://arxiv.org/abs/2106.09685
  - Thinking Machines Lab, "LoRA Without Regret" (John Schulman et al., Sep 29 2025, free): https://thinkingmachines.ai/blog/lora/ . LoRA matches full fine-tuning when applied to all layers, especially the MLP layers, with about 10× the full-fine-tuning learning rate.
  - HF PEFT docs: https://huggingface.co/docs/peft/index
  - Unsloth docs (free Colab notebooks; moved from docs.unsloth.ai): https://unsloth.ai/docs
- **Distillation:**
  - Hinton, Vinyals and Dean, "Distilling the Knowledge in a Neural Network", arXiv 1503.02531: https://arxiv.org/abs/1503.02531
  - LLM Inference Handbook "LLM distillation": https://handbook.modular.com/model-preparation/llm-distillation/
  - Book §1.3.3 (R1-distilled Llama and Qwen models as the worked example).
- **Latency vs throughput, visualized:** SemiAnalysis **InferenceX** (formerly InferenceMAX, renamed; Apache-2.0; continuously benchmarks throughput vs interactivity across GPUs and engines). Dashboard: https://inferencex.semianalysis.com/ ; repo: https://github.com/SemiAnalysisAI/InferenceX . The old InferenceMAX/InferenceMAX repo says "Repo moved to SemiAnalysisAI/InferenceX".

**Verified facts:**
- "An ITL of 10 milliseconds equates to 100 tokens per second per user" (book §1.4).
- The book's table: TTFT is "Based on compute-bound prefill"; TPS is "Based on bandwidth-bound decode" (§1.4).
- Percentiles are explained as "P99 … 1 in every 100 requests is slower" (book §1.4.1).
- NVIDIA: `ITL = (e2e_latency − TTFT) / (Total_output_tokens − 1)`, "also known as time per output token (TPOT)". TPS per user "asymptotically approaches 1/ITL as the output sequence length increases" (https://docs.nvidia.com/nim/benchmarking/llm/metrics).
- Databricks:
  - "latency = (TTFT) + (TPOT) * (the number of tokens to be generated)"
  - MBU = (achieved memory bandwidth)/(peak memory bandwidth), where achieved = (total model parameter size + KV cache size)/TPOT
  - worked example: a 7B FP16 model at 14 ms TPOT moves about 1 TB/s, which is 50% MBU on a 2 TB/s GPU
  - continuous batching "can achieve 10x-20x better throughput than dynamic batching"
  - on 1×A100, batch 64 gave 14× the throughput at 4× the latency (MPT-7B)
  - (https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices)
- Artificial Analysis: output speed = "average number of tokens received per second, after the first token is received". For reasoning models, TTFT ends at the first reasoning token, with a separate answer-only variant. The blended price assumes "a 7:2:1 ratio of cache hit, input, and output tokens" (https://artificialanalysis.ai/methodology, as of 2026-10-12).
- RTF: the book defines it as a speed multiple, e.g. "an hour of audio in less than four seconds, for an RTF of 1000X" (§6.3.2). Classic ASR papers use processing time ÷ audio duration, where lower is better. State which convention a lesson uses.


## M2: Model architectures
**Primary:** *Inference Engineering* **§2.1 Neural Networks, §2.2 LLM Inference Mechanics, §2.3 Image Generation Inference Mechanics** (Kiely, Baseten; free online):
- https://www.baseten.co/inference-engineering/book/02-models/neural-networks/
- https://www.baseten.co/inference-engineering/book/02-models/llm-inference-mechanics/
- https://www.baseten.co/inference-engineering/book/02-models/image-generation-inference-mechanics/

**Supporting:**
1. **Andrej Karpathy, "Deep Dive into LLMs like ChatGPT"** (YouTube, free, 3h31m): https://www.youtube.com/watch?v=7xTGNNLPyMI ; inference section at 26:01. *Use for:* the end-to-end picture of tokenisation, pretraining and sampling. Pair with "Let's build GPT" https://www.youtube.com/watch?v=kCc8FmEb1nY (1h56m; 42:13 self-attention, 1:14:14 encoder vs decoder blocks, 1:21:59 multi-head; it has no KV cache). **[M1] [T4]** nanochat https://github.com/karpathy/nanochat has a KV cache in engine.py and `runs/runcpu.sh` runs on the M1.
2. **3Blue1Brown, Deep Learning ch. 5-6** (YouTube, free): ch. 5 https://www.youtube.com/watch?v=wjZofJX0v4M (27m; 22:22 softmax with temperature) and ch. 6 attention https://www.youtube.com/watch?v=eMlx5fFNoYc (26m); ch. 7 https://www.youtube.com/watch?v=9-Jl0dxWQs8 (22m). *Use for:* intuition on attention and MLP blocks. For diffusion: "But how do AI images and videos actually work?" https://www.youtube.com/watch?v=iv-5mZ_9CPY (37m; guest video by Welch Labs; 8:16 diffusion, 30:02 guidance).
3. **Sebastian Raschka, "Understanding and Coding the KV Cache in LLMs from Scratch"** (2025-06-17, free): https://magazine.sebastianraschka.com/p/coding-the-kv-cache-in-llms . *Use for:* a runnable KV-cache implementation **[M1]**. Add his "Big LLM Architecture Comparison" https://magazine.sebastianraschka.com/p/the-big-llm-architecture-comparison and "Visual Guide to Attention Variants" (2026-03-22) https://magazine.sebastianraschka.com/p/visual-attention-variants for GQA, MLA and MoE side by side.
4. **Jay Alammar, Illustrated Transformer** https://jalammar.github.io/illustrated-transformer/ and **Illustrated Stable Diffusion** https://jalammar.github.io/illustrated-stable-diffusion/ (free). *Use for:* diagrams. Also the Harvard Annotated Transformer https://nlp.seas.harvard.edu/annotated-transformer/ ; interactive: https://poloclub.github.io/transformer-explainer/ and https://bbycroft.net/llm .

**More picks by topic**
- **MoE:** HF blog https://huggingface.co/blog/moe (2023-12-11); Grootendorst "Visual Guide to MoE" https://newsletter.maartengrootendorst.com/p/a-visual-guide-to-mixture-of-experts (Mixtral about 46.7B total, about 12.8B active params per token, from the post) and video https://www.youtube.com/watch?v=sOPDGQjFcuM . Papers: GShard 2006.16668, Switch 2101.03961, Mixtral 2401.04088, DeepSeek-V3 2412.19437 (all https://arxiv.org/abs/<id>).
- **Attention variants (KV-size levers):** MQA 1911.02150; GQA 2305.13245; Mistral 7B 2310.06825 (sliding window); DeepSeek-V2 / MLA 2405.04434 (93.3% KV-cache reduction claimed; read section 2.1).
- **Diffusion and video papers:** DDPM 2006.11239; Latent Diffusion 2112.10752; DiT 2212.09748; Rectified Flow 2209.03003; SD3 2403.03206; few-step: Consistency Models 2303.01469, LCM 2310.04378, ADD 2311.17042, DMD2 2405.14867; video: Video Diffusion 2204.03458, Wan 2503.20314, HunyuanVideo 2412.03603. Blogs: Lilian Weng https://lilianweng.github.io/posts/2021-07-11-diffusion-models/ and https://lilianweng.github.io/posts/2024-04-12-diffusion-video/ ; Sander Dieleman https://sander.ai/2024/02/28/paradox.html and https://sander.ai/2022/05/26/guidance.html .
- **Build from scratch:** Raschka's repo https://github.com/rasbt/LLMs-from-scratch (free); the book is paid at https://www.manning.com/books/build-a-large-language-model-from-scratch . Do not use the unauthorised PDF at dl.tehrandata.org that appears in the roadmap seeds.
- **Courses:** Stanford CS336 (Spring 2026) https://cs336.stanford.edu/ , playlist PLoROMvodv4rMqXOcazWaTUHhq-yembLCV, lecture 1 https://www.youtube.com/watch?v=JuoVZkPBiKk ; HF LLM course https://huggingface.co/learn/llm-course (no inference content); Chip Huyen *AI Engineering* (paid; ch. 9 Inference Optimization) https://github.com/chiphuyen/aie-book .

**Verified facts:**
- Llama-3-8B KV cache per token = 2 (K and V) x 32 layers x 8 KV heads x 128 head_dim x 2 bytes (bf16) = 131,072 B (128 KiB). Source: my arithmetic from the model's config.json https://huggingface.co/NousResearch/Meta-Llama-3-8B/raw/main/config.json (head_dim 128 is derived from hidden size / heads, not a config field).
- General KV size formula 2 x bytes x H x K x L x T (scaling book): https://jax-ml.github.io/scaling-book/transformers/ . LLaMA 3-70B: 160 kB per token at int8, 5.3 GB for 32k tokens (https://jax-ml.github.io/scaling-book/applied-inference/ ).
- kipply's MHA formula: KV bytes per token = 4 x n_layers x d_model at 2 bytes (https://kipp.ly/p/transformer-inference-arithmetic). It assumes MHA, so GQA models are smaller.

## M3: Bottleneck analysis and attention optimisation
**Primary:** *Inference Engineering* **§2.4 Calculating Inference Bottlenecks** and **§2.5 Optimizing Attention** (free online):
- https://www.baseten.co/inference-engineering/book/02-models/calculating-inference-bottlenecks/
- https://www.baseten.co/inference-engineering/book/02-models/optimizing-attention/

**Supporting:**
1. **NVIDIA "GPU Performance Background User's Guide"** [item 8] (free): https://docs.nvidia.com/deeplearning/performance/dl-performance-gpu-background/index.html . *Use for:* section 4 defines arithmetic intensity and ops:byte; the V100 example is 125 TFLOPS / 900 GB/s; Table 1 shows a linear layer at batch 512 = 315 FLOPS/B versus batch 1 = 1. Companions: matmul guide https://docs.nvidia.com/deeplearning/performance/dl-performance-matrix-multiplication/index.html and fully-connected guide https://docs.nvidia.com/deeplearning/performance/dl-performance-fully-connected/index.html .
2. **kipply, "Transformer Inference Arithmetic"** [item 6] (2022-03-30, free): https://kipp.ly/p/transformer-inference-arithmetic . Link the `/p/` URL: `kipp.ly/transformer-inference-arithmetic/` redirects on GET but returns 404 to HEAD. *Use for:* hand-calculating KV size, decode latency and batch-size effects. It is 2022 vintage and MHA only.
3. **Horace He, "Making Deep Learning Go Brrrr From First Principles"** [item 5] (free; date not visible on the page): https://horace.io/brrr_intro.html . *Use for:* the compute / bandwidth / overhead framework and the factory analogy; read it before profiling.
4. **"How to Scale Your Model"** [item 3] (Google DeepMind; Austin, Douglas, Frostig, Levskaya, Chen, Vikram, Lebron, Choy, Ramasesh, Webson, Pope; 2025-02-04; free): https://jax-ml.github.io/scaling-book/ . *Use for:* rooflines and transformer accounting. Chapters under that base: `roofline/`, `tpus/`, `sharding/`, `transformers/` (KV caching; Appendix A: Flash Attention), `inference/` ("All About Transformer Inference"), `applied-inference/`, `profiling/`, `gpus/` ("How to Think About GPUs"). TPU/JAX-centric: take the reasoning and formulas, not the GPU numbers.

**Also useful**
- **Databricks** [item 9]: https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices (MBU; see M1).
- **HF Ultra-Scale Playbook** [item 4] (Tazi, Mom, Zhao, Nguyen, Mekkouri, Werra, Wolf, 2025; free web and PDF; training-focused): https://huggingface.co/spaces/nanotron/ultrascale-playbook . Transfers to inference: GPU primer, FlashAttention and fused-kernel sections, collectives/NCCL appendix, FP8 section. Does not transfer: ZeRO and optimizer state. PDF: https://huggingface.co/spaces/nanotron/ultrascale-playbook/resolve/main/The_Ultra-Scale_Playbook_Training_LLMs_on_GPU_Clusters.pdf . A Lulu paperback exists (price UNVERIFIED).
- **Modal GPU Glossary, Perf section** (free): https://modal.com/gpu-glossary/perf/roofline-model , .../arithmetic-intensity , .../memory-bound , .../compute-bound .
- **Roofline paper:** Williams, Waterman, Patterson, CACM 52(4):65-76 (Apr 2009): https://www2.eecs.berkeley.edu/Pubs/TechRpts/2008/EECS-2008-134.html (the ACM page, DOI 10.1145/1498765.1498785, returns 403 to bots). LLM roofline survey: https://arxiv.org/abs/2402.16363 . Pope et al. "Efficiently Scaling Transformer Inference": https://arxiv.org/abs/2211.05102 .
- **Companion site:** https://learn-inference.com/chapters/models/bottlenecks (independent; repeats the book's numbers).
- **Baseten blog:** https://www.baseten.co/blog/llm-transformer-inference-guide/ (A10 ops:byte 208.3; Llama-2-7B KV 524,288 B per token).
- **Diffusion bottlenecks:** PyTorch "Diffusion, Fast" https://pytorch.org/blog/accelerating-generative-ai-3/ (up to 3x on SDXL); Diffusers https://huggingface.co/docs/diffusers/optimization/fp16 .

**Attention optimisation (reading order)**
1. FlashAttention-1, arXiv 2205.14135; FA-2, 2307.08691 (50-73% of A100 peak; no Turing support; unofficial port https://github.com/ssiu/flash-attention-turing). **T4 note:** official FlashAttention 2 does not run on a T4; use PyTorch SDPA (memory-efficient backend) there.
2. FA-2 blog https://crfm.stanford.edu/2023/07/17/flash2.html ; FA-3 paper 2407.08608 and blog https://tridao.me/blog/2024/flash3/ ; FA-4 paper 2603.05451 (Blackwell) and analysis https://modal.com/blog/reverse-engineer-flash-attention-4 .
3. PagedAttention, 2309.06180 (SOSP 2023) and vLLM blog https://vllm.ai/blog/2023-06-20-vllm ; explainer https://handbook.modular.com/inference-optimization/pagedattention/ ; Gordić "Inside vLLM" https://vllm.ai/blog/2025-09-05-anatomy-of-vllm .
4. FlexAttention https://pytorch.org/blog/flexattention/ ; Character.AI KV reduction post (Wayback copy only for the technical post): https://web.archive.org/web/20241221102835/https://research.character.ai/optimizing-inference/ .
5. Video: GPU MODE lecture 12 FlashAttention https://www.youtube.com/watch?v=zEuwuCTEf_0 (1h12m); lecture 80 FA4 https://www.youtube.com/watch?v=VPslgC9piIw ; Stanford CS336 lectures 5-6 (GPUs, kernels) https://www.youtube.com/watch?v=izZba4UA7iY and https://www.youtube.com/watch?v=xnDHaNUvHBg ; Karpathy GPT-2 reproduction 2:00:18 flash attention https://www.youtube.com/watch?v=l8pRSuU81PU .

**Verified facts:**
- Roofline: attainable FLOP/s = min(peak compute, intensity x bandwidth). Decode at batch 1 is about 1 FLOP/byte, so it is memory-bound on every GPU in the M4 table.
- Ops:byte ratios (dense BF16/FP16 over bandwidth, my arithmetic from the NVIDIA pages in M4): H100 SXM about 295, A100 80GB about 153, T4 about 203.
- FA-3 (author blog): up to 740 TFLOPS FP16 at 75% utilisation, FP8 close to 1.2 PFLOPS (https://tridao.me/blog/2024/flash3/). A "840" figure seen elsewhere is UNVERIFIED.
- PagedAttention (vLLM blog): existing systems waste 60%-80% of KV memory, vLLM under 4%; up to 24x vs HF Transformers and 3.5x vs TGI (https://vllm.ai/blog/2023-06-20-vllm).
- A100 numbers in kipply/Horace are for the 40 GB part (312 TFLOPS, 1.5 TB/s); the 80 GB part is about 2.0 TB/s.
- Lab: derive ops:byte and KV tables in a notebook **[M1] [T4]**; profile attention with PyTorch SDPA on a T4.

## M4: Hardware
**Primary:** *Inference Engineering* **Chapter 3, §3.1-3.5** (free online): https://www.baseten.co/inference-engineering/book/03-hardware/gpu-architecture/ (then gpu-architecture-generations, instances, other-datacenter-accelerator-options, local-inference under the same `/book/03-hardware/` path).

**Supporting:**
1. **Modal GPU Glossary** [item 7] (Modal; Charles Frye main author; free; MIT repo https://github.com/modal-labs/gpu-glossary): https://modal.com/gpu-glossary . Sections: Device Hardware (16 pages), Device Software (17), Host Software (about 22), Perf (23). *Use for:* looking up SMs, warps, tensor cores, memory hierarchy. Hypertext only, no PDF, no date on the site. It gives no HBM bandwidth for the H100, so take bandwidth from NVIDIA below.
2. **NVIDIA Hopper architecture in depth** (2022-03-22): https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/ , plus the H100 whitepaper v1.04 (direct PDF) https://dam-cdn.nvd.orangelogic.com/AssetLink/705n6ur546g0uk43w0117r17n8042d73.pdf and the Blackwell brief v2.1 https://dam-cdn.nvd.orangelogic.com/AssetLink/gl2l4l4812s5fw0p614s6i8bv6mi3vx5.pdf . *Use for:* primary-source specs. The tuning guides give per-SM limits: https://docs.nvidia.com/cuda/hopper-tuning-guide/index.html (228 KB shared memory per SM, 50 MB L2) and https://docs.nvidia.com/cuda/blackwell-tuning-guide/index.html .
3. **Aleksa Gordić, "Inside NVIDIA GPUs: anatomy of high-performance matmul kernels"** (2025-09-29, free): https://www.aleksagordic.com/blog/matmul . *Use for:* how memory hierarchy shapes kernels. Also https://max.modular.com/gpu/architecture/ (Modular's GPU architecture pages, vendor-written).
4. **Apple Silicon and the learner's M1 Pro:** llama.cpp Apple Silicon benchmark thread https://github.com/ggml-org/llama.cpp/discussions/4167 (M1 Pro 16-core GPU, Q4_0 7B: about 266 t/s prompt processing at 512 tokens and about 36.4 t/s generation at 128 tokens); Apple announcement https://www.apple.com/newsroom/2021/10/introducing-m1-pro-and-m1-max-the-most-powerful-chips-apple-has-ever-built/ ; MLC LLM https://llm.mlc.ai/ ; Core ML Llama https://machinelearning.apple.com/research/core-ml-on-device-llama ; ExecuTorch https://docs.pytorch.org/executorch/stable/llm/getting-started.html . Book §3.5 covers local inference.

**Verified spec table** (NVIDIA headline FLOPS are sparse; dense is half. "Dense" below is the value used for ops:byte):

| Chip | Compute | Memory | Bandwidth | Interconnect | Power | Source |
|---|---|---|---|---|---|---|
| H100 SXM | BF16/FP16 989.4 TFLOPS dense (1,978.9 sparse, whitepaper Table 3); FP8 3,958 sparse | 80 GB | 3.35 TB/s | NVLink 900 GB/s; PCIe Gen5 128 GB/s | 700 W | https://www.nvidia.com/en-us/data-center/h100/ |
| H100 NVL | BF16 1,671 sparse | 94 GB | 3.9 TB/s | | | same page |
| H200 | 1,979 sparse | 141 GB | 4.8 TB/s | NVLink 900 GB/s | 700 W | https://www.nvidia.com/en-us/data-center/h200/ |
| A100 80GB | 312 dense / 624 sparse | 80 GB | 2,039 GB/s SXM; 1,935 PCIe | NVLink 600 GB/s | 400 W SXM | https://www.nvidia.com/en-us/data-center/a100/ |
| A100 40GB | 312 dense | 40 GB | 1,555 GB/s | | | same page |
| T4 | FP16 65 TFLOPS; INT8 130 TOPS; no BF16 | 16 GB GDDR6 | "320+" GB/s | PCIe | 70 W | https://www.nvidia.com/en-us/data-center/tesla-t4/ |
| L4 | FP16/BF16 242 sparse | 24 GB | 300 GB/s | | 72 W | https://www.nvidia.com/en-us/data-center/l4/ |
| B200 | 2.25 PFLOPS dense (derived: 36 PFLOPS sparse across 8 in the HGX table) | | 8 TB/s (derived from DGX B200 64 TB/s total) | NVLink 5 1.8 TB/s | | https://www.nvidia.com/en-us/data-center/hgx/ |
| GB200 NVL72 | 360 PFLOPS sparse / 180 dense | 13.4 TB | 576 TB/s | NVLink 130 TB/s | | https://www.nvidia.com/en-us/data-center/hgx/ and NVIDIA GB200 NVL72 product page (exact URL not re-fetched: UNVERIFIED) |
| Vera Rubin NVL72 (per GPU) | NVFP4 inference 50 PFLOPS sparse; training 35 dense | 288 GB HBM4 | 19.2 TB/s | NVLink 3 TB/s | | https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/ |
| AMD MI300X | 1,307.4 dense / 2,614.9 sparse | 192 GB | 5.3 TB/s | | 750 W | AMD datasheet PDF |
| AMD MI355X | 2.5166 PFLOPS dense | 288 GB | 8 TB/s | | | AMD datasheet |
| Google TPU v5e | bf16 197 TFLOPS | 16 GB | 800 GiB/s | | | https://docs.cloud.google.com/tpu/docs/v5e |
| TPU v6e | 918 TFLOPS | 32 GB | 1,638 GB/s | | | docs.cloud.google.com TPU pages |
| TPU7x | BF16 2,307 TFLOPS | 192 GiB | 7,380 GB/s | | | same |
| AWS Trainium2 | 667 BF16 dense | 96 GiB | 2.9 TB/s | | | AWS docs |
| AWS Inferentia2 | 190 | 32 GiB | 820 GiB/s | | | AWS docs |
| Apple M1 Pro | no official TFLOPS | 16 GB base (up to 32 GB) | up to 200 GB/s | | | Apple newsroom link above |

- NVLink generations: NVLink 4 900 GB/s, NVLink 5 1,800 GB/s, NVLink 6 3,000 GB/s (https://www.nvidia.com/en-us/data-center/nvlink/). NVLink-C2C 900 GB/s total (Grace Hopper blog, 2022-11-10).
- **Ops:byte** (dense / bandwidth, my arithmetic): H100 SXM about 295 (989.4e12 / 3.35e12; matches the Baseten book); A100 80GB about 153; A100 40GB about 201; T4 about 203; B200 about 281; M1 Pro about 26 (UNVERIFIED, since it uses a third-party 5.2 FP32 TFLOPS estimate).
- **Rows I could not complete:** MI325X (256 GB, 6 TB/s partial) and GB300 BF16 dense are UNVERIFIED. Cerebras and the Groq LPU numbers are UNVERIFIED; for Groq only titles and dates were read (NVIDIA-Groq licensing 2025-12-24; Groq 3 LPX with 128 GB on-chip SRAM per NVIDIA's 2026-03-16 release). The "$20B" deal figure is UNVERIFIED.

**Cloud instances:** AWS P5 https://aws.amazon.com/ec2/instance-types/p5/ (8x H100, 640 GB; P5e/P5en 1,128 GB; EFA up to 3,200 Gbps); AWS P6 https://aws.amazon.com/ec2/instance-types/p6/ (P6-B200 8 GPUs, 14.4 TB/s NVLink; the page shows an internal 1,432 vs 1,440 GB inconsistency). GCP A3/A4 pages: UNVERIFIED.

**Free GPUs for the labs:**
- Colab FAQ https://research.google.com/colaboratory/faq.html : GPU types "vary over time", resources are not guaranteed, free notebooks run at most 12 hours. The FAQ never names the T4, so "commonly a T4, not guaranteed".
- Kaggle docs are bot-blocked, so the quotas (about 30 h/week, P100 or 2x T4, about 9 h sessions) are UNVERIFIED.

**Verified facts (for lessons):**
- H100 SXM HBM3 bandwidth **3.35 TB/s**, memory 80 GB, 700 W: https://www.nvidia.com/en-us/data-center/h100/ .
- H100 SXM BF16 **989.4 TFLOPS dense** (1,978.9 with sparsity): H100 whitepaper Table 3, PDF link above.
- H100 SXM has 132 SMs (Modal SM page https://modal.com/gpu-glossary/device-hardware/streaming-multiprocessor).
- A100 40 GB bandwidth 1,555 GB/s and 80 GB 2,039 GB/s: https://www.nvidia.com/en-us/data-center/a100/ .
- Lab fit: **[M1]** MLX/llama.cpp bandwidth tests; **[T4]** nvidia-smi, torch.cuda properties, microbenchmarks; H100 and newer are **[read]**.

## M5: Software
**Primary:** *Inference Engineering* **Chapter 4, §4.1-4.5** (free online): https://www.baseten.co/inference-engineering/book/04-software/cuda/ (then deep-learning-frameworks-and-libraries, inference-engines, nvidia-dynamo, performance-benchmarking-and-load-testing under `/book/04-software/`; the HTML paths drop the numeric prefix, the Markdown ones keep it, e.g. `/book/04-software/4.3-inference-engines.md`).

**Supporting:**
1. **vLLM docs** (free): https://docs.vllm.ai/en/latest/ ; start with `getting_started/quickstart/` and `design/arch_overview/`. *Use for:* the reference engine for labs. Companion engines: SGLang https://docs.sglang.io/ (docs.sglang.ai redirects); TensorRT-LLM https://nvidia.github.io/TensorRT-LLM/ ; NVIDIA Dynamo https://docs.nvidia.com/dynamo/ ; llama.cpp https://github.com/ggml-org/llama.cpp (docs/build.md, tools/server/README.md) **[M1]**; MLX https://ml-explore.github.io/mlx/build/html/index.html and mlx-lm https://github.com/ml-explore/mlx-lm **[M1]**.
2. **CUDA:** CUDA Programming Guide https://docs.nvidia.com/cuda/cuda-programming-guide/ (v13.4.2); "An Even Easier Introduction to CUDA" (2025-05-02) https://developer.nvidia.com/blog/even-easier-introduction-cuda/ ; Best Practices Guide https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/ ; Simon Boehm's matmul worklog https://siboehm.com/articles/22/CUDA-MMM . Paid: *Programming Massively Parallel Processors* (Hwu, Kirk, El Hajj; 5th ed.; publication date inconsistent on the publisher site) https://shop.elsevier.com/books/programming-massively-parallel-processors/hwu/978-0-443-43900-1 . Triton tutorials https://triton-lang.org/main/getting-started/tutorials/index.html (02-fused-softmax, 06-fused-attention; which run on a T4 is UNVERIFIED). CUTLASS https://docs.nvidia.com/cutlass/latest/ .
3. **PyTorch performance:** torch.compile tutorial https://docs.pytorch.org/tutorials/intermediate/torch_compile_tutorial.html ; CUDA graphs https://pytorch.org/blog/accelerating-pytorch-with-cuda-graphs/ ; "Accelerating Generative AI: GPT, Fast" https://pytorch.org/blog/accelerating-generative-ai-2/ (repo meta-pytorch/gpt-fast, last push 2025-08); tuning guide https://docs.pytorch.org/tutorials/recipes/recipes/tuning_guide.html ; MPS notes https://docs.pytorch.org/docs/stable/notes/mps.html **[M1]**; profiler https://docs.pytorch.org/docs/stable/profiler.html and https://docs.pytorch.org/tutorials/recipes/recipes/profiler_recipe.html .
4. **Formats and libraries:** HF Transformers `llm_optims` https://huggingface.co/docs/transformers/main/en/llm_optims (use the `main/en` path); Diffusers https://huggingface.co/docs/diffusers/optimization/fp16 ; Safetensors https://huggingface.co/docs/safetensors/index and the audit https://huggingface.co/blog/safetensors-security-audit ; GGUF spec https://github.com/ggml-org/ggml/blob/master/docs/gguf.md ; formats overview https://huggingface.co/blog/ngxson/common-ai-model-formats ; ONNX Runtime https://onnxruntime.ai/docs/ ; TensorRT https://docs.nvidia.com/deeplearning/tensorrt/latest/index.html .

**Benchmarking and profiling**
- AIPerf https://github.com/ai-dynamo/aiperf (its README says GenAI-Perf is "being phased out"); vLLM bench CLI https://docs.vllm.ai/en/latest/benchmarking/cli/ (warns that repeated runs can reuse the prefix cache and inflate results); GuideLLM https://github.com/vllm-project/guidellm ; SGLang bench_serving https://docs.sglang.io/docs/developer_guide/bench_serving ; genai-bench https://sgl-project.github.io/genai-bench/ ; Locust https://docs.locust.io/en/stable/ .
- NVIDIA methodology posts: https://developer.nvidia.com/blog/llm-benchmarking-fundamental-concepts/ (2025-04-02) and https://developer.nvidia.com/blog/llm-performance-benchmarking-measuring-nvidia-nim-performance-with-genai-perf/ .
- Profilers: Holistic Trace Analysis https://hta.readthedocs.io/en/latest/ ; Nsight Systems https://docs.nvidia.com/nsight-systems/UserGuide/index.html ; Nsight Compute https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html ; vLLM profiling https://docs.vllm.ai/en/latest/contributing/profiling/ ; GPU MODE lecture 1, "Profiling CUDA kernels in PyTorch" https://www.youtube.com/watch?v=LuhJEEJQgUM .
- Videos: SGLang intro (Kiely and Zhang) https://www.youtube.com/watch?v=Ahtaha9fEM0 (43:42); Mark Moyou (NVIDIA) https://www.youtube.com/watch?v=9tvJ_GYJA-o (33:39); Woosuk Kwon vLLM talk https://www.youtube.com/watch?v=8BaEwoTk8XI ; GPU MODE lecture 35 SGLang https://www.youtube.com/watch?v=XQylGyG7yp8 and lecture 41 FlashInfer https://www.youtube.com/watch?v=iOLBJwENuvA.
- Courses: DeepLearning.AI "Fast and Efficient LLM Inference with vLLM" (Red Hat, 1h38m, updated 2026-06-05) https://www.deeplearning.ai/courses/fast-and-efficient-llm-inference-with-vllm ; "Efficient Inference with SGLang" (1h19m, updated 2026-04-22) https://www.deeplearning.ai/courses/efficient-inference-with-sglang-text-and-image-generation .

**Verified facts:**
- CUDA minor-version compatibility: CUDA 12.x needs driver 525 or later; CUDA 13.x needs 580 or later; CUDA 11.x needs 450 or later (https://docs.nvidia.com/deploy/cuda-compatibility/latest/minor-version-compatibility.html).
- vLLM docs: install and engine flags change often; always check `docs.vllm.ai/en/latest` against the version you installed. vLLM on Apple Silicon is not a first-class path; use llama.cpp or MLX **[M1]**; vLLM runs on a T4 **[T4]** with FP16 (the T4 lacks bf16).
- Gap: no neutral engine-comparison page; TensorRT-LLM "1.0" and vLLM V1 marketing claims are UNVERIFIED.


## M6: Inference techniques
**Primary:** *Inference Engineering* **Chapter 5, §5.1-5.5** (free online): https://www.baseten.co/inference-engineering/book/05-techniques/quantization/ (then speculative-decoding, caching, model-parallelism, disaggregation under `/book/05-techniques/`). Pair it with Aleksa Gordić's **"Inside vLLM: Anatomy of a High-Throughput LLM Inference System"** (2025-09-05, free): https://vllm.ai/blog/2025-09-05-anatomy-of-vllm (also https://www.aleksagordic.com/blog/vllm), which walks through the scheduler, continuous batching, paged KV cache, prefix caching, speculative decoding and disaggregation in one codebase.

### Quantization
- **Primary:** vLLM quantization docs and hardware matrix https://docs.vllm.ai/en/latest/features/quantization/ . **T4 note:** Turing has no FP8 W8A8; use INT8 W8A8, AWQ, GPTQ or bitsandbytes **[T4]**.
- **Supporting:**
  1. NVIDIA "Introducing NVFP4" (2025-06-24): https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference/ . *Use for:* block-scaled FP4 (16-element blocks vs 32 for MXFP4; about 3.5x smaller than FP16; "1% or less" degradation on DeepSeek-R1-0528, per NVIDIA; Blackwell only) **[read]**.
  2. llama.cpp `quantize`, `imatrix` and `perplexity` READMEs under https://github.com/ggml-org/llama.cpp/tree/master/tools (the perplexity README covers `--kl-divergence`). *Use for:* measuring quality loss locally **[M1]**.
  3. "Give Me BF16 or Give Me Death?", arXiv 2411.02355 and EleutherAI lm-evaluation-harness https://github.com/EleutherAI/lm-evaluation-harness . *Use for:* evidence on accuracy after quantization.
  4. PyTorch QAT blog (2024-11-12): https://pytorch.org/blog/quantization-aware-training/ (recovers up to 96% of the hellaswag and 68% of the wikitext perplexity degradation). Also NVIDIA Transformer Engine FP8 primer https://docs.nvidia.com/deeplearning/transformer-engine/examples/fp8_primer.html .
- **Tooling status:** NVIDIA Model Optimizer https://nvidia.github.io/Model-Optimizer/ (renamed from TensorRT-Model-Optimizer); vllm-project/llm-compressor active; casper-hansen/AutoAWQ is archived (last push 2025-05-11).
- **Papers:** GPTQ 2210.17323; AWQ 2306.00978; SmoothQuant 2211.10438; LLM.int8 2208.07339; FP8 formats 2209.05433; Microscaling (MX) 2310.10537; NVFP4 pretraining 2509.25149; QuaRot 2404.00456; SpinQuant 2405.16406; QLoRA 2305.14314. SparseGPT (a seed here) is pruning, not quantization.
- **Courses:** DeepLearning.AI Quantization Fundamentals (1h14m) https://www.deeplearning.ai/courses/quantization-fundamentals and Quantization in Depth (2h20m) https://www.deeplearning.ai/courses/quantization-in-depth ; MIT 6.5940 L5-6 https://www.youtube.com/watch?v=ymAzUz3qlIA and https://www.youtube.com/watch?v=wrcgWm_nUeE ; GPU MODE L73 https://www.youtube.com/watch?v=DFcKFDt0QEg .

### Speculative decoding
- **Primary:** vLLM docs https://docs.vllm.ai/en/latest/features/speculative_decoding/ (subpages eagle, n_gram, mtp, draft_model, suffix, speculators; several unread).
- **Supporting:**
  1. vLLM blog "How Speculative Decoding Boosts vLLM Performance by up to 2.8x" https://vllm.ai/blog/2024-10-17-spec-decode . *Use for:* the honest trade-off: up to 2.8x at QPS=1 but slowdowns of 1.4x and 1.8x at high QPS.
  2. HF "Assisted Generation" (Gante, 2023-05-11) https://huggingface.co/blog/assisted-generation . *Use for:* a small, runnable demo **[T4] [M1]**.
  3. NVIDIA intro https://developer.nvidia.com/blog/an-introduction-to-speculative-decoding-for-reducing-latency-in-ai-inference/ and TRT-LLM "up to 3.6x" (3.61x with Llama 3.2 3B drafting for 405B on 4xH200; vendor figure) https://developer.nvidia.com/blog/tensorrt-llm-speculative-decoding-boosts-inference-throughput-by-up-to-3-6x/ .
  4. SpecForge (LMSYS) https://www.lmsys.org/blog/2025-07-25-spec-forge/ . *Use for:* training your own EAGLE draft.
- **Papers:** Leviathan 2211.17192; Chen 2302.01318; EAGLE 2401.15077, EAGLE-2 2406.16858, EAGLE-3 2503.01840 (up to 6.5x claimed); Medusa 2401.10774; Lookahead 2402.02057. Prompt-lookup has no paper (repo https://github.com/apoorvumang/prompt-lookup-decoding). Repos: EAGLE (last push 2026-02), Medusa (dormant since 2024-06), vllm-project/speculators.
- **Video:** GPU MODE L22 "Speculative decoding in vLLM" https://www.youtube.com/watch?v=9wNAgpX6z_4 (1h09m).

### Caching and long context
- **Primary:** LMSYS RadixAttention / SGLang blog (2024-01-17): https://www.lmsys.org/blog/2024-01-17-sglang/ ; paper 2312.07104.
- **Supporting:**
  1. vLLM prefix caching design https://docs.vllm.ai/en/latest/design/prefix_caching/ and hybrid KV cache manager design/hybrid_kv_cache_manager/ . *Use for:* hash-based block reuse.
  2. llm-d "KV-cache wins you can see" (2025-09-24) https://llm-d.ai/blog/kvcache-wins-you-can-see . *Use for:* cache-aware routing results (P90 TTFT 0.542 s vs 92.551 s for random routing; 8,730 vs 4,428.7 tok/s). **Vendor benchmark; not reproducible on the learner's hardware.**
  3. LMCache https://docs.lmcache.ai/ (paper 2510.09665); SGLang HiCache blog https://www.lmsys.org/blog/2025-09-10-sglang-hicache/ . *Use for:* tiered KV storage.
  4. Provider prompt caching docs (product context): Anthropic https://platform.claude.com/docs and OpenAI https://developers.openai.com/ ; paths not re-fetched individually, UNVERIFIED.
- **Papers:** CacheBlend 2405.16444; Preble 2407.00023; StreamingLLM 2309.17453; Ring Attention 2310.01889 (repo https://github.com/haoliuhl/ringattention).
- **Gateway:** Gateway API Inference Extension https://gateway-api-inference-extension.sigs.k8s.io/ ; Dynamo KV-aware routing docs.

### Model parallelism
- **Primary:** vLLM parallelism and scaling https://docs.vllm.ai/en/latest/serving/parallelism_scaling/ (plus expert, data and context parallel pages).
- **Supporting:**
  1. LMSYS "Deploying DeepSeek with PD disaggregation and large-scale EP" https://www.lmsys.org/blog/2025-05-05-large-scale-ep/ . *Use for:* a real expert-parallel deployment (52.3k input and 22.3k output tok/s per node on 12x8 H100).
  2. DeepSeek inference system overview (open-infra-index, raw GitHub): peak 278 nodes, average 226.75, $87,072/day at an assumed $2 per GPU-hour, 608B input tokens (56.3% cache hit) and 168B output tokens. The "545% margin" is the vendor's own theoretical claim. DeepEP https://github.com/deepseek-ai/DeepEP .
  3. HF Ultra-Scale Playbook (TP, PP, EP, CP chapters; see M3) https://huggingface.co/spaces/nanotron/ultrascale-playbook .
  4. TensorRT-LLM parallel strategy page and SGLang EP docs.
- **Papers:** Megatron-LM 1909.08053 (tensor parallelism only; the roadmap mis-seeds it under expert and pipeline parallelism); PTD-P 2104.04473; GPipe 1811.06965; DeepSpeed-Inference 2207.00032; Llama 3 2407.21783 (section 6); DeepSeek-V3 2412.19437 (section 3.4); Pope et al. 2211.05102. Everything here is multi-GPU, so **[read]** for the learner.

### Disaggregation
- **Primary:** Hao AI Lab, "Disaggregated Inference: 18 Months Later" (DistServe retrospective, 2025-11-03): https://haoailab.com/blogs/distserve-retro/ ; original https://haoailab.com/blogs/distserve/ ; paper DistServe 2401.09670.
- **Supporting:**
  1. NVIDIA Dynamo docs (v1.5.1; append `.md`, index https://docs.nvidia.com/dynamo/llms.txt): https://docs.nvidia.com/dynamo/knowledge-base/concepts/system-architecture/disaggregated-serving , .../kubernetes/disaggregated-serving/overview , .../cli/disaggregated-serving/sizing-with-ai-configurator , .../kubernetes/auto-deployment/dynamo-planner .
  2. vLLM disaggregated prefill https://docs.vllm.ai/en/latest/features/disagg_prefill/ . *Use for:* a candid caveat: "Disaggregated prefill DOES NOT improve throughput" (experimental; connectors include LMCache, Nixl, Mooncake).
  3. llm-d architecture https://llm-d.ai/docs/architecture ; SGLang pd_disaggregation docs.
  4. Papers: Splitwise 2311.18677; Sarathi-Serve 2403.02310 (chunked prefill); Mooncake 2407.00079; GPU MODE L58 https://www.youtube.com/watch?v=tIPDwUepXcA (1h15m).
- Disaggregation needs two or more GPUs, so it is **[read]** for the learner. The Dynamo KVBM conceptual page is UNVERIFIED (the old kvbm_intro URL 404s).

### Other
- Orca (iteration-level scheduling): https://www.usenix.org/conference/osdi22/presentation/yu , PDF https://www.usenix.org/system/files/osdi22-yu.pdf ; the page text reads "36:9x", probably 36.9x, so confirm in the PDF before citing.
- Stanford CS336 L10 Inference https://www.youtube.com/watch?v=EfM546A79aM (1h25m); Spring 2025 fallback L10 https://www.youtube.com/watch?v=fcgPYo3OtV0 and the free syllabus-as-code https://github.com/stanford-cs336/spring2025-lectures (lecture_10.py).
- Survey: "Beyond the Buzz" 2506.05508.

**Verified facts:** all numbers above are vendor-reported, from the cited pages. Use ratios, not absolute speedups, in lessons, and reproduce on your own hardware: llama.cpp speculative decoding and quantization **[M1]**; vLLM with AWQ and prefix caching **[T4]**.

## M7: Beyond LLMs
**Primary:** *Inference Engineering* **Chapter 6, §6.1-6.6** (free online): https://www.baseten.co/inference-engineering/book/06-modalities/vision-language-models/ (then embedding-models, asr-models, tts-models, image-generation-models, video-generation-models under `/book/06-modalities/`). Per-modality picks follow.

### Vision-language models
- **Primary:** HF "Vision Language Models (Better, Faster, Stronger)" (2025-05-12): https://huggingface.co/blog/vlms-2025
- **Supporting:** vLLM multimodal inputs https://docs.vllm.ai/en/latest/features/multimodal_inputs/ (`limit_mm_per_prompt`, `--video-pruning-rate`); SGLang https://docs.sglang.io/docs/supported-models/multimodal_language_models ; MLX-VLM https://github.com/Blaizzy/mlx-vlm **[M1]**; Qwen2.5-VL-7B model card (28-multiple pixel rounding, 32,768 default context); Qwen3-VL-8B card (256K context, expandable to 1M).
- **Omni:** Qwen2.5-Omni-7B https://huggingface.co/Qwen/Qwen2.5-Omni-7B : BF16 theoretical minimum memory 31.11 GB for a 15 s video and 60.19 GB for 60 s (3B: 18.38 GB and 28.22 GB; real use is at least 1.2x). None fits a T4 **[read]**. vLLM-Omni https://github.com/vllm-project/vllm-omni .
- **Papers:** LLaVA 2304.08485; Qwen2-VL 2409.12191; Qwen2.5-VL 2502.13923; Qwen2.5-Omni 2503.20215; Qwen3-Omni 2509.17765.

### Embeddings
- **Primary:** Text Embeddings Inference https://huggingface.co/docs/text-embeddings-inference/index
- **Supporting:** Sentence Transformers efficiency https://sbert.net/docs/sentence_transformer/usage/efficiency.html (fp16 gave a 3.87x median speedup over FP32); vLLM pooling models https://docs.vllm.ai/en/latest/models/pooling_models/ ; Infinity https://github.com/michaelfeil/infinity ; Matryoshka blog https://huggingface.co/blog/matryoshka (8.3% of the dimensions keeps 98.37% of performance); Qwen3-Embedding-0.6B card (0.6B params, 32K context, MTEB multilingual mean 64.33; the 8B model scored 70.58, No. 1 on 2025-06-05); ModernBERT blog (8,192 context, base about 149M).
- **Papers:** E5 2212.03533; E5-mistral 2401.00368; Qwen3-Embedding 2506.05176; MTEB 2210.07316; Matryoshka 2205.13147.
- Runs on **[M1]** (Sentence Transformers on MPS, TEI, Infinity) and **[T4]** (Qwen3-Embedding-0.6B).

### Speech recognition
- **Primary:** faster-whisper https://github.com/SYSTRAN/faster-whisper . README benchmark: large-v2, 13 min of audio on an RTX 3070 Ti: openai/whisper fp16 2m23s using 4,708 MB; faster-whisper fp16 1m03s using 4,525 MB; batch 8 17s using 6,090 MB; int8 batch 8 16s using 4,500 MB (vendor-of-repo numbers, one GPU).
- **Supporting:** openai/whisper model sizes (tiny 39M about 1 GB, base 74M, small 244M about 2 GB, medium 769M about 5 GB, large 1550M about 10 GB, turbo 809M about 6 GB) https://github.com/openai/whisper ; whisper.cpp https://github.com/ggml-org/whisper.cpp (Metal; Core ML encoder more than 3x faster; whisper-server) **[M1]**; mlx-whisper **[M1]**; Open ASR Leaderboard, paper 2510.06961 (defines RTFx = total audio duration / transcription time, higher is better); NVIDIA Parakeet-TDT-0.6B-v2 (WER 6.05, RTFx 3380 at batch 128; NeMo on Linux) **[T4]**; Distil-Whisper 2311.00430; WhisperX.
- **Paper:** Whisper 2212.04356.
- **RTF convention warning:** the book and the Open ASR Leaderboard use a speed multiple (higher is better); classic ASR papers use processing time / audio duration (lower is better). Always state the convention.

### Voice activity detection, turn detection, TTS and voice agents
- **Primary (voice agents):** "Voice AI & Voice Agents: An Illustrated Primer" (Pipecat team, updated June 2026; author not named): https://voiceaiandvoiceagents.com/ . Section 5.1 sets a 1,500 ms voice-to-voice target. Its latency table (300 + 650 + 120 + 40 ms) sums to 1,110 ms while the text says about 1,200 and the table total reads 1,293, so cite the table cautiously.
- **Supporting:**
  1. Modal "One-second voice-to-voice latency" (Ben Shababo, 2025-11-04) https://modal.com/blog/low-latency-voice-bot . *Use for:* a worked pipeline with a one-second median.
  2. Silero VAD https://github.com/snakers4/silero-vad (30+ ms chunk in under 1 ms on one CPU thread; about 2 MB) **[M1] [T4]**; Pipecat https://docs.pipecat.ai/pipecat/learn/speech-input ; LiveKit turn detector https://docs.livekit.io/agents/logic/turns/turn-detector/ (default endpointing 0.3 s minimum, 2.5 s maximum).
  3. TTS: Kokoro-82M https://huggingface.co/hexgrad/Kokoro-82M (Apache-2.0; 82M params; 54 voices) **[M1] [T4]**; MLX-Audio https://github.com/Blaizzy/mlx-audio **[M1]**; Kyutai delayed-streams-modeling (400 streams on an H100) [read].
  4. Moshi https://github.com/kyutai-labs/moshi (160 ms theoretical, 200 ms practical on an L4; needs a 24 GB GPU) **[read]**; paper 2410.00037. Also CosyVoice2 2412.10117. Course: DeepLearning.AI "Voice for AI Agents" (1h26m) https://www.deeplearning.ai/courses/voice-for-ai-agents-and-applications .
- Orpheus and Sesame CSM look stale; their READMEs were not read (UNVERIFIED).

### Image and video generation
- **Primary:** Diffusers optimisation guide https://huggingface.co/docs/diffusers/optimization/fp16 (regional compilation cuts compile time 8-10x) and caching https://huggingface.co/docs/diffusers/optimization/cache
- **Supporting:**
  1. PyTorch "Flux Fast" https://pytorch.org/blog/presenting-flux-fast-making-flux-go-brrr-on-h100s/ (about 2.5x on H100; diffusion is compute-bound, in contrast to LLM decode) and Modal https://modal.com/blog/flux-3x-faster .
  2. xDiT https://github.com/xdit-project/xDiT (paper 2411.01738); SageAttention https://github.com/thu-ml/SageAttention (2410.02367); TeaCache 2411.19108; SVDQuant 2411.05007 with Nunchaku (repo now nunchux-ai/nunchaku; its README is internally inconsistent: 8.7x vs 10.1x).
  3. Wan2.1 https://github.com/Wan-Video/Wan2.1 (T2V-1.3B needs 8.19 GB; 5 s of 480p in about 4 min on a 4090) **[T4]** borderline; HunyuanVideo (60 GB minimum at 720p; xDiT 1,904 s on 1 GPU vs 337.58 s on 8, 5.64x) **[read]**; FLUX.1-dev is gated, 12B, non-commercial.
  4. ComfyUI (now Comfy-Org/ComfyUI). Cache-DiT's "9x" claim is UNVERIFIED.
- **Runs on M1:** Diffusers on MPS, small SD-class models. **Runs on T4:** Wan 1.3B, SD-class models.

**Verified facts:** see per-source numbers above. None of the speed claims transfer across hardware.

## M8: Production
**Primary:** *Inference Engineering* **Chapter 7, §7.1-7.5** (free online; skip §7.6): https://www.baseten.co/inference-engineering/book/07-production/containerization/ (then autoscaling, multi-cloud-capacity-management, testing-and-deployment, client-code under `/book/07-production/`).

### Containerization
- **Primary:** vLLM Docker docs https://docs.vllm.ai/en/latest/deployment/docker/ (`vllm/vllm-openai`, `--ipc=host`, HF cache mount).
- **Supporting:** NVIDIA Container Toolkit https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/index.html ; CUDA compatibility https://docs.nvidia.com/deploy/cuda-compatibility/latest/minor-version-compatibility.html ; uv with PyTorch https://docs.astral.sh/uv/guides/integration/pytorch/ ; NIM overview https://docs.nvidia.com/nim/large-language-models/latest/about-nim-llm/overview.html (NIM 2.0 is vLLM-only; licence terms UNVERIFIED).

### Autoscaling and cold starts
- **Primary:** Anyscale "How continuous batching enables 23x throughput" (2023-06-22) https://www.anyscale.com/blog/continuous-batching-llm-inference (up to 23x; OPT-13B on A100-40GB).
- **Supporting:** Modal GPU memory snapshots https://modal.com/blog/gpu-mem-snapshots (vLLM Qwen2.5-0.5B cold start 45 s to 5 s) and cold-start guide https://modal.com/docs/guide/cold-start ; vLLM sleep mode (dev-only endpoints; needs `VLLM_SERVER_DEV_MODE=1`); Run:ai Model Streamer (`--load-format runai_streamer`; repo moved to dsx-ai-factory/model-streamer); Kubernetes HPA (`ceil[current x currentMetric / desiredMetric]`, 15 s sync; scale to zero needs the HPAScaleToZero gate); KEDA https://keda.sh/docs/2.21/concepts/ ; Knative; KServe; Dynamo Planner https://docs.nvidia.com/dynamo/knowledge-base/modular-components/planner/overview.md .
- **Papers:** Orca (see M6); ServerlessLLM 2401.14351; Llumnix 2406.03243 (repo now llumnix-project/llumnix-ray).

### Routing and multi-tenancy
- **Primary:** Gateway API Inference Extension https://gateway-api-inference-extension.sigs.k8s.io/ (its Endpoint Picker moved to https://github.com/llm-d/llm-d-router ; several subpages 404).
- **Supporting:** llm-d scheduler https://llm-d.ai/docs/architecture/core/router/epp/scheduling ; vLLM production-stack https://docs.vllm.ai/projects/production-stack/en/latest/ ; AIBrix https://aibrix.readthedocs.io/latest/ (paper 2504.03648); S-LoRA 2311.03285 ("up to 4x"); Punica 2310.18547 ("12x"); VTC fairness 2401.00588; Mélange 2404.14527 (GPU choice for cost).

### Multi-cloud capacity
- **Primary:** Baseten "How we built multi-cloud capacity management" (2025-06-23; vendor post; "at least 6x faster"): https://www.baseten.co/blog/how-we-built-multi-cloud-capacity-management/
- **Supporting:** SkyPilot NSDI '23 https://www.usenix.org/conference/nsdi23/presentation/yang-zongheng and docs https://docs.skypilot.ai/en/latest/ ; dstack https://dstack.ai/docs/ ; SemiAnalysis ClusterMAX 2.0 (**paid**, 2025-11-06) https://newsletter.semianalysis.com/p/clustermax-20-the-industry-standard .

### Security, testing and deployment
- **Primary:** vLLM security guide https://docs.vllm.ai/en/latest/usage/security/ ("Do not rely exclusively on --api-key"; inter-node traffic is insecure by default).
- **Supporting:** OWASP Top 10 for LLM Apps 2025 https://genai.owasp.org/llm-top-10/ ; NIST AI RMF https://www.nist.gov/itl/ai-risk-management-framework (AI 100-1, 2023-01-26; AI 600-1, 2024-07-26); Kubernetes Deployment rolling updates; KServe canary example (predictive models only).

### Observability
- **Primary:** vLLM metrics https://docs.vllm.ai/en/latest/usage/metrics/ (65 metrics, e.g. `vllm:time_to_first_token_seconds`, `vllm:inter_token_latency_seconds`, `vllm:num_requests_running`, `vllm:kv_cache_usage_perc`).
- **Supporting:** vLLM Prometheus/Grafana example https://docs.vllm.ai/en/latest/examples/observability/prometheus_grafana/ ; SGLang production metrics https://docs.sglang.io/docs/references/production_metrics (`--enable-metrics`); OpenTelemetry GenAI conventions https://github.com/open-telemetry/semantic-conventions-genai (development status; `gen_ai.server.time_to_first_token`, `gen_ai.server.time_per_output_token`; the opentelemetry.io pages are stubs); DCGM-Exporter (port 9400).

### Client code
- vLLM OpenAI-compatible server docs; OpenAI streaming guide (developers.openai.com); Anthropic streaming (platform.claude.com); WHATWG Server-Sent Events spec; handbook OpenAI-compatible API page https://handbook.modular.com/model-interaction/openai-compatible-api/ . Exact paths of the OpenAI and Anthropic streaming pages were not re-fetched individually: UNVERIFIED.

### Cost
- Use Databricks (M1), Artificial Analysis methodology (M1) and the book's §7.4 cost estimation. No dedicated cost-per-million-tokens methodology source was re-verified.

**Verified facts:** Anyscale 23x, Modal 45 s to 5 s, vLLM 65 metrics, K8s HPA formula: all from the cited pages and vendor-reported. **[M1] [T4]**: run vLLM or llama.cpp in Docker with the metrics endpoint and scrape it with Prometheus; autoscaling and multi-cloud are **[read]**.


## Cross-module courses and videos [item 11]
- **Stanford CS336, Spring 2026** (free; lectures on YouTube): https://cs336.stanford.edu/ , playlist PLoROMvodv4rMqXOcazWaTUHhq-yembLCV. L2 resource accounting https://www.youtube.com/watch?v=kuYAsz7zspQ ; L5 GPUs/TPUs izZba4UA7iY ; L6 kernels/Triton xnDHaNUvHBg ; L10 Inference EfM546A79aM (1h25m). The 2026 lectures repo returns 404; use the Spring 2025 repo https://github.com/stanford-cs336/spring2025-lectures .
- **GPU MODE** lectures (free): index https://github.com/gpu-mode/lectures , reading list https://github.com/gpu-mode/resource-stream , channel @GPUMODE (about 34K subscribers). Inference-relevant: L12 FlashAttention, L22 speculative decoding, L35 SGLang, L41 FlashInfer, L58 disaggregation, L73 quantization, L80 FA4, L100 InferenceX https://www.youtube.com/watch?v=sV0PJC1dOmM . Advanced: L112 eujKd0lHegA, L113 loZ4xQ5RZuU. L14 Triton: video ID not found (UNVERIFIED).
- **MIT 6.5940 (Fall 2024)** https://hanlab.mit.edu/courses/2024-fall-65940 : L13 LLM deployment https://www.youtube.com/watch?v=sTz2tXG1T0c ; L15 long context kgTWKjbnrBA ; L18 diffusion LXrqmQrscf0 ; L9 distillation Ubj3QXv4rjw.
- **DeepLearning.AI short courses** (free to enrol for a limited time; certificate needs a paid plan): efficiently-serving-llms (Predibase, 2h09m), quantization-fundamentals, quantization-in-depth, SGLang, vLLM, voice agents; all at https://www.deeplearning.ai/courses/<slug> . Prices for the SGLang and vLLM courses are UNVERIFIED.
- **Other:** CMU 11-868 https://llmsystem.github.io/llmsystem2026spring/ ; CMU 15-442 https://mlsyscourse.org/ ; Stanford CS229S (public video availability UNVERIFIED); HF Diffusion course https://huggingface.co/learn/diffusion-course/unit0/1 (2022, dated).
- **No official vLLM YouTube channel** exists at the handles tried (@vllm-project and @vLLM return 404). A third-party playlist is PLUBL8w2KtS3M2if8k6-Om_7_sIV_swKRA; Red Hat's channel https://www.youtube.com/@redhat hosts vLLM content.

## Communities [item 13]

| Community | Link | Notes |
|---|---|---|
| GPU MODE Discord | https://discord.gg/gpumode | about 30.9k members; kernels, profiling, inference talks |
| Hugging Face Discord | https://hf.co/join/discord (redirects to discord.com/invite/JfAtkvEtRb) | about 242k members |
| HF forums | https://discuss.huggingface.co/ | Q&A on Transformers/Diffusers |
| vLLM forum | https://discuss.vllm.ai/ | 1,914 users |
| vLLM Slack | https://slack.vllm.ai (redirects to inviter.co/vllm-slack) | contributor oriented |
| vLLM office hours | biweekly | no schedule page found: UNVERIFIED |
| SGLang Slack | https://slack.sglang.io/ | returns 403 to bots: UNVERIFIED but likely alive |
| SGLang events | https://www.sglang.io/events | weekly office hours; SGLang Summit Nov 12-13, 2026, San Francisco |
| llama.cpp Discussions | https://github.com/ggml-org/llama.cpp/discussions | best source for Apple Silicon numbers |
| Latent Space | https://www.latent.space ; Discord https://discord.gg/xJJMRaWCRt | AI engineering news and podcast |
| MLOps Community | https://mlops.community/ ; Slack https://go.mlops.community/slack | production focus |
| r/LocalLLaMA | https://www.reddit.com/r/LocalLLaMA/ | 403 to bots; member count UNVERIFIED |

## Gaps
- **roadmap.sh page** liveness could not be re-checked from this session. Its seed list was checked offline: 306 URLs, 290 returned 200, 15 returned 403, 1 returned 000.
- **Baseten book downloads:** PDF/EPUB/M4B form fields not seen. Print price is verified; the Amazon price is not.
- **M3:** no GPU-specific decode roofline worked example beyond the Baseten book and kipply; no primary source quantifying diffusion arithmetic intensity; the handbook FlashAttention page and the Colfax FA3 post were not read; Gordić's Medium "ELI5 Flash Attention" is UNVERIFIED (403).
- **M4:** no official Apple TFLOPS figure, so the M1 Pro ops:byte is UNVERIFIED; MI325X, GB300, Groq and Cerebras specs UNVERIFIED; Kaggle quotas UNVERIFIED (docs bot-blocked); Colab GPU type is not guaranteed.
- **M5:** no neutral engine-comparison page; Metal and MLX page contents unread; which Triton tutorials run on a T4 UNVERIFIED.
- **M6:** several vLLM speculative-decoding subpages unread; vendor speed numbers cannot be reproduced on the learner's hardware; disaggregation and multi-node parallelism have no free hands-on path.
- **M7:** Orpheus and Sesame CSM READMEs unread; Cache-DiT "9x" claim and the Nunchaku speedup claims unreconciled; the voice primer's latency arithmetic is inconsistent.
- **M8:** no client-side latency-overhead source; no LLM-specific zero-downtime rollout source; no free GPU-procurement source beyond the paid ClusterMAX; no LLM-specific geo load-balancing source; no re-verified cost-per-million-tokens methodology.
- **Free durations:** many YouTube durations and 3Blue1Brown interactive lessons not checked.

## Dead/changed links
**Moved or renamed (use the new URL)**
- bentoml.com/llm/* -> handbook.modular.com/*
- blog.vllm.ai -> vllm.ai/blog
- docs.sglang.ai -> docs.sglang.io (the genai-bench docs path on docs.sglang.io 404s; use sgl-project.github.io/genai-bench/)
- hao-ai-lab.github.io -> haoailab.com
- docs.nvidia.com/dynamo/latest/index.html -> docs.nvidia.com/dynamo/ ; old Dynamo `/latest/architecture/*.html` and `/latest/observability/metrics.html` are 404
- NIM metrics `.../llm/latest/metrics.html` -> https://docs.nvidia.com/nim/benchmarking/llm/metrics ; NIM introduction.html is a meta-refresh to overview.html
- TensorRT docs -> .../tensorrt/latest/index.html
- TimDettmers/bitsandbytes -> bitsandbytes-foundation/bitsandbytes
- comfyanonymous/ComfyUI -> Comfy-Org/ComfyUI
- huggingface/safetensors -> safetensors/safetensors
- nunchaku -> nunchux-ai/nunchaku ; llumnix -> llumnix-project/llumnix-ray ; runai-model-streamer -> dsx-ai-factory/model-streamer
- TensorRT-Model-Optimizer -> NVIDIA/Model-Optimizer (old docs 404); Transformer Engine user-guide fp8 path 404 (use examples/fp8_primer.html)
- pytorch.org/tutorials recipes -> docs.pytorch.org/tutorials
- lmarena.ai -> arena.ai ; docs.unsloth.ai -> unsloth.ai/docs
- platform.openai.com -> developers.openai.com ; docs.anthropic.com -> platform.claude.com
- cloud.google.com TPU/GPU docs -> docs.cloud.google.com ; docs.skypilot.co -> docs.skypilot.ai
- InferenceMAX -> SemiAnalysisAI/InferenceX
- LiveKit /agents/build/turns/ -> /agents/logic/turns/ ; ml-explore/mlx-audio is 404 (real repo Blaizzy/mlx-audio)
- groq.com/lpu-architecture redirects to /platform ; B200 product page redirects to /hgx/
- Character.AI technical post redirects to the blog home (Wayback copy given in M3)
- kipp.ly/transformer-inference-arithmetic/ (HEAD gives 404; use the /p/ URL)

**Dead (404)**
- YouTube EZE-2xYpvOw; CS336 2026 lectures repo; nvidia.com/en-us/data-center/b300/ and .../vera-rubin-nvl144/; ROCm "how-to/rocm-for-ai/inference" (use https://rocm.docs.amd.com/projects/ai-ecosystem/en/latest/inference/vllm.html); vLLM priority_scheduling page and `examples/online_serving/prometheus_grafana/`; semianalysis.com/clustermax/; old docs.sglang.ai multimodal URL; Dynamo kvbm_intro.

**Bot-blocked (403) or unreachable: could not verify**
- Five Medium posts; gigagpu.com whisper RTF; openai.com/index/whisper/; pub.towardsai.net; akamai.com; buildmvpfast.com; cloudflare.com (two); oreilly.com (two: AI Engineering; AI Systems Performance Engineering); Reddit; Kaggle docs; ACM DL (roofline DOI); Red Hat quantization blog; en.eeworld.com.cn (unreachable).

**Do not use**
- https://dl.tehrandata.org/book/Build-a-large-language-models.pdf : HTTP 200, application/pdf, 15,438,848 bytes, an unauthorised copy of Raschka's Manning book. Replacement: the Manning page and the free repo in M2.
- Weak seed domains (SEO or low-signal): IBM "think/topics", emergentmind, taskade, nhimg, cb4uhost, moduledge, ionos, atlantic.net, runpod, northflank, onesourcecloud, translated.com, kling.ai, wirestock, koat.ai. Mis-seeded items: DDIA and SRE books reused across unrelated topics; Megatron 1909.08053 under expert/pipeline parallelism; Llama 3 under autoscaling; Segment Anything; SparseGPT labelled as quantization; Longformer, Reformer, ALiBi and Mamba under attention variants; GPT-3 under inference-vs-training.

**Book errata:** see B1 (TeaCache title and author, Ring Attention author, RTF convention).

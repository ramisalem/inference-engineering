/* Single source of truth for the syllabus, schedule and roadmap coverage.
 * Rendered by assets/course-pages.js into reference/syllabus.html and reference/schedule.html.
 * When a lesson is written, set ready: true (its file lives at lessons/<slug>.html). */
window.COURSE = {
  title: "Inference Engineering",
  roadmapUrl: "https://roadmap.sh/inference-engineering",
  start: "2026-10-12",
  end: "2027-01-10",
  hoursPerWeek: 5,

  parts: [
    { id: 1, title: "Outside in", tagline: "Treat the model as a black box: serve it, measure it, choose it.", lessons: [1, 2, 3] },
    { id: 2, title: "Inside the model", tagline: "Just enough neural networks and transformers to reason about speed and memory.", lessons: [4, 5, 6] },
    { id: 3, title: "Performance physics & hardware", tagline: "Rooflines, memory bandwidth and the GPUs the industry runs on.", lessons: [7, 8, 9, 10] },
    { id: 4, title: "The software stack", tagline: "Attention kernels, engines, runtimes, profilers and your first GPU kernel.", lessons: [11, 12, 13, 14, 15] },
    { id: 5, title: "Inference techniques", tagline: "The optimizations interviews and real deployments revolve around.", lessons: [16, 17, 18, 19, 20, 21] },
    { id: 6, title: "Beyond LLMs", tagline: "Embeddings, vision, speech and image generation: different bottlenecks, same physics.", lessons: [22, 23, 24] },
    { id: 7, title: "Production", tagline: "Containers, autoscaling, routing, observability and cost: where your app-dev skills transfer.", lessons: [25, 26, 27, 28] },
    { id: 8, title: "Capstone & interview", tagline: "Turn the labs into a portfolio and rehearse the interview.", lessons: [29, 30] },
  ],

  /* platform: mac = your M1 Pro · colab = free Colab T4 · kaggle = free Kaggle 2×T4 · sim = calculator/simulation (runs anywhere)
     depth: core = full depth (interview-critical) · light = awareness-level, shorter lab */
  lessons: [
    { n: 1, slug: "0001-first-served-model", ready: true, title: "Your first served model: TTFT, ITL & tokens/sec", win: "Measure what a user feels (TTFT, ITL, decode speed, end-to-end latency) on a model served from your Mac, and explain what each one depends on.", platform: ["mac"], depth: "core", hours: 1.5 },
    { n: 2, slug: "0002-latency-vs-throughput", ready: true, title: "Latency vs throughput: load-testing your server", win: "Plot your server's latency–throughput curve with p50/p95/p99 under concurrent load.", platform: ["mac"], depth: "core", hours: 1.5 },
    { n: 3, slug: "0003-choosing-a-model", title: "Choosing a model: open vs closed, quality vs cost", win: "Run a mini-eval of two small models and write a one-page model-selection memo.", platform: ["mac"], depth: "light", hours: 1 },
    { n: 4, slug: "0004-neural-networks-for-engineers", title: "Neural networks for engineers: tensors, FLOPs & bytes", win: "Build and time a tiny network in PyTorch; compute its parameters, memory and FLOPs per forward pass.", platform: ["mac"], depth: "core", hours: 1.5 },
    { n: 5, slug: "0005-inside-an-llm", title: "Inside an LLM: tokens, transformer blocks & attention", win: "Write your own token-by-token generation loop around a real small LLM.", platform: ["mac"], depth: "core", hours: 2 },
    { n: 6, slug: "0006-prefill-decode-kv-cache", title: "Prefill, decode & the KV cache", win: "Measure generation with and without a KV cache, and size the KV cache of any model with one formula.", platform: ["mac"], depth: "core", hours: 2 },
    { n: 7, slug: "0007-roofline", title: "Arithmetic intensity & the roofline model", win: "Plot a roofline for your Mac and place measured matrix multiplies on it.", platform: ["mac", "colab"], depth: "core", hours: 2 },
    { n: 8, slug: "0008-why-decode-is-memory-bound", title: "Why decode is memory-bound (and what that means on your laptop)", win: "Predict your Mac's tokens/sec from memory bandwidth, then verify it with llama-bench.", platform: ["mac"], depth: "core", hours: 1.5 },
    { n: 9, slug: "0009-inside-a-gpu", title: "Inside a GPU: compute, memory & the free T4", win: "Measure a real NVIDIA GPU's bandwidth and FLOPS on Colab and compare them with its spec sheet.", platform: ["colab"], depth: "core", hours: 2 },
    { n: 10, slug: "0010-gpu-models-and-sizing", title: "GPU models, interconnects & sizing a deployment", win: "Pick the GPU type and count for a model + latency target with napkin math.", platform: ["sim"], depth: "light", hours: 1 },
    { n: 11, slug: "0011-attention-optimization", title: "Attention optimization: FlashAttention, PagedAttention & GQA", win: "Benchmark naive vs fused attention and compute GQA's KV-cache savings for real model configs.", platform: ["colab", "mac"], depth: "core", hours: 1.5 },
    { n: 12, slug: "0012-vllm-continuous-batching", title: "vLLM & continuous batching", win: "Serve a model with vLLM on a free GPU and measure throughput as concurrency rises.", platform: ["colab"], depth: "core", hours: 2 },
    { n: 13, slug: "0013-benchmarking-profiling", title: "Benchmarking & profiling like a pro", win: "Produce a reproducible benchmark report and read a GPU profiler trace.", platform: ["mac", "colab"], depth: "core", hours: 2 },
    { n: 14, slug: "0014-frameworks-formats-runtimes", title: "PyTorch, model formats & runtimes", win: "Compare eager PyTorch, torch.compile and ONNX Runtime on one model; inspect a safetensors file.", platform: ["mac", "colab"], depth: "core", hours: 1.5 },
    { n: 15, slug: "0015-gpu-kernels-triton", title: "GPU kernels: fusion & your first Triton kernel", win: "Write, test and benchmark a fused Triton kernel against PyTorch.", platform: ["colab"], depth: "core", hours: 2 },
    { n: 16, slug: "0016-quantization", title: "Quantization: number formats, PTQ & QAT", win: "Quantize one model to four precisions and chart size vs speed.", platform: ["mac", "colab"], depth: "core", hours: 2 },
    { n: 17, slug: "0017-measuring-quality-impact", title: "Measuring quality impact", win: "Use perplexity plus a task eval to pick the best quantization level.", platform: ["mac"], depth: "core", hours: 1.5 },
    { n: 18, slug: "0018-speculative-decoding", title: "Speculative decoding", win: "Measure speculative decoding's speedup and acceptance rate across prompt types.", platform: ["mac", "colab"], depth: "core", hours: 2 },
    { n: 19, slug: "0019-caching", title: "Caching: prefix caching, KV storage & long context", win: "Cut TTFT with prefix caching on SGLang/vLLM and explain RadixAttention.", platform: ["colab", "mac"], depth: "core", hours: 2 },
    { n: 20, slug: "0020-model-parallelism", title: "Model parallelism: tensor, pipeline & multi-node", win: "Run vLLM with tensor parallelism across two GPUs and explain its communication cost.", platform: ["kaggle"], depth: "core", hours: 2 },
    { n: 21, slug: "0021-moe-and-disaggregation", title: "MoE, expert parallelism & disaggregated serving", win: "Simulate colocated vs disaggregated prefill/decode and explain when disaggregation pays off.", platform: ["sim"], depth: "core", hours: 1.5 },
    { n: 22, slug: "0022-embeddings-and-vlms", title: "Embeddings & vision-language models", win: "Show embedding inference is compute-bound (throughput vs batch size) and count a VLM's image tokens.", platform: ["mac"], depth: "light", hours: 1 },
    { n: 23, slug: "0023-speech", title: "Speech: VAD, ASR, TTS & real-time factor", win: "Build a mini voice pipeline and measure its real-time factor and time to first audio.", platform: ["mac"], depth: "light", hours: 1 },
    { n: 24, slug: "0024-image-video-generation", title: "Image & video generation inference", win: "Measure the step-count vs latency trade-off of a few-step image model on your Mac.", platform: ["mac"], depth: "light", hours: 1 },
    { n: 25, slug: "0025-containers-cold-starts", title: "Containers, dependencies & cold starts", win: "Containerize a model server, then measure and cut its cold start.", platform: ["mac"], depth: "core", hours: 2 },
    { n: 26, slug: "0026-autoscaling-routing", title: "Autoscaling, queueing & routing", win: "Build a cache-aware router across replicas and beat round-robin on p99.", platform: ["mac"], depth: "core", hours: 2 },
    { n: 27, slug: "0027-observability-deploys", title: "Observability, testing & zero-downtime deploys", win: "Build a live TTFT/ITL dashboard and swap models with zero downtime.", platform: ["mac"], depth: "core", hours: 2 },
    { n: 28, slug: "0028-cost-capacity-multicloud", title: "Cost, capacity & multi-cloud", win: "Build a $/1M-tokens cost model and find the API-vs-dedicated breakeven.", platform: ["sim"], depth: "light", hours: 1 },
    { n: 29, slug: "0029-capstone", title: "Capstone: serve, optimize, report", win: "Publish a benchmarked, observable, cost-estimated deployment repo and write-up.", platform: ["colab", "kaggle", "mac"], depth: "core", hours: 3 },
    { n: 30, slug: "0030-interview-prep", title: "Interview prep: napkin math & system design", win: "Pass a mock 'design an LLM serving system' interview with your teacher.", platform: ["sim"], depth: "core", hours: 2 },
  ],

  weeks: [
    { n: 1,  from: "2026-10-12", to: "2026-10-18", items: ["setup", 1, 2, 3], portfolio: "Baseline: TTFT / ITL / TPS of Llama 3.2 3B on M1 Pro" },
    { n: 2,  from: "2026-10-19", to: "2026-10-25", items: [4, 5, "review"], portfolio: "Hand-written generation loop" },
    { n: 3,  from: "2026-10-26", to: "2026-11-01", items: [6, 7, "review"], portfolio: "KV-cache calculator + Mac roofline plot" },
    { n: 4,  from: "2026-11-02", to: "2026-11-08", items: [8, 9, 10], portfolio: "Predicted vs measured tokens/sec; T4 bandwidth test" },
    { n: 5,  from: "2026-11-09", to: "2026-11-15", items: ["checkpoint-a", 11, 12], portfolio: "First vLLM deployment + concurrency curve" },
    { n: 6,  from: "2026-11-16", to: "2026-11-22", items: [13, 14, "review"], portfolio: "Reproducible benchmark report" },
    { n: 7,  from: "2026-11-23", to: "2026-11-29", items: [15, 16, "review"], portfolio: "Triton kernel + quantization size/speed chart" },
    { n: 8,  from: "2026-11-30", to: "2026-12-06", items: [17, 18, "review"], portfolio: "Quality-vs-speed quantization decision; spec-decode results" },
    { n: 9,  from: "2026-12-07", to: "2026-12-13", items: ["checkpoint-b", 19, 20], portfolio: "Prefix-caching and tensor-parallel experiments" },
    { n: 10, from: "2026-12-14", to: "2026-12-20", items: [21, 22, 23, 24], portfolio: "Disaggregation simulator; RTF + embedding measurements" },
    { n: 11, from: "2026-12-21", to: "2026-12-27", items: [25, 26, "review"], portfolio: "Containerized server + cache-aware router" },
    { n: 12, from: "2026-12-28", to: "2027-01-03", items: [27, 28, "checkpoint-c", "capstone-start"], portfolio: "Grafana dashboard + cost model" },
    { n: 13, from: "2027-01-04", to: "2027-01-10", items: [29, 30], portfolio: "Capstone repo + write-up, published" },
  ],

  extras: {
    "setup": { title: "Setup: lab environment & portfolio repo", hours: 0.5 },
    "review": { title: "Spaced review (re-do missed exercises from earlier lessons)", hours: 0.5 },
    "checkpoint-a": { title: "Checkpoint A: mixed retrieval quiz on Lessons 1–10", hours: 0.5 },
    "checkpoint-b": { title: "Checkpoint B: mixed retrieval quiz on Lessons 1–18", hours: 0.5 },
    "checkpoint-c": { title: "Checkpoint C: mixed retrieval quiz on the whole course", hours: 0.5 },
    "capstone-start": { title: "Capstone kickoff: pick model, workload and target", hours: 1 },
  },

  /* The roadmap, node by node, with the lesson that teaches each node.
     A topic with label:true is a sidebar grouping on roadmap.sh, not a node itself. */
  roadmap: [
    { section: "Introduction", topics: [
      { name: "Introduction", lesson: 1, subs: [["Open vs Closed Models", 3], ["Inference vs. Training", 1], ["Shared vs. Dedicated Inference", 3], ["The Inference Stack", 1]] },
      { name: "Basic Terminology: Latency Metrics", label: true, subs: [["Time to First Token", 1], ["Tokens Per Second", 1], ["Inter-Token Latency", 1], ["Latency vs. Throughput", 2], ["Latency Percentiles", 2], ["End-to-End Metrics", 2], ["Real-Time Factor", 23]] },
      { name: "Basic Terminology: Inference Phases", label: true, subs: [["Prefill & Decode Phases", 6], ["Online vs. Offline Inference", 2], ["Asynchronous Inference", 2]] },
      { name: "Basic Terminology: Application Context", label: true, subs: [["AI-Native Applications", 3], ["Consumer vs. B2B", 3], ["Reasoning Models", 3]] },
      { name: "Basic Terminology: Model Strategy", label: true, subs: [["Model Selection", 3], ["Model Evaluation", 3], ["Fine-Tuning", 3], ["Distillation", 3]] },
    ] },
    { section: "Models & Performance", topics: [
      { name: "Neural Networks", lesson: 4, subs: [["Encoder-Decoder Architecture", 4]] },
      { name: "Large Language Models", lesson: 5, subs: [["Transformer Blocks", 5], ["Attention Mechanism", 5], ["KV Cache", 6], ["Mixture of Experts (MoE)", 21]] },
      { name: "Image & Video Models", lesson: 24, subs: [["Diffusion Models", 24], ["Image Generation Architecture", 24], ["Few-Step Image Generation", 24], ["Video Generation Models", 24]] },
      { name: "Bottleneck Analysis", lesson: 7, subs: [["Ops:Byte Ratio", 7], ["Arithmetic Intensity", 7], ["Roofline Model", 7], ["LLM Bottlenecks", 8], ["Image & Video Bottlenecks", 24]] },
      { name: "Attention Optimization", lesson: 11, subs: [["FlashAttention", 11], ["PagedAttention", 11], ["Attention Variants", 11]] },
    ] },
    { section: "Hardware", topics: [
      { name: "GPU Architecture", lesson: 9, subs: [["Compute", 9], ["Memory", 9], ["Instances & Interconnects", 10], ["Sizing & Procurement", 10]] },
      { name: "GPU Models", lesson: 10, subs: [["NVIDIA", 10], ["Hopper", 10], ["Blackwell", 10], ["Grace & Vera", 10], ["Other Accelerators", 10]] },
      { name: "Local & Edge Inference", lesson: 8, subs: [["Desktop Inference", 8], ["Mobile Inference", 8]] },
    ] },
    { section: "Software", topics: [
      { name: "CUDA", lesson: 15, subs: [["Kernel Selection & Fusion", 15], ["Writing Custom Kernels", 15]] },
      { name: "Frameworks & Libraries", lesson: 14, subs: [["PyTorch", 14], ["Transformers & Diffusers", 14]] },
      { name: "Model Formats & Runtimes", lesson: 14, subs: [["safetensors", 14], ["TensorRT", 14], ["ONNX Runtime", 14]] },
      { name: "Inference Engines", lesson: 12, subs: [["vLLM", 12], ["SGLang", 19], ["TensorRT-LLM", 12], ["NVIDIA Dynamo", 21]] },
      { name: "Benchmarking & Profiling", lesson: 13, subs: [["Performance Benchmarking", 13], ["AIPerf", 13], ["Locust", 13], ["SGLang Genai-bench", 13], ["Profiling Performance", 13]] },
    ] },
    { section: "Inference Techniques", topics: [
      { name: "Quantization", lesson: 16, subs: [["Quantization-Aware Training", 16], ["Post-Training Quantization", 16], ["ModelOpt", 16], ["Measuring Quality Impact", 17]] },
      { name: "Speculative Decoding", lesson: 18, subs: [["Draft-Target Decoding", 18], ["EAGLE", 18], ["N-gram", 18]] },
      { name: "Caching", lesson: 19, subs: [["Caching Approaches", 19], ["KV Cache Storage", 19], ["Cache-Aware Routing", 26], ["Long Context Handling", 19]] },
      { name: "Model Parallelism", lesson: 20, subs: [["Pipeline Parallelism", 20], ["Tensor Parallelism", 20], ["Expert Parallelism", 21], ["Multi-Node Inference", 20]] },
      { name: "Disaggregation", lesson: 21, subs: [["NVIDIA Dynamo", 21]] },
    ] },
    { section: "Inference Beyond LLMs", topics: [
      { name: "Vision Language Models", lesson: 22, subs: [["Video Processing for VLMs", 22], ["Omni-Modal Models", 22]] },
      { name: "Embedding Models", lesson: 22, subs: [["BERT-style models", 22], ["LLM-based models", 22], ["Embedding Model Inference", 22]] },
      { name: "Speech", lesson: 23, subs: [["Voice Activity Detection", 23], ["Automatic Speech Recognition", 23], ["Text-to-Speech (TTS)", 23], ["Streaming TTS", 23], ["Speech-to-Speech Models", 23]] },
      { name: "Image & Video Generation", lesson: 24, subs: [["Image Generation Inference", 24], ["Video Generation Inference", 24]] },
    ] },
    { section: "Production", topics: [
      { name: "Containerization", lesson: 25, subs: [["Dependency Management", 25], ["NIMs", 25]] },
      { name: "Autoscaling", lesson: 26, subs: [["Continuous Batching", 12], ["Cold Starts", 25], ["Routing & Load Balancing", 26], ["LoRA-Aware Routing", 26], ["Request Queueing", 26], ["Scale to Zero", 26], ["Independent Component Scaling", 26]] },
      { name: "Multi-Cloud", lesson: 28, subs: [["GPU Procurement", 28], ["Capacity Management", 28], ["Geo-Aware Load Balancing", 28]] },
      { name: "Testing & Deployment", lesson: 27, subs: [["Security and Compliance", 27], ["Zero-Downtime Deployment", 27], ["Cost Estimation", 28], ["Observability", 27]] },
    ] },
  ],
};

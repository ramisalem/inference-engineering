/* Reusable inline-SVG diagrams. Usage:
 *   <figure data-diagram="stream-timeline"><figcaption>…</figcaption></figure>
 * The SVG is inserted before the figcaption. Colours come from course.css (svg .t-*, .f-*, .s-* classes),
 * so diagrams follow the light/dark theme and print cleanly. */
(function () {
  "use strict";
  const D = {};

  /* Streamed response: request → queue+prefill → first token → evenly spaced decode tokens → last token. */
  D["stream-timeline"] = function () {
    const ticks = [];
    for (let x = 218; x <= 582; x += 28) ticks.push(`<line x1="${x}" y1="104" x2="${x}" y2="118"/>`);
    return `<svg viewBox="0 0 640 168" role="img" aria-label="Timeline of a streamed response: request sent, a block of queueing and prefill, the first token, then evenly spaced tokens until the last token. TTFT spans from request to first token; ITL is the gap between two tokens; end-to-end latency spans the whole response.">
      <path d="M30,30 V22 H582 V30" class="s-ink" stroke-width="1.5"/>
      <text x="306" y="15" font-size="12" font-weight="600" text-anchor="middle">end-to-end latency (E2E)</text>
      <path d="M30,62 V54 H190 V62" class="s-accent" stroke-width="1.5"/>
      <text x="110" y="47" font-size="12" font-weight="600" text-anchor="middle" class="t-accent">TTFT</text>
      <path d="M414,96 V90 H442 V96" class="s-lab" stroke-width="1.5"/>
      <text x="428" y="84" font-size="11" font-weight="600" text-anchor="middle" class="t-lab">ITL</text>
      <rect x="31" y="100" width="158" height="18" class="f-key"/>
      <text x="110" y="113" font-size="10.5" text-anchor="middle" class="t-muted">queue + prefill</text>
      <line x1="24" y1="118" x2="612" y2="118" class="s-ink" stroke-width="1.5"/>
      <polygon points="618,118 609,114 609,122" class="f-ink"/>
      <line x1="30" y1="106" x2="30" y2="128" class="s-ink" stroke-width="2"/>
      <line x1="190" y1="98" x2="190" y2="118" class="s-accent" stroke-width="3"/>
      <g class="s-lab" stroke-width="2">${ticks.join("")}</g>
      <text x="30" y="140" font-size="11" class="t-muted">request sent</text>
      <text x="190" y="140" font-size="11" text-anchor="middle" class="t-accent">first token</text>
      <text x="582" y="140" font-size="11" text-anchor="end" class="t-muted">last token</text>
      <text x="386" y="160" font-size="11" text-anchor="middle" class="t-lab">decode: one token per step</text>
    </svg>`;
  };

  /* The inference stack: tooling / infrastructure / runtime. data-highlight="runtime|infrastructure|tooling",
     data-note="…" adds a right-aligned note on the highlighted layer. */
  D["inference-stack"] = function (fig) {
    const hi = fig.dataset.highlight || "runtime";
    const note = fig.dataset.note || "";
    const layers = [
      ["tooling", "Tooling", "the controls engineers use to configure, deploy and observe the layers below", ""],
      ["infrastructure", "Infrastructure", "many machines: autoscaling, routing, regions and clouds, uptime", "Part 7 of this course"],
      ["runtime", "Runtime", "one model on one machine: batching, caching, quantization, speculation", "Parts 2–5 of this course"],
    ];
    const rows = layers.map(([k, name, desc, where], i) => {
      const y = 8 + i * 68, on = k === hi;
      return `<rect x="8" y="${y}" width="624" height="58" rx="10" class="${on ? "f-labbg s-lab" : "f-card s-rule"}" stroke-width="${on ? 1.5 : 1}"/>
        <text x="26" y="${y + 24}" font-size="14" font-weight="600">${name}</text>
        <text x="26" y="${y + 44}" font-size="12" class="t-muted">${desc}</text>
        ${on && note ? `<text x="614" y="${y + 24}" font-size="11" class="t-lab" text-anchor="end" font-weight="600">${note}</text>` : ""}
        ${where ? `<text x="614" y="${y + (on && note ? 44 : 24)}" font-size="11" class="t-muted" text-anchor="end">${where}</text>` : ""}`;
    }).join("");
    return `<svg viewBox="0 0 640 212" role="img" aria-label="Three stacked layers: tooling on top, infrastructure in the middle, runtime at the bottom. ${note ? "Highlighted: " + hi + ", " + note + "." : ""}">${rows}</svg>`;
  };

  /* Four requests arriving together. Top: one slot, so they run one after another (queueing).
     Bottom: four slots, so they run together, each one slower (batching). Times from the Lesson 2 test run. */
  D["queue-vs-batch"] = function () {
    const x0 = 150, s = 34;                       // x of t=0, pixels per second
    const X = (t) => x0 + t * s;
    const lane = (y, label, wait, start, dur, firstTok) => `
      <text x="${x0 - 10}" y="${y + 10}" font-size="11" text-anchor="end" class="t-muted">${label}</text>
      ${wait > 0 ? `<line x1="${X(0)}" x2="${X(wait)}" y1="${y + 6}" y2="${y + 6}" class="s-muted" stroke-width="1.5" stroke-dasharray="3 3"/>` : ""}
      <rect x="${X(start)}" y="${y}" width="${dur * s}" height="12" rx="3" class="f-labbg s-lab" stroke-width="1.2"/>
      <line x1="${X(firstTok)}" x2="${X(firstTok)}" y1="${y - 2}" y2="${y + 14}" class="s-accent" stroke-width="2.5"/>`;
    let q = "", b = "";
    for (let i = 0; i < 4; i++) {
      q += lane(34 + i * 18, `request ${i + 1}`, i * 2.5, i * 2.5, 2.5, i * 2.5 + 0.15);
      b += lane(146 + i * 18, `request ${i + 1}`, 0, 0, 7.0, 0.5);
    }
    let axis = `<line x1="${X(0)}" x2="${X(10.6)}" y1="230" y2="230" class="s-ink" stroke-width="1.2"/>`;
    for (let t = 0; t <= 10; t += 2) axis += `<line x1="${X(t)}" x2="${X(t)}" y1="230" y2="235" class="s-ink"/><text x="${X(t)}" y="248" font-size="10.5" text-anchor="middle" class="t-muted">${t} s</text>`;
    return `<svg viewBox="0 0 640 258" role="img" aria-label="Four requests arrive at once. With one slot they run one after another: request 4 waits 7.5 seconds before it starts, all four finish after 10 seconds. With four slots they all start at once and each takes 7 seconds, so all four finish after 7 seconds, but each token comes more slowly.">
      <text x="12" y="18" font-size="12.5" font-weight="600">One slot: requests queue</text>
      <text x="628" y="18" font-size="11" text-anchor="end" class="t-muted">OLLAMA_NUM_PARALLEL=1</text>
      ${q}
      <text x="${X(10) + 6}" y="98" font-size="10.5" class="t-accent">request 4's TTFT ≈ 7.7 s</text>
      <text x="12" y="130" font-size="12.5" font-weight="600">Four slots: requests batch</text>
      <text x="628" y="130" font-size="11" text-anchor="end" class="t-muted">OLLAMA_NUM_PARALLEL=4</text>
      ${b}
      <text x="${X(7) + 6}" y="166" font-size="10.5" class="t-lab">all done at 7 s, not 10 s</text>
      <text x="${X(7) + 6}" y="182" font-size="10.5" class="t-lab">but every token is slower</text>
      ${axis}
      <line x1="12" x2="24" y1="252" y2="252" class="s-muted" stroke-width="1.5" stroke-dasharray="3 3"/><text x="28" y="255" font-size="10" class="t-muted">waiting</text>
      <line x1="80" x2="80" y1="246" y2="258" class="s-accent" stroke-width="2.5"/><text x="86" y="255" font-size="10" class="t-muted">first token</text>
    </svg>`;
  };

  window.IEDiagrams = D;
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-diagram]").forEach((fig) => {
      const make = D[fig.dataset.diagram];
      if (!make) return;
      const wrap = document.createElement("div");
      wrap.innerHTML = make(fig);
      fig.insertBefore(wrap.firstElementChild, fig.querySelector("figcaption"));
    });
  });
})();

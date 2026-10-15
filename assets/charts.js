/* Inference Engineering course: tiny SVG line charts for benchmark results.
 *
 * Data is CSV with a header row, as printed by labs/tools/load_test.py --csv.
 * Rows are grouped into one series per `label` column; each point is annotated
 * with its `load` column (e.g. "C=4"). A derived numeric column `c` is parsed
 * from loads like "C=4" (concurrency), so charts can use x: "c".
 *
 * Two declarative uses (both take data-charts, a JSON list of chart specs:
 *   [{"x": "throughput", "y": "ttft_p50", "xlabel": "…", "ylabel": "…", "title": "…"}]):
 *
 *   <figure class="chart" data-csv-src="id-of-script" data-charts='[…]'>
 *     <figcaption>…</figcaption></figure>
 *   <script type="text/csv" id="id-of-script">label,load,…</script>
 *       a fixed chart from data embedded in the page
 *
 *   <div class="csv-plot" id="…" data-charts='[…]' data-check="name"></div>
 *       a paste box: the learner pastes CSV, the charts are drawn, and
 *       window.LabChecks[name](rows, bySeries) -> [{ok, msg}] gives feedback.
 *
 * Colours come from course.css classes, so charts follow light/dark themes.
 * Depends on components.js only for IECourse.store (optional).
 */
(function () {
  "use strict";
  const SERIES = [["s-accent", "f-accent", "t-accent"], ["s-lab", "f-lab", "t-lab"], ["s-ink", "f-ink", ""], ["s-muted", "t-muted", "t-muted"]];

  function parseCSV(text) {
    const lines = String(text || "").split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
    const rows = [];
    let header = null;
    for (const line of lines) {
      const cells = line.split(",").map((c) => c.trim());
      if (cells[0] === "label" || (!header && cells.includes("load"))) { header = cells; continue; }
      if (!header || cells.length !== header.length) continue;
      const r = {};
      header.forEach((h, i) => {
        const n = Number(cells[i]);
        r[h] = cells[i] !== "" && Number.isFinite(n) ? n : cells[i];
      });
      const m = /C=(\d+)/.exec(String(r.load || ""));
      if (m) r.c = Number(m[1]);
      const rate = /^([\d.]+)\/s$/.exec(String(r.load || ""));
      if (rate) r.rate = Number(rate[1]);
      rows.push(r);
    }
    return rows;
  }

  function groupBy(rows) {
    const out = new Map();
    rows.forEach((r) => {
      const k = String(r.label ?? "run");
      if (!out.has(k)) out.set(k, []);
      out.get(k).push(r);
    });
    return out;
  }

  function niceTicks(max, count = 5) {
    if (!(max > 0)) return [0, 1];
    const raw = max / count;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) || 10 * mag;
    const ticks = [];
    for (let v = 0; v <= max + step * 0.001; v += step) ticks.push(+v.toFixed(10));
    if (ticks[ticks.length - 1] < max) ticks.push(+(ticks[ticks.length - 1] + step).toFixed(10));
    return ticks;
  }
  const fmtTick = (v) => (v >= 10000 ? (v / 1000).toLocaleString() + "k" : v.toLocaleString());
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* spec: {x, y, xlabel, ylabel, title}; groups: Map(label -> rows) */
  function line(spec, groups) {
    const W = 640, H = 320, L = 64, R = 18, T = spec.title ? 34 : 18, B = 48;
    const pts = [];
    groups.forEach((rows) => rows.forEach((r) => { if (Number.isFinite(r[spec.x]) && Number.isFinite(r[spec.y])) pts.push(r); }));
    if (!pts.length) return `<p class="muted">No rows with numeric <code>${esc(spec.x)}</code> and <code>${esc(spec.y)}</code>.</p>`;
    const xt = niceTicks(Math.max(...pts.map((r) => r[spec.x])) * 1.05);
    const yt = niceTicks(Math.max(...pts.map((r) => r[spec.y])) * 1.05);
    const xMax = xt[xt.length - 1], yMax = yt[yt.length - 1];
    const sx = (v) => L + (v / xMax) * (W - L - R);
    const sy = (v) => H - B - (v / yMax) * (H - T - B);
    let g = "";
    yt.forEach((v) => { g += `<line x1="${L}" x2="${W - R}" y1="${sy(v)}" y2="${sy(v)}" class="s-rule" stroke-width="1"/><text x="${L - 6}" y="${sy(v) + 4}" font-size="10.5" text-anchor="end" class="t-muted">${fmtTick(v)}</text>`; });
    xt.forEach((v) => { g += `<text x="${sx(v)}" y="${H - B + 16}" font-size="10.5" text-anchor="middle" class="t-muted">${fmtTick(v)}</text>`; });
    g += `<line x1="${L}" x2="${W - R}" y1="${H - B}" y2="${H - B}" class="s-ink" stroke-width="1.2"/>`;
    g += `<text x="${(L + W - R) / 2}" y="${H - 8}" font-size="11.5" text-anchor="middle">${esc(spec.xlabel || spec.x)}</text>`;
    g += `<text transform="translate(14 ${(T + H - B) / 2}) rotate(-90)" font-size="11.5" text-anchor="middle">${esc(spec.ylabel || spec.y)}</text>`;
    if (spec.title) g += `<text x="${L}" y="16" font-size="12.5" font-weight="600">${esc(spec.title)}</text>`;
    let i = 0, legend = "";
    groups.forEach((rows, name) => {
      const [stroke, fill, text] = SERIES[i % SERIES.length];
      const ok = rows.filter((r) => Number.isFinite(r[spec.x]) && Number.isFinite(r[spec.y]));
      if (ok.length > 1) g += `<polyline points="${ok.map((r) => `${sx(r[spec.x])},${sy(r[spec.y])}`).join(" ")}" class="${stroke}" stroke-width="2"/>`;
      ok.forEach((r) => {
        g += `<circle cx="${sx(r[spec.x])}" cy="${sy(r[spec.y])}" r="4" class="${fill}"><title>${esc(name)} ${esc(r.load ?? "")}: ${esc(spec.x)} ${r[spec.x]}, ${esc(spec.y)} ${r[spec.y]}</title></circle>`;
        if (r.load !== undefined) g += `<text x="${sx(r[spec.x]) + 6}" y="${sy(r[spec.y]) - 6}" font-size="10" class="${text}">${esc(r.load)}</text>`;
      });
      const ly = T + 4 + i * 16;
      legend += `<line x1="${W - R - 96}" x2="${W - R - 78}" y1="${ly}" y2="${ly}" class="${stroke}" stroke-width="2.5"/><text x="${W - R - 72}" y="${ly + 4}" font-size="11">${esc(name)}</text>`;
      i++;
    });
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc((spec.title || "") + ": " + (spec.ylabel || spec.y) + " against " + (spec.xlabel || spec.x))}">${g}${legend}</svg>`;
  }

  function renderCharts(container, specs, rows) {
    const groups = groupBy(rows);
    container.innerHTML = specs.map((s) => `<div class="chart-panel">${line(s, groups)}</div>`).join("");
  }

  function initFigure(fig) {
    const src = document.getElementById(fig.dataset.csvSrc);
    if (!src) return;
    const specs = JSON.parse(fig.dataset.charts || "[]");
    const box = document.createElement("div");
    box.className = "chart-grid";
    fig.insertBefore(box, fig.querySelector("figcaption"));
    renderCharts(box, specs, parseCSV(src.textContent));
  }

  function initPlot(box, idx) {
    const id = box.id || `plot${idx}`;
    const store = (window.IECourse && window.IECourse.store) || { get: (k, d) => d, set: () => {} };
    const key = window.IECourse ? window.IECourse.key(id) : `plot:${id}`;
    const specs = JSON.parse(box.dataset.charts || "[]");
    const ta = document.createElement("textarea");
    ta.className = "csv-input";
    ta.placeholder = "Paste the CSV blocks from load_test.py here (header line included). You can paste several runs, one after another.";
    ta.setAttribute("aria-label", "CSV from load_test.py");
    ta.value = store.get(key, "");
    const row = document.createElement("div");
    row.className = "btn-row";
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "btn"; btn.textContent = "Plot and check";
    row.append(btn);
    const charts = document.createElement("div");
    charts.className = "chart-grid";
    const out = document.createElement("ul");
    out.className = "check-list";
    out.setAttribute("aria-live", "polite");
    box.append(ta, row, charts, out);
    function go() {
      store.set(key, ta.value);
      const rows = parseCSV(ta.value);
      out.innerHTML = "";
      if (!rows.length) {
        charts.innerHTML = "";
        out.innerHTML = '<li class="bad">✗ No data rows found. Paste the lines starting at <code>label,load,…</code>.</li>';
        return;
      }
      renderCharts(charts, specs, rows);
      const fn = window.LabChecks && window.LabChecks[box.dataset.check];
      (fn ? fn(rows, groupBy(rows)) : []).forEach((r) => {
        const li = document.createElement("li");
        li.className = r.ok === true ? "ok" : r.ok === false ? "bad" : "info";
        li.innerHTML = (r.ok === true ? "✓ " : r.ok === false ? "✗ " : "ℹ︎ ") + r.msg;
        out.appendChild(li);
      });
    }
    btn.addEventListener("click", go);
    if (ta.value.trim()) go();
  }

  window.IECharts = { parseCSV, groupBy, line, renderCharts };
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("figure.chart[data-csv-src]").forEach(initFigure);
    document.querySelectorAll(".csv-plot").forEach(initPlot);
  });
})();

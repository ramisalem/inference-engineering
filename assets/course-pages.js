/* Renders the syllabus, schedule and roadmap-coverage views from window.COURSE.
 * Containers: #syllabus-parts, #coverage, #schedule-weeks, #this-week. Load after course-data.js. */
(function () {
  "use strict";
  const C = window.COURSE;
  if (!C) return;
  const base = document.body.dataset.root || "../"; // path from the page to the workspace root
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } } };
  const lessonByN = Object.fromEntries(C.lessons.map((l) => [l.n, l]));
  const pad = (n) => String(n).padStart(2, "0");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const PLATFORM = { mac: ["mac", "Mac"], colab: ["gpu", "Colab T4"], kaggle: ["gpu", "Kaggle 2×T4"], sim: ["", "Calculator / sim"] };

  // nodes covered by each lesson
  const covers = {};
  for (const s of C.roadmap) for (const t of s.topics) {
    if (!t.label) (covers[t.lesson] ||= []).push({ name: t.name, topic: true });
    for (const [name, l] of t.subs) (covers[l] ||= []).push({ name, topic: false });
  }

  const lessonLink = (l, text) => {
    const label = esc(text || `${pad(l.n)} · ${l.title}`);
    return l.ready ? `<a href="${base}lessons/${l.slug}.html">${label}</a>` : `<span class="muted">${label}</span>`;
  };
  const doneMark = (l) => {
    const d = store.get(`ie:complete:${l.slug.slice(0, 4)}`, false);
    return d ? `<span class="pill core" title="completed ${esc(d)}">✓ done</span>` : "";
  };
  const pills = (l) =>
    l.platform.map((p) => `<span class="pill ${PLATFORM[p][0]}">${PLATFORM[p][1]}</span>`).join(" ") +
    ` <span class="pill ${l.depth === "core" ? "core" : "light"}">${l.depth}</span>`;

  /* ---------- syllabus ---------- */
  const parts = document.getElementById("syllabus-parts");
  if (parts) {
    parts.innerHTML = C.parts.map((p) => {
      const rows = p.lessons.map((n) => {
        const l = lessonByN[n];
        const tags = (covers[n] || []).map((c) => `<span class="tag">${c.topic ? "<strong>" + esc(c.name) + "</strong>" : esc(c.name)}</span>`).join("");
        return `<tr data-progress-lesson="${l.slug.slice(0, 4)}">
          <td class="num" style="width:2.2rem">${pad(n)}</td>
          <td><div><strong>${lessonLink(l, l.title)}</strong> ${doneMark(l)}</div>
              <div style="font-size:.88rem;margin:.2rem 0 .35rem">${esc(l.win)}</div>
              <div class="covers" style="margin:0">${tags || '<span class="muted">Integrates everything so far</span>'}</div></td>
          <td style="width:9.5rem">${pills(l)}<div class="muted" style="font-family:var(--sans);font-size:.75rem;margin-top:.3rem">~${l.hours} h</div></td>
        </tr>`;
      }).join("");
      return `<h2 id="part-${p.id}"><span class="eyebrow">Part ${p.id}</span><br>${esc(p.title)}</h2>
        <p class="muted" style="font-style:italic">${esc(p.tagline)}</p>
        <div class="table-wrap"><table><thead><tr><th class="num">#</th><th>Lesson, its win, and the roadmap nodes it covers</th><th>Lab · depth</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    }).join("");
  }

  /* ---------- roadmap coverage ---------- */
  const cov = document.getElementById("coverage");
  if (cov) {
    let nTopics = 0, nSubs = 0;
    cov.innerHTML = C.roadmap.map((s) => {
      const rows = s.topics.map((t) => {
        if (!t.label) nTopics++;
        nSubs += t.subs.length;
        const head = t.label ? `<em>${esc(t.name)}</em>` : `<strong>${esc(t.name)}</strong> → ${lessonLink(lessonByN[t.lesson], "L" + pad(t.lesson))}`;
        const subs = t.subs.map(([name, n]) => `${esc(name)} → ${lessonLink(lessonByN[n], "L" + pad(n))}`).join(" · ");
        return `<tr><td style="width:34%">${head}</td><td style="font-size:.86rem">${subs}</td></tr>`;
      }).join("");
      return `<h3>${esc(s.section)}</h3><div class="table-wrap"><table><tbody>${rows}</tbody></table></div>`;
    }).join("");
    const n = document.getElementById("coverage-count");
    if (n) n.textContent = `${nTopics} topics + ${nSubs} subtopics = ${nTopics + nSubs} nodes, all mapped`;
  }

  /* ---------- schedule ---------- */
  const fmtDate = (iso) => new Date(iso + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const itemHtml = (it) => {
    if (typeof it === "number") { const l = lessonByN[it]; return `<li data-progress-lesson="${l.slug.slice(0, 4)}">${lessonLink(l)} <span class="muted">· ${l.hours} h</span> ${doneMark(l)}</li>`; }
    const x = C.extras[it]; return `<li class="muted"><em>${esc(x.title)}</em> · ${x.hours} h</li>`;
  };
  const hours = (w) => w.items.reduce((s, it) => s + (typeof it === "number" ? lessonByN[it].hours : C.extras[it].hours), 0);
  const today = new Date().toISOString().slice(0, 10);
  const weeks = document.getElementById("schedule-weeks");
  if (weeks) {
    weeks.innerHTML = `<div class="table-wrap"><table><thead><tr><th>Week</th><th>Work</th><th class="num">Hours</th><th>Portfolio artifact</th></tr></thead><tbody>` +
      C.weeks.map((w) => {
        const now = today >= w.from && today <= w.to;
        return `<tr${now ? ' style="background:var(--key-bg)"' : ""}>
          <td style="white-space:nowrap"><strong>W${w.n}</strong>${now ? ' <span class="pill core">this week</span>' : ""}<br><span class="muted" style="font-size:.8rem">${fmtDate(w.from)} – ${fmtDate(w.to)}</span></td>
          <td><ul style="margin:0;padding-left:1.1rem">${w.items.map(itemHtml).join("")}</ul></td>
          <td class="num">${hours(w)}</td>
          <td style="font-size:.86rem">${esc(w.portfolio)}</td></tr>`;
      }).join("") + `</tbody></table></div>`;
  }
  const tw = document.getElementById("this-week");
  if (tw) {
    const w = C.weeks.find((x) => today >= x.from && today <= x.to);
    if (!w) tw.innerHTML = today < C.start ? `The course starts on ${fmtDate(C.start)}.` : "The 13 weeks are over. Time for the capstone write-up and interviews.";
    else {
      const next = w.items.filter((it) => typeof it === "number").map((n) => lessonByN[n]).find((l) => !store.get(`ie:complete:${l.slug.slice(0, 4)}`, false));
      tw.innerHTML = `<strong>Week ${w.n} of 13</strong> (${fmtDate(w.from)} – ${fmtDate(w.to)}). ` +
        (next ? `Up next: ${lessonLink(next)}${next.ready ? "" : " <span class='muted'>(ask your teacher to generate it)</span>"}.` : "All of this week's lessons are marked complete. Nice.");
    }
  }
})();

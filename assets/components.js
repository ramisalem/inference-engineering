/* Inference Engineering course: reusable lesson components.
 *
 * Declarative markup, upgraded by this script on load:
 *   <div class="mcq" id="...">       .prompt, <ul><li data-correct>…</li><li>…</li></ul>, .explanation
 *   <div class="numeric" id="..." data-answer="6145" data-tol="0.05" data-unit="ms">  .prompt, .solution
 *   <div class="explain" id="...">   .prompt, .model-answer       (free recall + self-grading)
 *   <ol class="checklist" id="...">  lab steps with persisted checkboxes
 *   <form class="lab-results" data-check="name">  inputs; window.LabChecks[name](values) -> [{ok, msg}]
 *   <div class="scoreboard"></div>   first-try score + "mark lesson complete"
 *   <button class="theme-toggle"></button>
 *   (automatic) lessons, i.e. <body data-lesson>, get a "My notes" box from notes/<slug>.md on GitHub
 * Progress is stored in localStorage (best effort; the page works without it).
 */
(function () {
  "use strict";
  const lessonId = document.body.dataset.lesson || location.pathname.split("/").pop();
  const KEY = (id) => `ie:${lessonId}:${id}`;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
  };
  window.IECourse = { store, lessonId, key: KEY };
  window.LabChecks = window.LabChecks || {};

  const el = (tag, attrs = {}, text) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") n.className = v; else n.setAttribute(k, v);
    }
    if (text !== undefined) n.textContent = text;
    return n;
  };
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
  };

  /* ---------------- multiple choice ---------------- */
  function initMCQ(box, idx) {
    const id = box.id || `mcq${idx}`;
    const list = box.querySelector("ul");
    const items = [...list.children];
    items.forEach((li, i) => { li.dataset.idx = i; });
    shuffle(items).forEach((li) => list.appendChild(li));
    const fb = el("div", { class: "feedback", role: "status", "aria-live": "polite" });
    const explanation = box.querySelector(".explanation");
    box.insertBefore(fb, explanation || null);
    const state = store.get(KEY(id), { first: null, solved: false, wrong: [] });

    items.forEach((li) => {
      const btn = el("button", { class: "opt", type: "button" });
      btn.innerHTML = li.innerHTML;
      li.innerHTML = ""; li.appendChild(btn);
      btn.addEventListener("click", () => choose(li));
    });

    function render() {
      items.forEach((li) => {
        const b = li.querySelector(".opt");
        const isC = li.hasAttribute("data-correct");
        b.classList.toggle("correct", state.solved && isC);
        b.classList.toggle("wrong", state.wrong.includes(Number(li.dataset.idx)));
        b.disabled = state.solved;
      });
      if (state.solved) {
        box.classList.add("revealed");
        fb.className = "feedback " + (state.first === "ok" ? "ok" : "bad");
        fb.textContent = state.first === "ok" ? "✓ Correct on the first try." : "✓ Got there. Re-read the explanation and retry this question tomorrow.";
      }
    }
    function choose(li) {
      if (state.solved) return;
      const ok = li.hasAttribute("data-correct");
      if (state.first === null) state.first = ok ? "ok" : "bad";
      if (ok) { state.solved = true; }
      else {
        const i = Number(li.dataset.idx);
        if (!state.wrong.includes(i)) state.wrong.push(i);
        fb.className = "feedback bad";
        fb.textContent = "✗ Not quite. Think about it again and pick another option.";
      }
      store.set(KEY(id), state); render(); updateScore();
    }
    render();
    return () => state;
  }

  /* ---------------- numeric answer ---------------- */
  function initNumeric(box, idx) {
    const id = box.id || `num${idx}`;
    const answer = Number(box.dataset.answer);
    const tol = box.dataset.tol !== undefined ? Number(box.dataset.tol) : 0.05;
    const abs = box.dataset.abs !== undefined ? Number(box.dataset.abs) : null;
    const unit = box.dataset.unit || "";
    const row = el("div", { class: "btn-row" });
    const input = el("input", { type: "text", inputmode: "decimal", "aria-label": "your answer", placeholder: "your answer" });
    const check = el("button", { class: "btn", type: "button" }, "Check");
    const show = el("button", { class: "btn secondary", type: "button" }, "Show solution");
    show.style.display = "none";
    row.append(input);
    if (unit) row.append(el("span", { class: "unit" }, unit));
    row.append(check, show);
    const fb = el("div", { class: "feedback", role: "status", "aria-live": "polite" });
    const sol = box.querySelector(".solution");
    box.insertBefore(row, sol || null);
    box.insertBefore(fb, sol || null);
    const state = store.get(KEY(id), { first: null, solved: false, tries: 0, last: "" });

    function within(v) {
      if (abs !== null) return Math.abs(v - answer) <= abs;
      return Math.abs(v - answer) <= Math.abs(answer) * tol + 1e-12;
    }
    function render() {
      input.value = state.last || "";
      if (state.tries >= 1 && !state.solved) show.style.display = "";
      if (state.solved) {
        box.classList.add("revealed"); input.disabled = true; check.disabled = true; show.style.display = "none";
        fb.className = "feedback " + (state.first === "ok" ? "ok" : "bad");
        fb.textContent = state.first === "ok"
          ? `✓ Correct on the first try (reference answer ≈ ${answer.toLocaleString()} ${unit}).`
          : `Reference answer ≈ ${answer.toLocaleString()} ${unit}. Work through the solution below.`;
      }
    }
    function doCheck() {
      const raw = input.value.replace(/[, _]/g, "");
      const v = parseFloat(raw);
      if (Number.isNaN(v)) { fb.className = "feedback bad"; fb.textContent = "Enter a number."; return; }
      state.tries++; state.last = input.value;
      const ok = within(v);
      if (state.first === null) state.first = ok ? "ok" : "bad";
      if (ok) state.solved = true;
      else { fb.className = "feedback bad"; fb.textContent = v > answer ? "✗ Too high. Check your units and each step." : "✗ Too low. Check your units and each step."; }
      store.set(KEY(id), state); render(); updateScore();
    }
    check.addEventListener("click", doCheck);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") doCheck(); });
    show.addEventListener("click", () => { state.solved = true; if (state.first === null) state.first = "bad"; store.set(KEY(id), state); render(); updateScore(); });
    render();
    return () => state;
  }

  /* ---------------- explain it (free recall + self-grade) ---------------- */
  function initExplain(box, idx) {
    const id = box.id || `exp${idx}`;
    const state = store.get(KEY(id), { text: "", grade: null, revealed: false });
    const ta = el("textarea", { placeholder: "Write your answer from memory, before you look anything up…", "aria-label": "your explanation" });
    ta.value = state.text;
    const row = el("div", { class: "btn-row" });
    const reveal = el("button", { class: "btn", type: "button" }, "Compare with model answer");
    row.append(reveal);
    const model = box.querySelector(".model-answer");
    const grade = el("div", { class: "self-grade" });
    grade.append(el("span", {}, "How did you do?"));
    const grades = [["nailed", "Nailed it"], ["partly", "Partly"], ["missed", "Missed it"]];
    grades.forEach(([k, label]) => {
      const b = el("button", { type: "button" }, label);
      b.addEventListener("click", () => { state.grade = k; store.set(KEY(id), state); render(); updateScore(); });
      b.dataset.k = k; grade.append(b);
    });
    box.insertBefore(ta, model || null);
    box.insertBefore(row, model || null);
    box.appendChild(grade);
    ta.addEventListener("input", () => { state.text = ta.value; store.set(KEY(id), state); });
    reveal.addEventListener("click", () => {
      if (!ta.value.trim() && !confirmEmpty()) return;
      state.revealed = true; store.set(KEY(id), state); render();
    });
    function confirmEmpty() {
      reveal.textContent = "Try writing something first. Click again to reveal anyway";
      if (reveal.dataset.armed) return true;
      reveal.dataset.armed = "1"; return false;
    }
    function render() {
      box.classList.toggle("revealed", state.revealed);
      reveal.style.display = state.revealed ? "none" : "";
      grade.querySelectorAll("button").forEach((b) => b.classList.toggle("picked", b.dataset.k === state.grade));
    }
    render();
    return () => ({ first: state.grade === "nailed" ? "ok" : state.grade ? "bad" : null, solved: !!state.grade });
  }

  /* ---------------- prediction (ungraded, locked in before the lab) ----------------
   * <div class="prediction" id="p-ttft" data-options="grows a lot|grows a little|stays about the same">
   *   <p class="prompt">…</p></div>
   * The choice is saved under IECourse.key(id); a lab checker can compare it with measured data. */
  function initPrediction(box, idx) {
    const id = box.id || `pred${idx}`;
    const options = (box.dataset.options || "").split("|").map((s) => s.trim()).filter(Boolean);
    const row = el("div", { class: "self-grade", style: "display:flex" });
    const note = el("div", { class: "feedback" });
    let choice = store.get(KEY(id), null);
    options.forEach((opt) => {
      const b = el("button", { type: "button" }, opt);
      b.addEventListener("click", () => { choice = opt; store.set(KEY(id), opt); render(); });
      row.append(b);
    });
    box.append(row, note);
    function render() {
      row.querySelectorAll("button").forEach((b) => b.classList.toggle("picked", b.textContent === choice));
      note.textContent = choice ? `Locked in: “${choice}”. The lab will tell you if you were right.` : "Pick one before you run anything.";
    }
    render();
  }

  /* ---------------- lab checklist ---------------- */
  function initChecklist(list, idx) {
    const id = list.id || `chk${idx}`;
    const state = store.get(KEY(id), {});
    [...list.children].forEach((li, i) => {
      const cb = el("input", { type: "checkbox", "aria-label": `step ${i + 1} done` });
      cb.checked = !!state[i];
      li.classList.toggle("done", cb.checked);
      cb.addEventListener("change", () => { state[i] = cb.checked; li.classList.toggle("done", cb.checked); store.set(KEY(id), state); });
      li.prepend(cb);
    });
  }

  /* ---------------- lab results checker ---------------- */
  function initLabResults(form, idx) {
    const id = form.id || `lab${idx}`;
    const name = form.dataset.check;
    const saved = store.get(KEY(id), {});
    const inputs = [...form.querySelectorAll("input[name]")];
    inputs.forEach((inp) => { if (saved[inp.name] !== undefined) inp.value = saved[inp.name]; });
    const out = el("ul", { class: "check-list", "aria-live": "polite" });
    form.appendChild(out);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const values = {};
      inputs.forEach((inp) => { values[inp.name] = parseFloat(String(inp.value).replace(/[, ]/g, "")); saved[inp.name] = inp.value; });
      store.set(KEY(id), saved);
      out.innerHTML = "";
      const fn = window.LabChecks[name];
      const results = fn ? fn(values) : [{ ok: null, msg: "No checker registered." }];
      results.forEach((r) => {
        const li = el("li", { class: r.ok === true ? "ok" : r.ok === false ? "bad" : "info" });
        li.innerHTML = (r.ok === true ? "✓ " : r.ok === false ? "✗ " : "ℹ︎ ") + r.msg;
        out.appendChild(li);
      });
    });
  }

  /* ---------------- copy buttons ---------------- */
  function initCopy(pre) {
    if (pre.classList.contains("no-copy")) return;
    const b = el("button", { class: "copy-btn", type: "button" }, "copy");
    b.addEventListener("click", async () => {
      const code = pre.querySelector("code") || pre;
      const text = [...code.childNodes].filter((n) => !(n.classList && n.classList.contains("out"))).map((n) => n.textContent).join("");
      try { await navigator.clipboard.writeText(text.trim()); b.textContent = "copied"; }
      catch (e) { b.textContent = "select + ⌘C"; }
      setTimeout(() => { b.textContent = "copy"; }, 1500);
    });
    pre.appendChild(b);
  }

  /* ---------------- theme toggle ---------------- */
  function initTheme() {
    const root = document.documentElement;
    const saved = store.get("ie:theme", null);
    if (saved) root.dataset.theme = saved;
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      const label = () => { btn.textContent = root.dataset.theme === "dark" ? "☾ dark" : root.dataset.theme === "light" ? "☀ light" : "◐ auto"; };
      label();
      btn.addEventListener("click", () => {
        const next = !root.dataset.theme ? "light" : root.dataset.theme === "light" ? "dark" : null;
        if (next) root.dataset.theme = next; else delete root.dataset.theme;
        store.set("ie:theme", next); label();
      });
    });
  }

  /* ---------------- scoreboard ---------------- */
  const getters = [];
  let scoreEl = null;
  function updateScore() {
    if (!scoreEl) return;
    const states = getters.map((g) => g());
    const answered = states.filter((s) => s.solved).length;
    const firstOk = states.filter((s) => s.first === "ok").length;
    scoreEl.querySelector(".s-answered").textContent = `${answered}/${states.length}`;
    scoreEl.querySelector(".s-first").textContent = `${firstOk}/${states.length}`;
  }
  function initScoreboard(box) {
    scoreEl = box;
    box.innerHTML = '<span>Exercises answered <strong class="s-answered">0/0</strong></span>' +
      '<span>Correct on first try <strong class="s-first">0/0</strong></span>';
    const doneKey = `ie:complete:${lessonId}`;
    const btn = el("button", { class: "btn complete-btn", type: "button" });
    const render = () => {
      const done = store.get(doneKey, false);
      btn.textContent = done ? "✓ Lesson complete" : "Mark lesson complete";
      btn.classList.toggle("done", !!done);
    };
    btn.addEventListener("click", () => { store.set(doneKey, store.get(doneKey, false) ? false : new Date().toISOString().slice(0, 10)); render(); });
    // Spaced retrieval: wipe this lesson's exercise answers so they can be redone from memory.
    const reset = el("button", { class: "btn secondary", type: "button", title: "Clear your answers to redo the exercises from memory" }, "Reset exercises");
    reset.addEventListener("click", () => {
      [[".mcq", "mcq"], [".numeric", "num"], [".explain", "exp"]].forEach(([sel, kind]) => {
        document.querySelectorAll(sel).forEach((b, i) => {
          try { localStorage.removeItem(KEY(b.id || `${kind}${i}`)); } catch (e) { /* ignore */ }
        });
      });
      location.reload();
    });
    box.append(btn, reset); render();
    updateScore();
  }

  /* ---------------- GitHub: repo links + learner notes ----------------
   * The course is hosted on GitHub Pages from REPO. On the hosted site, links to .md/.py files
   * open on github.com (rendered, editable) instead of downloading raw text.
   * Lessons get a "My notes" box before the pager: it shows notes/<lesson-slug>.md, read live from
   * the GitHub API so an edit appears right away, with a button to edit it on GitHub. */
  const REPO = "ramisalem/inference-engineering";
  const GH = `https://github.com/${REPO}`;

  function repoPath(href) {
    // Absolute URL of a same-site link → path inside the repo, or null.
    const u = new URL(href, location.href);
    const base = location.pathname.replace(/[^/]*$/, "");
    const root = new URL(document.body.dataset.root || "", location.origin + base).pathname;
    return u.origin === location.origin && u.pathname.startsWith(root) ? u.pathname.slice(root.length) : null;
  }

  function initRepoLinks() {
    if (!location.hostname.endsWith("github.io")) return;
    document.querySelectorAll('a[href$=".md"], a[href$=".py"]').forEach((a) => {
      const p = repoPath(a.getAttribute("href"));
      if (p) a.href = `${GH}/blob/main/${p}`;
    });
  }

  function initHomeLink() {
    const brand = document.querySelector(".topnav .brand");
    if (!brand || brand.closest("a")) return;
    const root = document.body.dataset.root ?? (document.body.dataset.lesson ? "../" : "");
    const a = el("a", { class: "brand", href: `${root}index.html` }, brand.textContent);
    brand.replaceWith(a);
  }

  function mdToHtml(md) {
    const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const inline = (s) => esc(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>');
    const out = [];
    let list = null, code = null, para = [];
    const flush = () => {
      if (para.length) { out.push(`<p>${para.map(inline).join("<br>")}</p>`); para = []; }
      if (list) { out.push(`</${list}>`); list = null; }
    };
    md.replace(/<!--[\s\S]*?-->/g, "").split(/\r?\n/).forEach((line) => {
      if (code !== null) {
        if (/^```/.test(line)) { out.push(`<pre class="no-copy"><code>${esc(code.join("\n"))}</code></pre>`); code = null; }
        else code.push(line);
        return;
      }
      let m;
      if (/^```/.test(line)) { flush(); code = []; }
      else if ((m = /^(#{1,4})\s+(.*)/.exec(line))) { flush(); const h = Math.min(m[1].length + 2, 5); out.push(`<h${h}>${inline(m[2])}</h${h}>`); }
      else if ((m = /^\s*(?:([-*])|\d+\.)\s+(.*)/.exec(line))) {
        if (para.length) flush();
        const tag = m[1] ? "ul" : "ol";
        if (list !== tag) { if (list) out.push(`</${list}>`); out.push(`<${tag}>`); list = tag; }
        out.push(`<li>${inline(m[2].replace(/^\[([ xX])\]\s*/, (x, c) => (c === " " ? "☐ " : "☑ ")))}</li>`);
      }
      else if (!line.trim()) flush();
      else { if (list) { out.push(`</${list}>`); list = null; } para.push(line); }
    });
    if (code !== null) out.push(`<pre class="no-copy"><code>${esc(code.join("\n"))}</code></pre>`);
    flush();
    return out.join("");
  }

  function initNotes() {
    if (!document.body.dataset.lesson) return;
    const slug = location.pathname.split("/").pop().replace(/\.html$/, "");
    const path = `notes/${slug}.md`;
    const box = el("section", { class: "my-notes", id: "my-notes" });
    box.innerHTML = '<span class="box-label">My notes</span><div class="notes-body"><p class="muted">Loading your notes…</p></div>';
    const row = el("div", { class: "btn-row" });
    const edit = el("a", { class: "btn", href: `${GH}/edit/main/${path}`, target: "_blank", rel: "noopener" }, "✏️ Edit my notes on GitHub");
    const reload = el("button", { class: "btn secondary", type: "button" }, "Refresh");
    const hist = el("a", { class: "notes-meta", href: `${GH}/commits/main/${path}`, target: "_blank", rel: "noopener" }, "history");
    row.append(edit, reload, hist);
    box.append(row);
    const body = box.querySelector(".notes-body");
    const load = () => {
      body.innerHTML = '<p class="muted">Loading your notes…</p>';
      fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=main`, { headers: { Accept: "application/vnd.github.raw" }, cache: "no-store" })
        .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
        .catch(() => fetch(`../${path}`, { cache: "no-store" }).then((r) => (r.ok ? r.text() : Promise.reject(r.status))))
        .then((md) => {
          const html = mdToHtml(md);
          body.innerHTML = html.replace(/<h3>[^<]*<\/h3>/, "") || '<p class="muted">No notes yet.</p>';
        })
        .catch(() => { body.innerHTML = `<p class="muted">Couldn't load your notes right now. Open <a href="${GH}/blob/main/${path}">${path}</a> on GitHub.</p>`; });
    };
    reload.addEventListener("click", load);
    const pager = document.querySelector(".pager");
    if (pager) pager.before(box); else (document.querySelector("article") || document.body).append(box);
    load();
  }

  /* ---------------- course progress (syllabus / schedule pages) ---------------- */
  function initProgressMarks() {
    document.querySelectorAll("[data-progress-lesson]").forEach((n) => {
      const done = store.get(`ie:complete:${n.dataset.progressLesson}`, false);
      if (done) { n.classList.add("is-done"); n.setAttribute("title", `completed ${done}`); }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    document.querySelectorAll(".mcq").forEach((b, i) => getters.push(initMCQ(b, i)));
    document.querySelectorAll(".numeric").forEach((b, i) => getters.push(initNumeric(b, i)));
    document.querySelectorAll(".explain").forEach((b, i) => getters.push(initExplain(b, i)));
    document.querySelectorAll(".prediction").forEach(initPrediction);
    document.querySelectorAll(".checklist").forEach(initChecklist);
    document.querySelectorAll("form.lab-results").forEach(initLabResults);
    document.querySelectorAll("pre").forEach(initCopy);
    const sb = document.querySelector(".scoreboard");
    if (sb) initScoreboard(sb);
    initProgressMarks();
    initNotes();
    initRepoLinks();
    initHomeLink();
  });
})();

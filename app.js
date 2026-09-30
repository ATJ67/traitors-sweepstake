(function () {
  "use strict";

  const STORAGE_KEY = "traitors-sweepstake-v1";
  const BASE = window.SWEEPSTAKE;
  const BASE_JSON = JSON.stringify(BASE);

  const $ = (id) => document.getElementById(id);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const isOut = (c) => c.status === "banished" || c.status === "murdered";

  // ── State ──────────────────────────────────────────────
  // Local edits (from the Manage panel) are kept in localStorage, but are
  // dropped automatically if data.js itself has changed since they were made,
  // so a redeploy always wins.
  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved && saved.base === BASE_JSON && saved.state) return saved.state;
    } catch (e) { /* storage unavailable */ }
    return clone(BASE);
  }
  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ base: BASE_JSON, state })); } catch (e) {}
  }
  let state = loadState();

  if (new URLSearchParams(location.search).has("projector")) document.body.classList.add("projector");

  // ── Helpers ────────────────────────────────────────────
  function initials(name) {
    const parts = name.replace(/[^A-Za-z' -]/g, "").split(/[\s-]+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function hoodIcon() {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    const use = document.createElementNS(ns, "use");
    use.setAttribute("href", "#hood");
    svg.appendChild(use);
    return svg;
  }

  // ── Place cards ────────────────────────────────────────
  // The 21 blank place cards painted into images/table.webp, measured in the
  // image's own pixels (1312×1199) as [x, y, width, height] of the cream
  // area, clockwise from top centre. Names are written straight onto them.
  const IMG_W = 1312, IMG_H = 1199;
  const CARDS = [
    [602, 249, 107, 37], [758, 267, 107, 38], [896, 300, 111, 39], [1016, 354, 112, 39],
    [1102, 439, 115, 39], [1142, 537, 118, 41], [1134, 645, 122, 41], [1073, 752, 125, 42],
    [978, 841, 125, 42], [833, 899, 127, 42], [675, 935, 129, 42], [508, 935, 129, 42],
    [352, 899, 127, 42], [208, 841, 126, 42], [114, 752, 124, 42], [56, 645, 122, 41],
    [52, 537, 118, 41], [95, 438, 115, 40], [184, 354, 111, 39], [305, 300, 110, 39],
    [447, 267, 107, 38],
  ];
  // Our cards are drawn over the painted ones, a little larger for legibility.
  const CARD_SCALE_W = 1.27, CARD_SCALE_H = 1.6;

  // ── Round table ────────────────────────────────────────
  const seatsEl = $("seats");
  let prevOut = new Set(state.celebs.filter(isOut).map((c) => c.name));

  function renderSeats() {
    seatsEl.innerHTML = "";
    const nowOut = new Set();

    state.celebs.forEach((c, i) => {
      const seat = el("div", "seat");
      const [x, y, w, h] = CARDS[i % CARDS.length];
      const cw = w * CARD_SCALE_W, ch = h * CARD_SCALE_H;
      seat.style.left = ((x + w / 2) / IMG_W) * 100 + "%";
      seat.style.top = ((y + h / 2 - h * 0.08) / IMG_H) * 100 + "%";
      seat.style.width = (cw / IMG_W) * 100 + "%";
      seat.style.height = (ch / IMG_H) * 100 + "%";
      seat.style.setProperty("--cw", ((cw / IMG_W) * 100).toFixed(3));

      const out = isOut(c);
      if (out) {
        seat.classList.add("out");
        nowOut.add(c.name);
        if (!prevOut.has(c.name)) seat.classList.add("just-out");
      }

      // Medallion: the painted hood shows through unless there's a photo,
      // or they've left (then it's dimmed with a red ring).
      const medal = el("div", "medal");
      const inner = el("div", "medal-in");
      inner.appendChild(hoodIcon());
      if (!out && c.photo) {
        const img = new Image();
        img.alt = "";
        img.onload = () => { inner.textContent = ""; inner.appendChild(img); };
        img.src = c.photo;
      }
      medal.appendChild(inner);
      seat.appendChild(medal);

      const txt = el("div", "txt");
      const nameEl = el("div", "name fit");
      const words = c.name.split(" ");
      // first name(s) / surname, so a wrap never splits mid-name
      nameEl.appendChild(el("span", "l", words.length > 1 ? words.slice(0, -1).join(" ") + " " : c.name));
      if (words.length > 1) nameEl.appendChild(el("span", "l", words[words.length - 1]));
      txt.appendChild(nameEl);
      if (out) {
        let fate = c.status === "murdered" ? "Murdered" : "Banished";
        if (c.status === "banished") fate += c.traitor ? " · Traitor" : " · Faithful";
        txt.appendChild(el("div", "fate fit " + (c.traitor ? "traitor" : c.status), fate));
      } else {
        txt.appendChild(el("div", c.colleague ? "who fit" : "who fit none", c.colleague || "Unassigned"));
      }
      seat.appendChild(txt);
      seat.title = `${c.name} — ${c.role}${c.colleague ? " · drawn by " + c.colleague : ""}`;
      seatsEl.appendChild(seat);
    });

    prevOut = nowOut;
    $("remaining").textContent = state.celebs.filter((c) => !isOut(c)).length;
    fitText();
  }

  // Shrink any line that's too long for its card (e.g. "Julie Hesmondhalgh").
  function fitText() {
    seatsEl.querySelectorAll(".seat").forEach((s) => s.classList.remove("wrap"));
    seatsEl.querySelectorAll(".name").forEach((e) => {
      e.style.setProperty("--fit", 1);
      const spans = e.querySelectorAll(".l");
      if (spans.length < 2) return;
      // only wrap names that would otherwise need shrinking a lot
      if (e.scrollWidth > e.clientWidth * 1.4) e.parentNode.parentNode.classList.add("wrap");
    });
    seatsEl.querySelectorAll(".fit").forEach((e) => {
      e.style.setProperty("--fit", 1);
      if (e.scrollWidth > e.clientWidth) {
        e.style.setProperty("--fit", Math.max(0.55, (e.clientWidth / e.scrollWidth) * 0.98).toFixed(3));
      }
    });
  }
  if (document.fonts) document.fonts.ready.then(fitText);
  let fitW = 0;
  new ResizeObserver(([entry]) => {
    const w = Math.round(entry.contentRect.width);
    if (w !== fitW) { fitW = w; fitText(); }
  }).observe(seatsEl);

  // ── Coffin ─────────────────────────────────────────────
  function renderCoffin() {
    const list = $("coffin-list");
    list.innerHTML = "";
    const fallen = state.celebs
      .map((c, i) => ({ c, i }))
      .filter(({ c }) => isOut(c))
      .sort((a, b) => (a.c.episode || 99) - (b.c.episode || 99) || (a.c.outOrder || a.i) - (b.c.outOrder || b.i))
      .map(({ c }) => c);

    fallen.forEach((c) => {
      const li = el("li", c.traitor ? "traitor" : c.status);
      li.appendChild(el("div", "rip-name", c.name));
      li.appendChild(el("div", c.colleague ? "rip-who" : "rip-who none", c.colleague || "Unassigned"));
      const meta = el("div", "rip-meta");
      if (c.episode) meta.appendChild(el("span", "tag", "Ep " + c.episode));
      meta.appendChild(el("span", "tag " + c.status, c.status === "murdered" ? "Murdered" : "Banished"));
      if (c.traitor) meta.appendChild(el("span", "tag traitor", "Traitor"));
      else if (c.status === "banished") meta.appendChild(el("span", "tag faithful", "Faithful"));
      li.appendChild(meta);
      list.appendChild(li);
    });

    $("fallen-count").textContent = fallen.length;
    $("coffin-empty").hidden = fallen.length > 0;
    list.hidden = fallen.length === 0;
    fitCoffin();
  }

  // Nobody can scroll a projector: shrink the list to fit the coffin, then
  // switch to a denser layout, and only as a last resort slowly auto-scroll.
  function fitCoffin() {
    const list = $("coffin-list");
    const fits = () => list.scrollHeight <= list.clientHeight + 1;
    list.classList.remove("compact", "scrolling");
    for (const compact of [false, true]) {
      list.classList.toggle("compact", compact);
      for (let rs = 1; rs >= (compact ? 0.7 : 0.8) - 1e-9; rs -= 0.02) {
        list.style.setProperty("--rs", rs.toFixed(2));
        if (fits()) return;
      }
    }
    list.classList.add("scrolling");
  }
  new ResizeObserver(() => fitCoffin()).observe(document.querySelector(".coffin-body"));

  (function autoScroll() {
    const list = $("coffin-list");
    let dir = 1, pauseUntil = 0;
    function step(t) {
      if (list.classList.contains("scrolling") && t > pauseUntil) {
        list.scrollTop += 0.4 * dir;
        const atEnd = list.scrollTop + list.clientHeight >= list.scrollHeight - 1;
        if ((dir > 0 && atEnd) || (dir < 0 && list.scrollTop <= 0)) { dir = -dir; pauseUntil = t + 3000; }
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  })();

  // ── Countdown ──────────────────────────────────────────
  const eps = state.episodes.map((s) => new Date(s));
  const epLen = (state.episodeLengthMins || 60) * 60000;
  const fmtWhen = new Intl.DateTimeFormat("en-GB", {
    weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit",
    hour12: true, timeZone: "Europe/London",
  });
  const pad = (n) => String(n).padStart(2, "0");
  const cd = $("countdown");
  const clock = $("cd-clock");
  const clockHTML = clock.innerHTML;

  function airedCount(now = Date.now()) {
    return eps.filter((d) => d.getTime() <= now).length;
  }

  function tick() {
    const now = Date.now();
    const liveIdx = eps.findIndex((d) => now >= d.getTime() && now < d.getTime() + epLen);
    const nextIdx = eps.findIndex((d) => d.getTime() > now);

    if (liveIdx >= 0) {
      cd.classList.add("live");
      $("cd-label").textContent = liveIdx === eps.length - 1 ? "The Final" : `Episode ${liveIdx + 1}`;
      if (!clock.querySelector(".onair")) clock.innerHTML = '<div class="onair"><i></i>On air now</div>';
      $("cd-when").textContent = "BBC One & iPlayer";
      return;
    }
    cd.classList.remove("live");
    if (!clock.querySelector("#cd-d")) clock.innerHTML = clockHTML;

    if (nextIdx < 0) {
      $("cd-label").textContent = "The series has ended";
      ["cd-d", "cd-h", "cd-m", "cd-s"].forEach((id) => ($(id).textContent = "00"));
      $("cd-when").textContent = "Thanks for playing";
      return;
    }

    const secs = Math.floor((eps[nextIdx].getTime() - now) / 1000);
    $("cd-d").textContent = pad(Math.floor(secs / 86400));
    $("cd-h").textContent = pad(Math.floor((secs % 86400) / 3600));
    $("cd-m").textContent = pad(Math.floor((secs % 3600) / 60));
    $("cd-s").textContent = pad(secs % 60);
    const label = nextIdx === eps.length - 1 ? "The Final" : `Episode ${nextIdx + 1}`;
    $("cd-label").textContent = `Next episode · ${label}`;
    const [day, time] = fmtWhen.format(eps[nextIdx]).split(" at ");
    const when = $("cd-when");
    when.innerHTML = "";
    when.append(el("span", null, day), " · ", el("span", null, time + " · BBC One"));
  }
  tick();
  setInterval(tick, 1000);

  // ── Manage panel ───────────────────────────────────────
  const dlg = $("admin");
  let draft = null;

  function draftColleagues() {
    return $("colleagues-input").value.split("\n").map((s) => s.trim()).filter(Boolean);
  }
  function wrapTd(child) { const td = el("td"); td.appendChild(child); return td; }

  function renderAdminRows() {
    const names = draftColleagues();
    const tbody = $("admin-rows");
    tbody.innerHTML = "";
    draft.celebs.forEach((c) => {
      const tr = el("tr");
      if (isOut(c)) tr.className = "out";
      tr.appendChild(el("td", null, c.name));

      const sel = el("select");
      const opts = [""].concat(names);
      if (c.colleague && !names.includes(c.colleague)) opts.push(c.colleague);
      opts.forEach((n) => {
        const o = el("option", null, n || "— Unassigned —");
        o.value = n;
        if (n === c.colleague) o.selected = true;
        sel.appendChild(o);
      });
      sel.onchange = () => { c.colleague = sel.value; };
      tr.appendChild(wrapTd(sel));

      const st = el("select");
      [["in", "At the table"], ["banished", "Banished"], ["murdered", "Murdered"]].forEach(([v, t]) => {
        const o = el("option", null, t); o.value = v; if (v === c.status) o.selected = true; st.appendChild(o);
      });
      const ep = el("input"); ep.type = "number"; ep.min = 1; ep.max = 10; ep.value = c.episode || "";
      st.onchange = () => {
        const wasOut = isOut(c);
        c.status = st.value;
        if (isOut(c) && !wasOut) {
          c.episode = c.episode || Math.max(1, airedCount());
          c.outOrder = Date.now();
          ep.value = c.episode;
        }
        if (!isOut(c)) { c.episode = null; ep.value = ""; delete c.outOrder; }
        tr.className = isOut(c) ? "out" : "";
      };
      ep.onchange = () => { c.episode = ep.value ? Number(ep.value) : null; };
      tr.appendChild(wrapTd(st));
      tr.appendChild(wrapTd(ep));

      const tBox = el("input"); tBox.type = "checkbox"; tBox.checked = !!c.traitor;
      tBox.onchange = () => { c.traitor = tBox.checked; };
      tr.appendChild(wrapTd(tBox));

      tbody.appendChild(tr);
    });
  }

  function openAdmin() {
    draft = clone(state);
    $("colleagues-input").value = draft.colleagues.join("\n");
    renderAdminRows();
    dlg.showModal();
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  $("manage-btn").onclick = openAdmin;
  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "m" && !dlg.open && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) openAdmin();
  });
  $("colleagues-input").addEventListener("input", renderAdminRows);

  $("draw-btn").onclick = () => {
    const names = shuffle(draftColleagues());
    if (!names.length) { alert("Add some colleague names first."); return; }
    if (draft.celebs.some((c) => c.colleague) && !confirm("Re-draw? This replaces the current assignments.")) return;
    const order = shuffle(draft.celebs.map((_, i) => i));
    order.forEach((ci, k) => { draft.celebs[ci].colleague = names[k % names.length]; });
    renderAdminRows();
  };

  $("save-btn").onclick = () => {
    draft.colleagues = draftColleagues();
    state = draft;
    persist();
    renderSeats();
    renderCoffin();
    dlg.close();
  };

  $("reset-btn").onclick = () => {
    if (!confirm("Discard changes made in this browser and go back to data.js?")) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    state = clone(BASE);
    renderSeats();
    renderCoffin();
    dlg.close();
  };

  $("export-btn").onclick = () => {
    const data = clone(draft);
    data.colleagues = draftColleagues();
    const src =
      "// Sweepstake data — exported " + new Date().toLocaleString("en-GB") + "\n" +
      "// status: \"in\" | \"banished\" | \"murdered\" · episode: when they left · traitor: revealed as Traitor\n\n" +
      "window.SWEEPSTAKE = " + JSON.stringify(data, null, 2) + ";\n";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([src], { type: "text/javascript" }));
    a.download = "data.js";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  // ── Go ─────────────────────────────────────────────────
  renderSeats();
  renderCoffin();
})();

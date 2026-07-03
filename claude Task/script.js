/* ============================================================
   Coding Stats — interactivity
   - per-platform data model
   - animated count-ups, donut + difficulty bars
   - tab switching with sliding pill + accent retint
   - nav active state, Live refresh with jitter
   ============================================================ */

const DATA = {
  leetcode: {
    name: "LeetCode", handle: "@dineshydk",
    accent: "#f5a524", accent2: "#fb923c",   // amber (nod to LC brand)
    rating: "1905", attended: "9", rank: "#37,225", top: "Top 4.26%",
    total: 3977,
    diff: [
      { key: "easy",   label: "Easy",   solved: 55, total: 951 },
      { key: "medium", label: "Medium", solved: 40, total: 2077 },
      { key: "hard",   label: "Hard",   solved: 7,  total: 949 },
    ],
  },
  codeforces: {
    name: "Codeforces", handle: "@dineshydk",
    accent: "#38bdf8", accent2: "#818cf8",   // sky → indigo
    rating: "1412", attended: "21", rank: "#28,640", top: "Specialist",
    total: 900,
    diff: [
      { key: "easy",   label: "Div 3 / 4", solved: 180, total: 360 },
      { key: "medium", label: "Div 2",     solved: 96,  total: 420 },
      { key: "hard",   label: "Div 1",     solved: 14,  total: 120 },
    ],
  },
  codechef: {
    name: "CodeChef", handle: "@dineshydk",
    accent: "#a78bfa", accent2: "#f472b6",   // violet → pink
    rating: "1764", attended: "6", rank: "#12,908", top: "3 ★",
    total: 700,
    diff: [
      { key: "easy",   label: "Beginner", solved: 210, total: 300 },
      { key: "medium", label: "Easy",     solved: 88,  total: 260 },
      { key: "hard",   label: "Medium",   solved: 19,  total: 140 },
    ],
  },
  tuf: {
    name: "TUF", handle: "@dineshydk",
    accent: "#2dd4bf", accent2: "#34d399",   // teal → green
    rating: "—", attended: "—", rank: "Sheet", top: "DSA Track",
    total: 455,
    diff: [
      { key: "easy",   label: "Easy",   solved: 130, total: 150 },
      { key: "medium", label: "Medium", solved: 95,  total: 190 },
      { key: "hard",   label: "Hard",   solved: 28,  total: 115 },
    ],
  },
};

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const R = 80;                       // donut radius
const CIRC = 2 * Math.PI * R;       // circumference

let activePlatform = "leetcode";

/* ---------- count-up animation ---------- */
function animateCount(el, to, dur = 1100) {
  const start = performance.now();
  const from = 0;
  function step(now) {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);          // easeOutCubic
    el.textContent = Math.round(from + (to - from) * eased).toLocaleString();
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ---------- render the difficulty bars ---------- */
function renderBars(diff) {
  const wrap = $("#bars");
  wrap.innerHTML = diff.map(d => `
    <div class="bar-card bar-${d.key}">
      <div class="bar-top">
        <span class="bar-name">${d.label}</span>
        <span class="bar-val">${d.solved}/${d.total}</span>
      </div>
      <div class="bar-track"><div class="bar-fill" data-pct="${(d.solved / d.total * 100).toFixed(1)}"></div></div>
    </div>`).join("");
  // animate widths on next frame
  requestAnimationFrame(() => {
    $$(".bar-fill", wrap).forEach(f => { f.style.width = f.dataset.pct + "%"; });
  });
}

/* ---------- render the donut ---------- */
function renderDonut(diff) {
  const solved = diff.reduce((s, d) => s + d.solved, 0);
  const segs = {
    easy:   $("#segEasy"),
    medium: $("#segMedium"),
    hard:   $("#segHard"),
  };
  // proportional arcs of the *solved* total (the colored ring fills the circle)
  let offset = 0;
  const gap = 6; // px visual gap between arcs
  [...diff].forEach(d => {
    const seg = segs[d.key];
    const frac = d.solved / solved;
    const len = Math.max(frac * CIRC - gap, 0);
    seg.style.strokeDasharray = `${len} ${CIRC - len}`;
    seg.style.strokeDashoffset = -offset;
    offset += frac * CIRC;
  });
  // center solved number
  animateCount($("#dSolved"), solved, 1000);
  return solved;
}

/* ---------- swap platform ---------- */
function setPlatform(key) {
  const d = DATA[key];
  if (!d) return;
  activePlatform = key;

  // retint accent
  document.documentElement.style.setProperty("--accent", d.accent);
  document.documentElement.style.setProperty("--accent-2", d.accent2);

  // panel header
  $("#pName").textContent   = d.name;
  $("#pHandle").textContent = d.handle;

  // metrics
  $("#mRating").textContent   = d.rating;
  $("#mAttended").textContent = d.attended;
  $("#mRank").textContent     = d.rank;
  $("#mTop").textContent      = d.top;

  // donut total + visuals
  $("#dTotal").textContent = "/" + d.total.toLocaleString();
  renderDonut(d.diff);
  renderBars(d.diff);

  // replay panel entrance
  const panel = $("#panel");
  panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap");
}

/* ---------- slide the tab pill under the active tab ---------- */
function moveTabPill(btn) {
  const pill = $("#tabPill");
  pill.style.width = btn.offsetWidth + "px";
  pill.style.transform = `translateX(${btn.offsetLeft - 6}px)`;
}

/* ---------- toast ---------- */
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1900);
}

/* ============================================================
   wire up events
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {

  // summary count-ups
  $$(".stat-num").forEach(el => animateCount(el, +el.dataset.count));

  // initial platform + pill placement
  setPlatform("leetcode");
  moveTabPill($(".tab.active"));

  // tabs
  $$(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      moveTabPill(btn);
      setPlatform(btn.dataset.platform);
    });
  });

  // nav active state
  $$(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      $$(".nav-link").forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      const page = link.dataset.nav;
      if (page !== "stats") toast(`“${link.textContent.trim()}” is a demo link — you're viewing Stats.`);
    });
  });

  // live refresh — re-animates with a little realistic jitter
  $("#refreshBtn").addEventListener("click", () => {
    const btn = $("#refreshBtn");
    btn.classList.remove("spin"); void btn.offsetWidth; btn.classList.add("spin");
    // tiny jitter on the active platform's easy-solved to feel "live"
    const d = DATA[activePlatform];
    d.diff[0].solved = Math.max(1, d.diff[0].solved + (Math.random() < 0.5 ? 1 : 0));
    setPlatform(activePlatform);
    $$(".stat-num").forEach(el => animateCount(el, +el.dataset.count));
    toast("Stats refreshed ✓");
  });

  // keep pill aligned on resize
  window.addEventListener("resize", () => moveTabPill($(".tab.active")));
});

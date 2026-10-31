// SLSV 2027 identity: generative "AI meets Life" field + logo lockups.
// AI field = precise square pixels (electric blue). Life field = organic circles (warm orange).
// Where the two fields meet, shape and colour blend.

// Brand palette, tuned for energy: chamber blue (AI) -> white spark where they meet -> SLSV orange (Life) -> glowing core.
const STOPS = {
  dark: [[0, [84, 150, 235]], [0.47, [236, 241, 248]], [0.62, [255, 138, 76]], [0.8, [223, 75, 23]], [1, [255, 150, 90]]],
  light: [[0, [44, 104, 214]], [0.38, [96, 150, 228]], [0.5, [150, 190, 236]], [0.53, [255, 176, 130]], [0.68, [244, 120, 62]], [0.85, [223, 75, 23]], [1, [214, 64, 16]]],
};

function colorAt(w, stops) {
  for (let i = 1; i < stops.length; i++) {
    const [p1, c1] = stops[i];
    const [p0, c0] = stops[i - 1];
    if (w <= p1) {
      const t = (w - p0) / (p1 - p0);
      return `rgb(${c0.map((v, k) => Math.round(v + (c1[k] - v) * t)).join(",")})`;
    }
  }
  return `rgb(${stops.at(-1)[1].join(",")})`;
}

// V4 ("abstract + figurative"): render with ?v=4 and motifs that have data-photo reveal a real photo
// through the Life circles, merging into a solid image at the core. Without it, everything renders as V3.
const PHOTO_MODE = new URLSearchParams(location.search).get("v") === "4";

const clamp = (v) => Math.max(0, Math.min(1, v));
const smooth = (t) => t * t * (3 - 2 * t);

function drawMotif(el) {
  // In V4, data-v4-* attributes override their plain counterparts (e.g. data-v4-life moves the Life field).
  if (PHOTO_MODE) for (const [k, v] of Object.entries({ ...el.dataset })) if (/^v4[A-Z]/.test(k)) el.dataset[k[2].toLowerCase() + k.slice(3)] = v;
  const W = el.clientWidth;
  const H = el.clientHeight;
  const cell = +(el.dataset.cell || 40);
  const pt = (s) => s.split(",").map(Number);
  const [ax, ay] = pt(el.dataset.ai || "0.3,0.5");
  const [lx, ly] = pt(el.dataset.life || "0.7,0.5");
  const ra = (+(el.dataset.ra || el.dataset.r || 0.38)) * Math.max(W, H);
  const rl = (+(el.dataset.rl || el.dataset.r || 0.38)) * Math.max(W, H);
  const dark = (el.dataset.theme || "dark") === "dark";
  const faint = dark ? "rgba(244,245,247,0.16)" : "rgba(18,27,49,0.08)";
  const stops = dark ? STOPS.dark : STOPS.light;
  const dots = el.dataset.empty !== "none";
  const photo = PHOTO_MODE && el.dataset.photo;
  let holes = "";

  const cols = Math.ceil(W / cell) + 1;
  const rows = Math.ceil(H / cell) + 1;
  const ox = (W - (cols - 1) * cell) / 2;
  const oy = (H - (rows - 1) * cell) / 2;
  let out = "";

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x = ox + i * cell;
      const y = oy + j * cell;
      const tA = smooth(clamp(1 - Math.hypot(x - ax * W, y - ay * H) / ra));
      const tL = smooth(clamp(1 - Math.hypot(x - lx * W, y - ly * H) / rl));
      const t = Math.max(tA, tL);
      if (t < 0.03) {
        if (!dots) continue;
        const s = cell * 0.09;
        out += `<rect x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}" fill="${faint}"/>`;
        continue;
      }
      const life = tL / (tA + tL);
      // Squares stay a little smaller than circles so the pixel grid keeps visible gaps.
      const s = cell * (0.14 + (0.68 + 0.12 * life) * Math.pow(t, 0.9));
      const r = (s / 2) * smooth(clamp((life - 0.2) / 0.6));
      const w = clamp(life * 0.85 + tL * tL * 0.15 * (life > 0.5 ? 1 : 0));
      if (photo && life > 0.6 && tL > 0.12) {
        // Life cell becomes a window onto the photo; toward the core the windows grow and fuse into the full image.
        const g = s * (1 + 1.15 * smooth(clamp((tL - 0.25) / 0.45)));
        holes += `<rect x="${(x - g / 2).toFixed(2)}" y="${(y - g / 2).toFixed(2)}" width="${g.toFixed(2)}" height="${g.toFixed(2)}" rx="${(g / 2).toFixed(2)}"/>`;
        continue;
      }
      out += `<rect x="${(x - s / 2).toFixed(2)}" y="${(y - s / 2).toFixed(2)}" width="${s.toFixed(2)}" height="${s.toFixed(2)}" rx="${r.toFixed(2)}" fill="${colorAt(w, stops)}"/>`;
    }
  }
  if (photo) {
    const id = `ph${Math.random().toString(36).slice(2, 8)}`;
    // Photo box (landscape by default) centred on data-photo-at, sized relative to the Life radius.
    const bw = rl * (+(el.dataset.photoScale || 2.4));
    const bh = bw * (+(el.dataset.photoRatio || 0.75));
    const [px, py] = pt(el.dataset.photoAt || `${lx},${ly}`);
    out += `<defs><clipPath id="${id}">${holes}</clipPath></defs><image href="${photo}" x="${px * W - bw / 2}" y="${py * H - bh / 2}" width="${bw}" height="${bh}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>`;
  }
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${out}</svg>`;
}

// The official SLSV mark (stacked: </> / SLSV / Expo & Summit), extracted from the original artwork.
// Variant by background: white text on dark, one-colour navy on brand orange (the orange mark would vanish).
const logoVariant = (el) => {
  const bg = el.closest(".dark, .light, .on-signal");
  return bg?.classList.contains("dark") ? "-white" : bg?.classList.contains("on-signal") ? "-ink" : "";
};
const logoHTML = (variant) => `<img class="slsv" src="assets/slsv-logo${variant}.png" alt="SLSV Expo & Summit">`;

function fillLockups() {
  document.querySelectorAll("[data-logo]").forEach((el) => (el.innerHTML = logoHTML(logoVariant(el))));
  document.querySelectorAll("[data-lockup]").forEach((el) => {
    el.classList.add("lockup");
    el.innerHTML = `${logoHTML(logoVariant(el))}<span class="sep"></span><img class="chamber" src="assets/chamber.png" alt="US China Chamber of Commerce Silicon Valley">`;
  });
}

window.addEventListener("DOMContentLoaded", () => {
  fillLockups();
  document.querySelectorAll(".motif").forEach(drawMotif);
});

// Deterministic QR-style placeholder (replace with the real registration QR before print).
function drawQR(el) {
  const n = 25;
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="currentColor"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="var(--qr-bg,#fff)"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="currentColor"/>`;
  const inFinder = (x, y) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
  let cells = "";
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!inFinder(x, y) && rnd() > 0.52) cells += `<rect x="${x}" y="${y}" width="1" height="1" fill="currentColor"/>`;
  el.innerHTML = `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" style="width:100%;height:100%;display:block">${cells}${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}</svg>`;
}
window.addEventListener("DOMContentLoaded", () => document.querySelectorAll(".qr").forEach(drawQR));

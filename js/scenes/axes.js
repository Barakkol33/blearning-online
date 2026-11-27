// Scene "axes": a coordinate plane with a grid, points, segments and labels.
// Built for analytic geometry (distance, midpoint, shapes on axes) and meant
// to be reused by later courses (lines, circles, function points).
// Scene options:
//   x: [-1, 8], y: [-1, 6]   the visible range (whole numbers)
//   points: { A: [1, 1], B: [5, 4] }   points, in coordinates
//   coords: true (default)   write each point's coordinates next to its name
// Step keys (all optional):
//   at: { M: [3, 2.5] }      add or move points; moves slide. Persists.
//   show: [A, B]             only these points (default: all known points)
//   lines: [AB, BC]          segments (scene option `lines` = always drawn)
//   hot: [AB]                emphasized segments    dash: [AC]  dashed ones
//   fill: [ABC]              shade a polygon
//   marks: [AB, CD]          equal-length ticks (marks2: a second group, two ticks)
//   sides: { AB: "5" }       a length label beside a segment
//   legs: [AB] or [{ s: AB, dx: "4", dy: "3" }]
//                            the right triangle under a segment: a horizontal and
//                            a vertical leg, labeled with their lengths
//   proj: [M]                dashed lines from a point to both axes, values marked
//   right: [ACB]             a right-angle square at the middle letter
//   coords: false            hide coordinates in this step
//   label: the big line on top
import { s } from './svg.js';
import { reduceMotion } from '../util.js';

const list = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);
const fx = (v) => {
  const r = Math.round(v * 100) / 100;
  return r < 0 ? '−' + -r : String(r);
};

export function axes(spec) {
  const [x0, x1] = spec.x || [-1, 8], [y0, y1] = spec.y || [-1, 6];
  const u = Math.min(44, 360 / (x1 - x0), 300 / (y1 - y0));
  const L = 34, T = 56, R = 26, B = 30;
  const W = L + u * (x1 - x0) + R, H = T + u * (y1 - y0) + B;
  const X = (v) => L + (v - x0) * u, Y = (v) => T + (y1 - v) * u;
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'nl axes', direction: 'ltr', role: 'img' });

  // The fixed background: grid, axes, numbers.
  const bg = s('g', {}, svg);
  for (let v = x0; v <= x1; v++) s('line', { x1: X(v), y1: Y(y0), x2: X(v), y2: Y(y1), class: 'agrid' }, bg);
  for (let v = y0; v <= y1; v++) s('line', { x1: X(x0), y1: Y(v), x2: X(x1), y2: Y(v), class: 'agrid' }, bg);
  const ax = Math.min(Math.max(0, x0), x1), ay = Math.min(Math.max(0, y0), y1); // where the axes sit
  s('line', { x1: X(x0), y1: Y(ay), x2: X(x1) + 12, y2: Y(ay), class: 'aaxis' }, bg);
  s('line', { x1: X(ax), y1: Y(y0), x2: X(ax), y2: Y(y1) - 12, class: 'aaxis' }, bg);
  s('path', { d: `M${X(x1) + 14},${Y(ay)} l-9,-5 v10 z`, class: 'ahead' }, bg);
  s('path', { d: `M${X(ax)},${Y(y1) - 14} l-5,9 h10 z`, class: 'ahead' }, bg);
  s('text', { x: X(x1) + 12, y: Y(ay) - 9, class: 'aname', 'text-anchor': 'middle' }, bg).textContent = 'x';
  s('text', { x: X(ax) + 13, y: Y(y1) - 6, class: 'aname', 'text-anchor': 'middle' }, bg).textContent = 'y';
  const every = Math.max(x1 - x0, y1 - y0) > 14 ? 2 : 1;
  for (let v = x0; v <= x1; v++) {
    if (v === ax || v % every) continue;
    s('text', { x: X(v), y: Y(ay) + 17, class: 'anum', 'text-anchor': 'middle' }, bg).textContent = fx(v);
  }
  for (let v = y0; v <= y1; v++) {
    if (v === ay || v % every) continue;
    s('text', { x: X(ax) - 7, y: Y(v) + 5, class: 'anum', 'text-anchor': 'end' }, bg).textContent = fx(v);
  }
  if (ax === 0 && ay === 0) s('text', { x: X(0) - 7, y: Y(0) + 17, class: 'anum', 'text-anchor': 'end' }, bg).textContent = '0';

  const g = s('g', {}, svg);
  const label = s('text', { x: W / 2, y: 28, class: 'nl-label', 'text-anchor': 'middle' }, svg);
  const base = { ...(spec.points || {}) };
  let raf = 0;

  function paint(st, at, prev, animate, sliding = false) {
    g.replaceChildren();
    const shown = st.show ? list(st.show) : Object.keys(at);
    const P = {};
    for (const k of shown) if (at[k]) P[k] = at[k];
    const ok = (n) => [...n].every((ch) => P[ch]);
    const px = (k) => [X(P[k][0]), Y(P[k][1])];
    const all = Object.values(P);
    const gx = all.reduce((t, q) => t + X(q[0]), 0) / (all.length || 1), gy = all.reduce((t, q) => t + Y(q[1]), 0) / (all.length || 1);
    const away = (mx, my, nx, ny) => (nx * (mx - gx) + ny * (my - gy) < 0 ? [-nx, -ny] : [nx, ny]);

    for (const f of list(st.fill).filter(ok)) {
      s('polygon', { points: [...f].map((k) => px(k).join(',')).join(' '), class: 'afill' }, g);
    }
    // Legs of the right triangle under a segment, from the first point.
    for (const raw of list(st.legs)) {
      const o = typeof raw === 'string' ? { s: raw } : raw;
      if (!ok(o.s)) continue;
      const [a, b] = [P[o.s[0]], P[o.s[1]]];
      const c = [b[0], a[1]];
      const [ax2, ay2] = [X(a[0]), Y(a[1])], [bx, by] = [X(b[0]), Y(b[1])], [cx, cy] = [X(c[0]), Y(c[1])];
      s('line', { x1: ax2, y1: ay2, x2: cx, y2: cy, class: 'aleg h' }, g);
      s('line', { x1: cx, y1: cy, x2: bx, y2: by, class: 'aleg v' }, g);
      if (a[0] !== b[0] && a[1] !== b[1]) {
        const sx = Math.sign(ax2 - cx) * 11, sy = Math.sign(by - cy) * 11;
        s('path', { d: `M${cx + sx},${cy} v${sy} h${-sx}`, class: 'aright' }, g);
      }
      const dx = o.dx ?? fx(Math.abs(b[0] - a[0])), dy = o.dy ?? fx(Math.abs(b[1] - a[1]));
      const below = cy > by ? -8 : 20; // the horizontal leg's label goes inside, away from the point names
      if (a[0] !== b[0]) s('text', { x: (ax2 + cx) / 2, y: cy + below, class: 'aleg-l h', 'text-anchor': 'middle' }, g).textContent = dx;
      if (a[1] !== b[1]) s('text', { x: cx + (cx > ax2 ? 10 : -10), y: (cy + by) / 2 + 5, class: 'aleg-l v', 'text-anchor': cx > ax2 ? 'start' : 'end' }, g).textContent = dy;
    }
    // Projections to the axes.
    for (const k of list(st.proj)) {
      if (!P[k]) continue;
      const [x, y] = px(k);
      // Skip the part that would have no length (a point already on an axis).
      if (P[k][1] !== ay) {
        s('line', { x1: x, y1: y, x2: x, y2: Y(ay), class: 'aproj' }, g);
        s('circle', { cx: x, cy: Y(ay), r: 3.5, class: 'aproj-pt' }, g);
        s('text', { x, y: Y(ay) + 34, class: 'aproj-l', 'text-anchor': 'middle' }, g).textContent = fx(P[k][0]);
      }
      if (P[k][0] !== ax) {
        s('line', { x1: x, y1: y, x2: X(ax), y2: y, class: 'aproj' }, g);
        s('circle', { cx: X(ax), cy: y, r: 3.5, class: 'aproj-pt' }, g);
        s('text', { x: X(ax) - 26, y: y + 5, class: 'aproj-l', 'text-anchor': 'end' }, g).textContent = fx(P[k][1]);
      }
    }
    const hot = new Set(list(st.hot).flatMap((n) => [n, [...n].reverse().join('')]));
    const dash = new Set(list(st.dash));
    const was = new Set(prev ? [...list(spec.lines), ...list(prev.lines), ...list(prev.hot), ...list(prev.dash)] : []);
    for (const n of new Set([...list(spec.lines), ...list(st.lines), ...list(st.hot), ...dash])) {
      if (!ok(n)) continue;
      const [[ax3, ay3], [bx, by]] = [px(n[0]), px(n[1])];
      const ln = s('line', { x1: ax3, y1: ay3, x2: bx, y2: by, class: 'aseg' + (hot.has(n) ? ' hot' : '') + (dash.has(n) ? ' dash' : '') }, g);
      if (animate && !was.has(n) && !dash.has(n)) {
        const len = Math.hypot(bx - ax3, by - ay3);
        ln.style.strokeDasharray = len;
        ln.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 600, easing: 'ease-out', fill: 'backwards' });
      }
    }
    const tick = (n, offs) => {
      const [[ax3, ay3], [bx, by]] = [px(n[0]), px(n[1])];
      const mx = (ax3 + bx) / 2, my = (ay3 + by) / 2, d = Math.hypot(bx - ax3, by - ay3) || 1;
      const ux = (bx - ax3) / d, uy = (by - ay3) / d, nx = -uy * 8, ny = ux * 8;
      for (const o of offs) s('line', { x1: mx - nx + ux * o, y1: my - ny + uy * o, x2: mx + nx + ux * o, y2: my + ny + uy * o, class: 'amark' }, g);
    };
    list(st.marks).filter(ok).forEach((n) => tick(n, [0]));
    list(st.marks2).filter(ok).forEach((n) => tick(n, [-4, 4]));
    for (const [n, txt] of Object.entries(st.sides || {})) {
      if (!ok(n)) continue;
      const [[ax3, ay3], [bx, by]] = [px(n[0]), px(n[1])];
      const mx = (ax3 + bx) / 2, my = (ay3 + by) / 2, d = Math.hypot(bx - ax3, by - ay3) || 1;
      const [nx, ny] = away(mx, my, -(by - ay3) / d, (bx - ax3) / d);
      const t = String(txt);
      const hw = t.length * 4.5 + 2; // keep the label inside the picture
      s('text', { x: Math.min(Math.max(mx + nx * (14 + t.length * 2.5), hw), W - hw), y: my + ny * 16 + 6, class: 'aside', 'text-anchor': 'middle' }, g).textContent = t;
    }
    for (const a of list(st.right)) {
      if (!ok(a)) continue;
      const [p, v, q] = [px(a[0]), px(a[1]), px(a[2])];
      const u1 = [p[0] - v[0], p[1] - v[1]], u2 = [q[0] - v[0], q[1] - v[1]];
      const l1 = Math.hypot(...u1) || 1, l2 = Math.hypot(...u2) || 1;
      const e1 = [(u1[0] / l1) * 12, (u1[1] / l1) * 12], e2 = [(u2[0] / l2) * 12, (u2[1] / l2) * 12];
      s('path', { d: `M${v[0] + e1[0]},${v[1] + e1[1]} l${e2[0]},${e2[1]} l${-e1[0]},${-e1[1]}`, class: 'aright' }, g);
    }
    // Points last, so they sit on top. Names are pushed away from the middle.
    const coords = !sliding && (st.coords ?? spec.coords ?? true);
    const had = new Set(prev ? (prev.show ? list(prev.show) : Object.keys({ ...base, ...(prev._at || prev.at || {}) })) : Object.keys(P));
    for (const k of Object.keys(P)) {
      const [x, y] = px(k);
      const c = s('circle', { cx: x, cy: y, r: 5, class: 'apt' }, g);
      if (animate && !had.has(k)) c.classList.add('pop');
      let dx = x - gx, dy = y - gy;
      if (Math.hypot(dx, dy) < 1) { dx = 0.6; dy = -1; }
      const d = Math.hypot(dx, dy);
      const txt = coords ? `${k}(${fx(P[k][0])}, ${fx(P[k][1])})` : k;
      let tx = x + (dx / d) * 16, ty = y + (dy / d) * 16 + 6;
      let anchor = Math.abs(dx / d) < 0.35 ? 'middle' : dx > 0 ? 'start' : 'end';
      // Keep the name inside the picture: flip it to the other side near an edge.
      const w = txt.length * 8.4;
      if (anchor === 'end' && tx - w < 2) { anchor = 'start'; tx = x + 9; ty = y - 9; }
      else if (anchor === 'start' && tx + w > W - 2) { anchor = 'end'; tx = x - 9; ty = y - 9; }
      else if (anchor === 'middle') tx = Math.min(Math.max(tx, w / 2 + 2), W - w / 2 - 2);
      s('text', { x: tx, y: ty, class: 'apt-l', 'text-anchor': anchor }, g).textContent = txt;
    }
    label.textContent = st.label || '';
  }

  function draw(st, prev) {
    cancelAnimationFrame(raf);
    const to = { ...base, ...(st._at || st.at || {}) };
    const from = prev ? { ...base, ...(prev._at || prev.at || {}) } : to;
    const anim = !!prev && !reduceMotion();
    const moving = Object.keys(to).some((k) => from[k] && (from[k][0] !== to[k][0] || from[k][1] !== to[k][1]));
    if (!anim || !moving) return paint(st, to, prev, anim);
    const t0 = performance.now(), dur = 1000;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const at = {};
      for (const key of Object.keys(to)) {
        const a = from[key] || to[key], b = to[key];
        at[key] = [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e];
      }
      paint(st, at, prev, false, k < 1);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }
  return { svg, draw };
}

// A still figure for an exercise (no animation).
export function axesFig(spec, step = {}) {
  const a = axes(spec);
  a.draw(step, null);
  a.svg.classList.add('fig', 'axes-fig');
  return a.svg.outerHTML;
}

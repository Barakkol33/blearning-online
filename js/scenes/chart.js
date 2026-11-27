// Scene "chart": a bar chart, a pie chart or a line graph, built step by step.
// Built for reading data (3-unit "conclusions from data") and meant to be
// reused by later data courses (frequency tables, statistics).
// Scene options:
//   kind: bar | pie | line
//   data: [[label, value], ...]   a third item replaces the written value ("?")
//   max, min: the value axis (default 0 .. a round number above the data)
//   tick: the gap between grid lines (default: a round step)
//   unit: written after each value ("%")
//   name: the value axis name, written above it
//   xName: the category axis name, written under its right end
//   xEvery: label only every k-th category (long line graphs)
//   note: small text under the chart (default "נתונים לדוגמה"; "" hides it)
// Step keys (all optional):
//   show: how many items, from the first, are drawn (default: all)
//   hot: an index or a list of indices to emphasize
//   values: true writes each value on its bar or point (pie: always written)
//   read: an index or list: a dashed line from that bar or point to the value
//         axis, with the value marked on the axis
//   seg: line only: an index or list i, emphasizing the segment i → i+1
//   guide: a number, { y, text }, or a list: a dashed horizontal line
//   min: the value axis starts here in this step (to show a cut axis)
//   label: the big line on top
import { s } from './svg.js';
import { reduceMotion } from '../util.js';

const W = 640, L = 64, R = 24, T = 58, B = 52;
// SVG text here is LTR; a Hebrew label ("חצי = 60") is embedded RTL so it reads right.
const heb = (t) => (/[֐-׿]/.test(t) ? `‫${t}‬` : t);
const list = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);
const fx = (v) => {
  const r = Math.round(v * 100) / 100;
  return r < 0 ? '−' + -r : String(r);
};
// A round grid step: 1, 2, 5 × 10ⁿ, with at most 6 lines.
const niceStep = (span) => {
  for (let p = 10 ** Math.floor(Math.log10(span || 1) - 1); ; p *= 10) {
    for (const m of [1, 2, 5]) if (span / (m * p) <= 6) return m * p;
  }
};

export function chart(spec) {
  const kind = spec.kind || 'bar';
  const data = spec.data || [];
  const unit = spec.unit || '';
  const H = kind === 'pie' ? 300 : 320;
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: `nl chart chart-${kind}`, direction: 'ltr', role: 'img' });
  const g = s('g', {}, svg);
  const label = s('text', { x: W / 2, y: 28, class: 'nl-label', 'text-anchor': 'middle' }, svg);
  const note = spec.note ?? 'נתונים לדוגמה';
  if (note) s('text', { x: 8, y: H - 6, class: 'cnote', 'text-anchor': 'start' }, svg).textContent = heb(note);
  const dmax = Math.max(...data.map((d) => d[1]), 1);
  const tick0 = spec.tick || niceStep(dmax);
  const vmax = spec.max ?? Math.ceil(dmax / tick0) * tick0;
  const txt = (d) => (d[2] != null ? String(d[2]) : fx(d[1]) + unit);

  function draw(st, prev) {
    const anim = !!prev && !reduceMotion();
    g.replaceChildren();
    const n = Math.min(st.show ?? data.length, data.length);
    const pn = anim ? Math.min(prev.show ?? data.length, data.length) : n;
    const hot = new Set(list(st.hot));
    const fade = (el, d = 0) => anim && el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: d, fill: 'backwards' });
    let delay = 0;

    if (kind === 'pie') {
      const total = data.reduce((t, d) => t + d[1], 0) || 1;
      const cx = W / 2, cy = T + (H - T - 30) / 2, r = Math.min(100, (H - T - 40) / 2);
      let a0 = -Math.PI / 2;
      data.slice(0, n).forEach((d, i) => {
        const a1 = a0 + (d[1] / total) * 2 * Math.PI, mid = (a0 + a1) / 2;
        const pull = hot.has(i) ? 8 : 0, ox = Math.cos(mid) * pull, oy = Math.sin(mid) * pull;
        const P = (a, rr = r) => [cx + ox + Math.cos(a) * rr, cy + oy + Math.sin(a) * rr];
        const [x0, y0] = P(a0), [x1, y1] = P(a1);
        const big = a1 - a0 > Math.PI ? 1 : 0;
        const miss = d[2] === '?';
        const path = a1 - a0 >= 2 * Math.PI - 1e-9
          ? `M${cx - r},${cy} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0`
          : `M${cx + ox},${cy + oy} L${x0},${y0} A${r},${r} 0 ${big},1 ${x1},${y1} Z`;
        const cls = `cslice c${i % 8}` + (miss ? ' miss' : '') + (hot.size && !hot.has(i) ? ' dim' : '') + (hot.has(i) ? ' hot' : '');
        const el = s('path', { d: path, class: cls }, g);
        // The name and value outside the slice, pushed away from the center.
        const [lx, ly] = P(mid, r + 18);
        const anchor = Math.abs(Math.cos(mid)) < 0.25 ? 'middle' : Math.cos(mid) > 0 ? 'start' : 'end';
        const t = s('text', { x: lx, y: ly + (Math.sin(mid) > 0.3 ? 12 : Math.sin(mid) < -0.3 ? -4 : 5), class: 'clab' + (hot.has(i) ? ' hot' : ''), 'text-anchor': anchor }, g);
        t.textContent = heb(`${d[0]} ${txt(d)}`);
        if (anim && i >= pn) { el.animate([{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], { duration: 450, delay, fill: 'backwards' }); fade(t, delay + 200); delay += 220; }
        a0 = a1;
      });
    } else {
      const vmin = st.min ?? spec.min ?? 0;
      const tick = st.min != null || spec.min != null ? niceStep(vmax - vmin) : tick0;
      const PW = W - L - R, PH = H - T - B;
      const Y = (v) => T + ((vmax - Math.max(vmin, v)) / (vmax - vmin)) * PH;
      const band = PW / Math.max(data.length, 1);
      const X = (i) => L + band * (i + 0.5);
      // Grid and value axis.
      for (let v = Math.ceil(vmin / tick) * tick; v <= vmax + 1e-9; v += tick) {
        s('line', { x1: L, y1: Y(v), x2: W - R, y2: Y(v), class: 'cgrid' }, g);
        s('text', { x: L - 8, y: Y(v) + 5, class: 'cnum', 'text-anchor': 'end' }, g).textContent = heb(fx(v));
      }
      s('line', { x1: L, y1: T - 8, x2: L, y2: T + PH, class: 'caxis' }, g);
      s('line', { x1: L, y1: T + PH, x2: W - R, y2: T + PH, class: 'caxis' }, g);
      if (vmin > 0) s('path', { d: `M${L - 7},${T + PH - 10} l7,-4 l7,4 M${L - 7},${T + PH - 4} l7,-4 l7,4`, class: 'ccut' }, g);
      if (spec.name) s('text', { x: L - 8, y: T - 18, class: 'cname', 'text-anchor': 'start' }, g).textContent = heb(spec.name);
      if (spec.xName) s('text', { x: W - R, y: T + PH + 42, class: 'cname', 'text-anchor': 'end' }, g).textContent = heb(spec.xName);
      const every = spec.xEvery || 1;
      data.forEach((d, i) => {
        if (i % every === 0) s('text', { x: X(i), y: T + PH + 22, class: 'ccat', 'text-anchor': 'middle' }, g).textContent = heb(d[0]);
      });

      if (kind === 'bar') {
        const bw = Math.min(64, band * 0.56);
        data.slice(0, n).forEach((d, i) => {
          const x = X(i) - bw / 2, y = Y(d[1]), h0 = T + PH - y, rr = Math.min(4, h0);
          const el = s('path', { d: `M${x},${T + PH} V${y + rr} Q${x},${y} ${x + rr},${y} H${x + bw - rr} Q${x + bw},${y} ${x + bw},${y + rr} V${T + PH} Z`, class: 'cbar' + (hot.has(i) ? ' hot' : '') }, g);
          if (anim && i >= pn) { el.animate([{ transform: 'scaleY(0)' }, { transform: 'none' }], { duration: 500, delay, easing: 'ease-out', fill: 'backwards' }); delay += 180; }
        });
      } else {
        const pts = data.slice(0, n).map((d, i) => [X(i), Y(d[1])]);
        for (let i = 0; i + 1 < pts.length; i++) {
          const ln = s('line', { x1: pts[i][0], y1: pts[i][1], x2: pts[i + 1][0], y2: pts[i + 1][1], class: 'cline' + (list(st.seg).includes(i) ? ' hot' : '') }, g);
          if (anim && i + 1 >= pn) {
            const len = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
            ln.style.strokeDasharray = len;
            ln.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 320, delay, fill: 'backwards' });
            delay += 320;
          }
        }
        pts.forEach(([x, y], i) => {
          if (data.length > 12 && !hot.has(i)) return; // dense curves: no markers
          const c = s('circle', { cx: x, cy: y, r: hot.has(i) ? 6.5 : 4.5, class: 'cpt' + (hot.has(i) ? ' hot' : '') }, g);
          if (anim && i >= pn) fade(c, delay);
        });
      }
      // Values on top of bars or points.
      if (st.values) {
        data.slice(0, n).forEach((d, i) => {
          const t = s('text', { x: X(i), y: Y(d[1]) - 10, class: 'cval' + (hot.has(i) ? ' hot' : ''), 'text-anchor': 'middle' }, g);
          t.textContent = heb(txt(d));
        });
      }
      // Reading lines: from the bar or point to the value axis.
      for (const i of list(st.read)) {
        if (i >= n) continue;
        const y = Y(data[i][1]);
        const el = s('line', { x1: X(i), y1: y, x2: L, y2: y, class: 'cread' }, g);
        const t = s('text', { x: L + 6, y: y - 6, class: 'cread-l', 'text-anchor': 'start' }, g);
        t.textContent = heb(txt(data[i]));
        const was = list(prev?.read).includes(i);
        if (!was) { fade(el, delay); fade(t, delay); }
      }
      for (const raw of list(st.guide)) {
        const o = typeof raw === 'object' ? raw : { y: raw };
        const y = Y(o.y);
        const el = s('line', { x1: L, y1: y, x2: W - R, y2: y, class: 'cguide' }, g);
        const t = s('text', { x: W - R, y: y - 7, class: 'cguide-l', 'text-anchor': 'end' }, g);
        t.textContent = heb(o.text ?? fx(o.y));
        if (!list(prev?.guide).some((p) => (typeof p === 'object' ? p.y : p) === o.y)) { fade(el, delay); fade(t, delay); }
      }
    }
    label.textContent = heb(st.label || '');
    if (anim && st.label && st.label !== prev.label) fade(label, delay);
  }
  return { svg, draw };
}

// A still figure for an exercise (no animation).
export function chartFig(spec, step = {}) {
  const c = chart(spec);
  c.draw(step, null);
  c.svg.classList.add('fig', 'chart-fig');
  return c.svg.outerHTML;
}

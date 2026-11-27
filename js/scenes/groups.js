// Scene "groups": equal groups and arrays, for multiplication.
//   item: an emoji (default: a dot)
// Step keys:
//   groups: how many groups      size: items in each (or a list, for unequal groups)
//   array: true draws a grid (one row per group) instead of plates
//   by: rows | cols    outlines rows or columns of an array
//   count: true (or a number k) writes the running total under the first k groups
//   label: the big line on top
import { s } from './svg.js';
import { reduceMotion } from '../util.js';

const W = 640, TOP = 50, CELL = 34;

export function groups(spec) {
  const item = spec.item || null;
  const svg = s('svg', { viewBox: `0 0 ${W} 240`, class: 'nl groups', direction: 'ltr', role: 'img' });
  const g = s('g', {}, svg);
  const label = s('text', { x: W / 2, y: 30, class: 'nl-label', 'text-anchor': 'middle' }, svg);

  const dot = (x, y, parent) =>
    item
      ? (s('text', { x, y: y + 9, class: 'g-item', 'text-anchor': 'middle' }, parent).textContent = item)
      : s('circle', { cx: x, cy: y, r: 11, class: 'g-dot' }, parent);

  const sizesOf = (st) => {
    const n = st.groups || 0;
    return Array.isArray(st.size) ? st.size.slice(0, n) : Array.from({ length: n }, () => st.size || 0);
  };
  const countOf = (st, n) => (st.count === true ? n : st.count || 0);

  function draw(st, prev) {
    const anim = !!prev && !reduceMotion();
    g.replaceChildren();
    const sizes = sizesOf(st), n = sizes.length;
    const pn = anim ? sizesOf(prev).length : n, sameShape = anim && prev.array === st.array && prev.size === st.size;
    const pc = anim ? countOf(prev, sizesOf(prev).length) : 0;
    const k = countOf(st, n);
    let delay = 0, H = 240, VW = W;
    // Fit the picture to its content (and the label), so small scenes aren't tiny.
    const fit = (w) => Math.max(w, (st.label || '').length * 13 + 40, 300);
    const fresh = (el, i) => {
      if (anim && (i >= pn || !sameShape)) {
        el.animate([{ opacity: 0, transform: 'translateY(-18px)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay, fill: 'backwards' });
        delay += 160;
      }
    };
    const countText = (x, y, i, total) => {
      const t = s('text', { x, y, class: 'g-count', 'text-anchor': 'middle' }, g);
      t.textContent = total;
      if (anim && i >= pc) { t.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay, fill: 'backwards' }); delay += 260; }
    };

    if (st.array) {
      const cols = Math.max(...sizes, 0);
      const gw = cols * CELL, gh = n * CELL;
      VW = fit(gw + 120);
      H = TOP + gh + 60;
      const x0 = (VW - gw) / 2, y0 = TOP + 8;
      for (let r = 0; r < n; r++) {
        const row = s('g', {}, g);
        for (let c = 0; c < sizes[r]; c++) dot(x0 + gw - (c + 0.5) * CELL, y0 + (r + 0.5) * CELL, row);
        fresh(row, r);
      }
      if (st.by === 'rows') {
        for (let r = 0; r < n; r++) {
          s('rect', { x: x0 - 4, y: y0 + r * CELL + 2, width: gw + 8, height: CELL - 4, rx: 14, class: 'g-band' }, g);
          if (r < k) countText(x0 - 30, y0 + (r + 0.5) * CELL + 6, r, (r + 1) * cols);
        }
      } else if (st.by === 'cols') {
        for (let c = 0; c < cols; c++) {
          const x = x0 + gw - (c + 1) * CELL;
          s('rect', { x: x + 2, y: y0 - 4, width: CELL - 4, height: gh + 8, rx: 14, class: 'g-band' }, g);
          if (c < (st.count === true ? cols : st.count || 0)) countText(x + CELL / 2, y0 + gh + 30, c, (c + 1) * n);
        }
      }
    } else {
      // Plates, first group on the right (Hebrew reading order); wrap after 5.
      const per = Math.min(5, Math.max(...sizes, 1)), rowsIn = Math.ceil(Math.max(...sizes, 1) / per);
      const PW = per * 28 + 18, PH = rowsIn * 28 + 18, GAP = 18;
      const perLine = Math.min(n, 5), lines = Math.ceil(n / 5) || 1;
      const lw = perLine * (PW + GAP) - GAP;
      VW = fit(lw + 40);
      H = TOP + lines * (PH + 44) + 10;
      const x0 = (VW - lw) / 2;
      let run = 0;
      sizes.forEach((sz, i) => {
        run += sz;
        const line = Math.floor(i / 5), col = i % 5;
        const x = x0 + lw - (col + 1) * PW - col * GAP, y = TOP + line * (PH + 44);
        const plate = s('g', {}, g);
        s('rect', { x, y, width: PW, height: PH, rx: 16, class: 'g-plate' }, plate);
        for (let j = 0; j < sz; j++) dot(x + 9 + (j % per + 0.5) * 28, y + 9 + (Math.floor(j / per) + 0.5) * 28, plate);
        fresh(plate, i);
        if (i < k) countText(x + PW / 2, y + PH + 28, i, run);
      });
    }
    svg.setAttribute('viewBox', `0 0 ${VW} ${H}`);
    label.setAttribute('x', VW / 2);
    label.textContent = st.label || '';
    if (anim && st.label && st.label !== prev.label) label.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay, fill: 'backwards' });
  }
  return { svg, draw };
}

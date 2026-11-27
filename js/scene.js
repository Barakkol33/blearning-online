// Animated "scenes" described as data in the lesson file.
// A scene is a list of steps; each step is a full picture + one sentence.
// The same steps render three ways: animated (lesson), still frames
// (static view / print), and one step per card (feed).
import { h, esc, fmt, reduceMotion } from './util.js';

const NS = 'http://www.w3.org/2000/svg';
const W = 640, H = 150, PAD = 28, Y = 96, MY = Y - 8, HOP = 380;

function s(tag, attrs = {}, parent) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  parent?.append(e);
  return e;
}
const list = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);
const arrowsOf = (v) => (!v ? [] : Array.isArray(v[0]) ? v : [v]);
const num = (v) => (v < 0 ? '−' + -v : String(v));

// The marker (the frog) stays where it was unless a step moves it.
export function resolveSteps(spec) {
  let marker = null, at = {};
  return (spec.steps || []).map((st) => {
    if ('marker' in st) marker = st.marker;
    if (st.at) at = { ...at, ...st.at };
    return { ...st, marker, _at: { ...at } };
  });
}

let uid = 0;
export function numberLine(spec) {
  const [a, b] = spec.range || [-5, 5];
  const x = (v) => PAD + ((v - a) * (W - 2 * PAD)) / (b - a);
  const id = 'nl' + ++uid;
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'nl', direction: 'ltr', role: 'img' });

  const defs = s('defs', {}, svg);
  for (const k of ['pos', 'neg']) {
    const m = s('marker', { id: `${id}-${k}`, viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' }, defs);
    s('path', { d: 'M0,0 L10,5 L0,10 z', class: `head ${k}` }, m);
  }
  s('line', { x1: PAD - 14, y1: Y, x2: W - PAD + 14, y2: Y, class: 'axis' }, svg);
  const span = b - a;
  const every = spec.labelEvery || (span > 60 ? 10 : span > 24 ? 5 : 1);
  for (let v = Math.ceil(a); v <= b; v++) {
    const z = v === 0;
    s('line', { x1: x(v), y1: Y - (z ? 9 : 5), x2: x(v), y2: Y + (z ? 9 : 5), class: 'tick' + (z ? ' zero' : '') }, svg);
    if (v % every === 0) {
      s('text', { x: x(v), y: Y + 30, class: 'tick-label' + (z ? ' zero' : ''), 'text-anchor': 'middle' }, svg).textContent = num(v);
    }
  }
  const gA = s('g', {}, svg);
  const gP = s('g', {}, svg);
  const label = s('text', { x: W / 2, y: 28, class: 'nl-label', 'text-anchor': 'middle' }, svg);
  const marker = s('g', { class: 'marker' }, svg);
  s('text', { 'text-anchor': 'middle', y: 0 }, marker).textContent = spec.marker || '🐸';

  const at = (v, lift = 0) => `translate(${x(v)}px, ${MY - lift}px)`;
  // Split a move into hops: by `hop` (scene option, e.g. 10) when it divides
  // evenly, else by 1 for short moves, else one big arc.
  const big = spec.hop || 1;
  const segments = (f, t) => {
    const dir = Math.sign(t - f), n = Math.abs(t - f);
    const size = n > 0 && n % big === 0 && n / big <= 12 ? big : Number.isInteger(n) && n > 0 && n <= 12 ? 1 : 0;
    if (!size) return { unit: false, segs: [[f, t]] };
    return { unit: true, segs: Array.from({ length: n / size }, (_, k) => [f + dir * k * size, f + dir * (k + 1) * size]) };
  };

  function hop(from, to) {
    const { segs } = segments(from, to);
    const frames = [];
    segs.forEach(([u, v], k) => {
      frames.push({ transform: at(u), offset: k / segs.length });
      frames.push({ transform: `translate(${(x(u) + x(v)) / 2}px, ${MY - 24}px)`, offset: (k + 0.5) / segs.length });
    });
    frames.push({ transform: at(to), offset: 1 });
    marker.animate(frames, { duration: HOP * segs.length, easing: 'linear' });
  }

  // Draw a step. Pass the previous step as `prev` to animate the change.
  function draw(st, prev) {
    const anim = !!prev && !reduceMotion();
    gA.replaceChildren();
    gP.replaceChildren();

    const had = new Set(list(prev?.points));
    for (const p of list(st.points)) {
      const c = s('circle', { cx: x(p), cy: Y, r: 6, class: 'pt' }, gP);
      if (anim && !had.has(p)) c.classList.add('pop');
    }

    let busy = 0;
    for (const [f, t] of arrowsOf(st.arrow)) {
      const kind = t > f ? 'pos' : 'neg';
      const { unit, segs } = segments(f, t);
      const isNew = anim && !arrowsOf(prev?.arrow).some(([p, q]) => p === f && q === t);
      segs.forEach(([u, v], k) => {
        const hgt = unit ? 44 : Math.min(100, 24 + Math.abs(x(v) - x(u)) * 0.2);
        const p = s('path', { d: `M${x(u)},${Y - 4} Q${(x(u) + x(v)) / 2},${Y - 4 - hgt} ${x(v)},${Y - 4}`, class: `arc ${kind}` }, gA);
        const last = k === segs.length - 1;
        const head = () => p.setAttribute('marker-end', `url(#${id}-${kind})`);
        if (isNew) {
          try {
            const L = p.getTotalLength();
            p.style.strokeDasharray = L;
            p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: HOP, delay: k * HOP, fill: 'backwards', easing: 'ease-out' });
          } catch { /* not in DOM yet */ }
          if (last) setTimeout(head, segs.length * HOP);
        } else if (last) head();
      });
      const lift = unit ? 44 : Math.min(100, 24 + Math.abs(x(t) - x(f)) * 0.2);
      const tl = s('text', { x: (x(f) + x(t)) / 2, y: Y - 4 - lift / 2 - 12, class: `arc-label ${kind}`, 'text-anchor': 'middle' }, gA);
      tl.textContent = (t > f ? '+' : '−') + Math.abs(t - f);
      if (isNew) {
        tl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: segs.length * HOP, fill: 'backwards' });
        busy = Math.max(busy, segs.length * HOP);
      }
    }

    if (st.marker == null) {
      marker.style.display = 'none';
    } else {
      marker.style.display = '';
      marker.style.transform = at(st.marker);
      if (anim && prev.marker != null && prev.marker !== st.marker) {
        hop(prev.marker, st.marker);
        busy = Math.max(busy, segments(prev.marker, st.marker).segs.length * HOP);
      }
    }

    label.textContent = st.label || '';
    if (anim && st.label && st.label !== prev.label) {
      label.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 400, delay: busy, fill: 'backwards' });
    }
  }

  return { svg, draw };
}

// Base-ten blocks: rods of ten and single cubes (ones grouped in frames of 10).
// Step keys: tens, ones, crossed (how many of the ones, from the end, are
// crossed out — "taken away"), crossedTens (the same for the rods), label.
export function blocks(spec) {
  const S = 18, G = 4, W2 = 640, H2 = 262, TOP = 46, ROD_GAP = 9, FRAME_GAP = 16, MID = 48;
  const svg = s('svg', { viewBox: `0 0 ${W2} ${H2}`, class: 'nl blocks', direction: 'ltr', role: 'img' });
  const g = s('g', {}, svg);
  const label = s('text', { x: W2 / 2, y: 28, class: 'nl-label', 'text-anchor': 'middle' }, svg);
  const frameW = 5 * (S + G) - G;
  const caption = (x, txt) =>
    (s('text', { x, y: TOP + 10 * S + 26, class: 'tick-label cap', 'text-anchor': 'middle', direction: 'rtl' }, g).textContent = txt);

  function draw(st, prev) {
    const anim = !!prev && !reduceMotion();
    const tens = st.tens || 0, ones = st.ones || 0, crossed = Math.min(st.crossed || 0, ones);
    const crossedT = Math.min(st.crossedTens || 0, tens), pct = anim ? prev.crossedTens || 0 : crossedT;
    const pt = anim ? prev.tens || 0 : tens, po = anim ? prev.ones || 0 : ones, pc = anim ? prev.crossed || 0 : crossed;
    g.replaceChildren();
    const frames = Math.ceil(ones / 10);
    const tensW = tens ? tens * (S + ROD_GAP) - ROD_GAP : 0;
    const onesW = frames ? frames * (frameW + FRAME_GAP) - FRAME_GAP : 0;
    const x0 = (W2 - (tensW + (tens && ones ? MID : 0) + onesW)) / 2;
    let delay = 0;

    for (let i = 0; i < tens; i++) {
      const x = x0 + i * (S + ROD_GAP);
      const rod = s('g', {}, g);
      s('rect', { x, y: TOP, width: S, height: 10 * S, rx: 2, class: 'rod' }, rod);
      for (let k = 1; k < 10; k++) s('line', { x1: x, x2: x + S, y1: TOP + k * S, y2: TOP + k * S, class: 'rod-line' }, rod);
      if (i >= tens - crossedT) {
        rod.classList.add('gone');
        s('path', { d: `M${x - 4},${TOP} L${x + S + 4},${TOP + 10 * S} M${x + S + 4},${TOP} L${x - 4},${TOP + 10 * S}`, class: 'cross' }, g);
        if (anim && i < tens - pct) rod.animate([{ opacity: 1 }, { opacity: 0.25 }], { duration: 300, delay, fill: 'backwards' });
      }
      if (anim && i >= pt) {
        rod.animate([{ opacity: 0, transform: 'translateY(-24px)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay, fill: 'backwards' });
        delay += 140;
      }
    }
    if (tens) caption(x0 + tensW / 2, tens === 1 ? 'עשרת אחת' : `${tens} עשרות`);

    const ox = x0 + tensW + (tens && ones ? MID : 0);
    const bottom = TOP + 10 * S;
    for (let i = 0; i < ones; i++) {
      const f = Math.floor(i / 10), r = Math.floor((i % 10) / 5), c = i % 5;
      const x = ox + f * (frameW + FRAME_GAP) + c * (S + G);
      const y = bottom - (2 - r) * (S + G) + G;
      const isX = i >= ones - crossed;
      const sq = s('rect', { x, y, width: S, height: S, rx: 2, class: isX ? 'one gone' : 'one' }, g);
      if (isX) s('path', { d: `M${x - 2},${y - 2} L${x + S + 2},${y + S + 2} M${x + S + 2},${y - 2} L${x - 2},${y + S + 2}`, class: 'cross' }, g);
      if (anim && i >= po) {
        sq.animate([{ opacity: 0, transform: 'translateY(-16px)' }, { opacity: 1, transform: 'none' }], { duration: 300, delay, fill: 'backwards' });
        delay += 70;
      } else if (anim && isX && i < ones - pc) {
        sq.animate([{ opacity: 1 }, { opacity: 0.25 }], { duration: 300, delay, fill: 'backwards' });
        delay += 90;
      }
    }
    if (ones) caption(ox + onesW / 2, ones === 1 ? 'יחידה אחת' : `${ones} יחידות`);

    label.textContent = st.label || '';
    if (anim && st.label && st.label !== prev.label) {
      label.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay, fill: 'backwards' });
    }
  }
  return { svg, draw };
}

// ---------- shapes ----------
// Polygons as vertex lists around (0,0), roughly 110px across.
const reg = (k, r = 52, rot = -90) =>
  Array.from({ length: k }, (_, i) => {
    const a = ((rot + (360 / k) * i) * Math.PI) / 180;
    return [r * Math.cos(a), r * Math.sin(a)];
  });
export const SHAPES = {
  triangle: { name: 'משולש', pts: [[0, -50], [56, 44], [-56, 44]] },
  'triangle-odd': { name: 'משולש', pts: [[-62, 40], [62, 40], [-30, -34]] },
  square: { name: 'ריבוע', pts: [[-44, -44], [44, -44], [44, 44], [-44, 44]] },
  'square-tilted': { name: 'ריבוע', pts: reg(4, 58, -90) },
  rectangle: { name: 'מלבן', pts: [[-62, -34], [62, -34], [62, 34], [-62, 34]] },
  pentagon: { name: 'מחומש', pts: reg(5) },
  hexagon: { name: 'משושה', pts: reg(6, 52, 0) },
  circle: { name: 'עיגול', circle: 50 },
};

// Draws one shape into `parent` at (cx, cy). show: 'corners' | 'sides'.
function drawShape(parent, key, cx, cy, sc, show, animateMarks) {
  const sh = SHAPES[key];
  if (!sh) return;
  const g = s('g', {}, parent);
  if (sh.circle) {
    s('circle', { cx, cy, r: sh.circle * sc, class: 'shape' }, g);
    return g;
  }
  const P = sh.pts.map(([x, y]) => [cx + x * sc, cy + y * sc]);
  s('polygon', { points: P.map((p) => p.join(',')).join(' '), class: 'shape' }, g);
  const mark = (el, k) => {
    if (animateMarks) el.animate([{ opacity: 0, transform: 'scale(0.3)' }, { opacity: 1, transform: 'none' }], { duration: 300, delay: 250 + k * 380, fill: 'backwards' });
  };
  const out = (x, y, d) => { // push a point outward from the shape's center
    const dx = x - cx, dy = y - cy, L = Math.hypot(dx, dy) || 1;
    return [x + (dx / L) * d, y + (dy / L) * d];
  };
  if (show === 'corners') {
    P.forEach(([x, y], k) => {
      const m = s('g', { class: 'mark' }, g);
      s('circle', { cx: x, cy: y, r: 6, class: 'corner' }, m);
      const [tx, ty] = out(x, y, 17);
      s('text', { x: tx, y: ty + 5, 'text-anchor': 'middle', class: 'mark-n' }, m).textContent = k + 1;
      mark(m, k);
    });
  } else if (show === 'sides') {
    P.forEach(([x, y], k) => {
      const [x2, y2] = P[(k + 1) % P.length];
      const m = s('g', { class: 'mark' }, g);
      s('line', { x1: x, y1: y, x2, y2, class: 'side' }, m);
      const [tx, ty] = out((x + x2) / 2, (y + y2) / 2, 16);
      s('text', { x: tx, y: ty + 5, 'text-anchor': 'middle', class: 'mark-n side-n' }, m).textContent = k + 1;
      mark(m, k);
    });
  }
  return g;
}

// A standalone figure of one shape (used by exercise generators).
export function shapeSvg(key) {
  const svg = s('svg', { viewBox: '0 0 160 150', class: 'fig shape-fig', role: 'img' });
  drawShape(svg, key, 80, 75, 1, null, false);
  return svg.outerHTML;
}

// Scene: a row of shapes. Step keys: shapes (list), show (corners|sides),
// names (true to write each shape's name under it), label.
export function shapes(spec) {
  const W3 = 640, H3 = 215;
  const svg = s('svg', { viewBox: `0 0 ${W3} ${H3}`, class: 'nl shapes', role: 'img' });
  const g = s('g', {}, svg);
  const label = s('text', { x: W3 / 2, y: 28, class: 'nl-label', 'text-anchor': 'middle' }, svg);
  function draw(st, prev) {
    const anim = !!prev && !reduceMotion();
    g.replaceChildren();
    const list = st.shapes || [];
    const slot = W3 / Math.max(1, list.length);
    const sc = Math.min(1, slot / 150);
    const had = new Set(prev?.shapes || []);
    list.forEach((key, i) => {
      const cx = slot * (i + 0.5), cy = 112;
      const isNew = anim && !had.has(key);
      const marksNew = anim && (isNew || prev.show !== st.show);
      const shapeG = drawShape(g, key, cx, cy, sc, st.show, marksNew);
      if (isNew && shapeG) shapeG.animate([{ opacity: 0, transform: 'translateY(-14px)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: i * 120, fill: 'backwards' });
      if (st.names && SHAPES[key]) {
        s('text', { x: cx, y: H3 - 12, 'text-anchor': 'middle', class: 'tick-label cap shape-name', direction: 'rtl' }, g).textContent = SHAPES[key].name;
      }
    });
    label.textContent = st.label || '';
  }
  return { svg, draw };
}

// ---------- measure: compare lengths, count units ----------
// Step keys: bars: [{ name, len, offset?, emoji? }], units (true = show unit
// marks and the count), label. Scene option: max (longest length, default 12).
export function measure(spec) {
  const W4 = 640, NAME_W = 120, X0 = 24, ROW = 52, TOP = 50;
  const max = spec.max || 12;
  const u = (W4 - NAME_W - X0 - 30) / max;
  const svg = s('svg', { viewBox: `0 0 ${W4} 200`, class: 'nl measure', role: 'img' });
  const g = s('g', {}, svg);
  const label = s('text', { x: W4 / 2, y: 28, class: 'nl-label', 'text-anchor': 'middle' }, svg);
  function draw(st, prev) {
    const anim = !!prev && !reduceMotion();
    g.replaceChildren();
    const bars = st.bars || [];
    const H = TOP + bars.length * ROW + 10;
    svg.setAttribute('viewBox', `0 0 ${W4} ${Math.max(H, 120)}`);
    bars.forEach((b, i) => {
      const y = TOP + i * ROW;
      const x = X0 + (b.offset || 0) * u;
      const w = b.len * u;
      const old = prev?.bars?.find((p) => p.name === b.name);
      const row = s('g', {}, g);
      const rect = s('rect', { x, y, width: w, height: 26, rx: 6, class: `bar bar-${i % 4}` }, row);
      if (anim && (!old || old.len !== b.len || (old.offset || 0) !== (b.offset || 0))) {
        rect.animate([{ width: `${old ? old.len * u : 0}px` }, { width: `${w}px` }], { duration: 600, easing: 'ease-out', fill: 'backwards' });
      }
      s('text', { x: W4 - 8, y: y + 19, class: 'tick-label cap bar-name', direction: 'rtl', 'text-anchor': 'start' }, row).textContent =
        `${b.emoji || ''} ${b.name}`.trim();
      if (st.units) {
        for (let k = 1; k <= b.len; k++) {
          const tick = s('line', { x1: x + k * u, x2: x + k * u, y1: y + 3, y2: y + 23, class: 'unit-tick' }, row);
          if (anim && !prev.units) tick.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, delay: 200 + k * 110, fill: 'backwards' });
        }
        s('text', { x: x + w + 8, y: y + 19, class: 'unit-n' }, row).textContent = b.len;
      }
    });
    label.textContent = st.label || '';
  }
  return { svg, draw };
}

// ---------- balance scale ----------
// Step keys: left, right (emoji strings), tilt: left | right | even, label.
export function balance() {
  const W5 = 640, H5 = 230, CX = 320, CY = 110, L = 170, DROP = 46;
  const svg = s('svg', { viewBox: `0 0 ${W5} ${H5}`, class: 'nl balance', role: 'img' });
  const label = s('text', { x: W5 / 2, y: 28, class: 'nl-label', 'text-anchor': 'middle' }, svg);
  s('path', { d: `M${CX - 40},${H5 - 14} L${CX + 40},${H5 - 14} L${CX},${CY} Z`, class: 'stand' }, svg);
  const beam = s('line', { class: 'beam' }, svg);
  const side = () => {
    const str1 = s('line', { class: 'string' }, svg), str2 = s('line', { class: 'string' }, svg);
    const pan = s('path', { class: 'pan' }, svg);
    const items = s('text', { 'text-anchor': 'middle', class: 'items' }, svg);
    return { str1, str2, pan, items };
  };
  const sides = [side(), side()];
  let angle = 0, raf = 0;
  const ANG = { left: -12, right: 12, even: 0 };
  function place(a) {
    const r = (a * Math.PI) / 180;
    const ends = [[CX - L * Math.cos(r), CY - L * Math.sin(r)], [CX + L * Math.cos(r), CY + L * Math.sin(r)]];
    beam.setAttribute('x1', ends[0][0]); beam.setAttribute('y1', ends[0][1]);
    beam.setAttribute('x2', ends[1][0]); beam.setAttribute('y2', ends[1][1]);
    ends.forEach(([x, y], i) => {
      const sd = sides[i], py = y + DROP;
      sd.str1.setAttribute('x1', x); sd.str1.setAttribute('y1', y); sd.str1.setAttribute('x2', x - 50); sd.str1.setAttribute('y2', py);
      sd.str2.setAttribute('x1', x); sd.str2.setAttribute('y1', y); sd.str2.setAttribute('x2', x + 50); sd.str2.setAttribute('y2', py);
      sd.pan.setAttribute('d', `M${x - 62},${py} Q${x},${py + 22} ${x + 62},${py} Z`);
      sd.items.setAttribute('x', x); sd.items.setAttribute('y', py - 6);
    });
  }
  function draw(st, prev) {
    // SVG coordinates are left-to-right, so "left" here is the left of the picture.
    sides[0].items.textContent = st.left || '';
    sides[1].items.textContent = st.right || '';
    label.textContent = st.label || '';
    const target = ANG[st.tilt] ?? 0;
    cancelAnimationFrame(raf);
    if (!prev || reduceMotion()) { angle = target; place(angle); return; }
    const from = ANG[prev.tilt] ?? 0, t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 700), e = 1 - Math.pow(1 - k, 3);
      angle = from + (target - from) * e;
      place(angle);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    place(from);
    raf = requestAnimationFrame(step);
  }
  return { svg, draw };
}

// ---------- circle: geometry inside a circle ----------
// Scene option `points`: { A: 210, B: 330, C: 90 } — where each point sits on
// the circle, in degrees (0 = right, 90 = top). O is always the center.
// Step keys (all optional):
//   at: { C: 150 }         move points; they slide along the circle. Persists.
//   lines: [AB, BC, CA]    segments to draw (scene option `lines` = always drawn)
//   hot: [OA]              segments to emphasize
//   marks: [OA, OC]        equal-length tick marks
//   fill: [OAC]            shade a triangle
//   arc: [AB]              emphasize the shorter arc between two points
//   angles: [ACB, { a: AOB, label: 2x, hot: true }]  angle at the middle letter;
//            label "auto" (default) = the measured value, "?" for unknown,
//            text with {} puts the value in, e.g. "x = {}°". Right angles get a square.
//   sides: { AC: 6 }       length labels next to segments
//   bisect: [AB]           perpendicular bisector of a segment
//   center: false          hide the center point O (scene option or per step)
//   label: text at the top
const CW = 400, CCX = 200, CCY = 212, CR = 148;
export function circle(spec) {
  const svg = s('svg', { viewBox: `0 0 ${CW} 400`, class: 'nl circle', direction: 'ltr', role: 'img' });
  s('circle', { cx: CCX, cy: CCY, r: CR, class: 'rim' }, svg);
  const g = s('g', {}, svg);
  const label = s('text', { x: CW / 2, y: 26, class: 'nl-label', 'text-anchor': 'middle' }, svg);
  let raf = 0;
  const base = { ...(spec.points || {}) };
  const posOf = (deg) => [CCX + CR * Math.cos((deg * Math.PI) / 180), CCY - CR * Math.sin((deg * Math.PI) / 180)];

  function paint(st, at) {
    g.replaceChildren();
    const P = { O: [CCX, CCY] };
    for (const [k, d] of Object.entries(at)) P[k] = posOf(d);
    const seg = (n) => [P[n[0]], P[n[1]]];
    const ok = (n) => [...n].every((ch) => P[ch]);
    for (const t of list(st.fill).filter(ok)) {
      s('polygon', { points: [...t].map((k) => P[k].join(',')).join(' '), class: 'cfill' }, g);
    }
    for (const a of list(st.arc).filter(ok)) {
      const [p, q] = seg(a);
      const t1 = Math.atan2(CCY - p[1], p[0] - CCX), t2 = Math.atan2(CCY - q[1], q[0] - CCX);
      let d = t2 - t1;
      while (d <= -Math.PI) d += 2 * Math.PI;
      while (d > Math.PI) d -= 2 * Math.PI;
      s('path', { d: `M${p[0]},${p[1]} A${CR},${CR} 0 0 ${d > 0 ? 0 : 1} ${q[0]},${q[1]}`, class: 'carc' }, g);
    }
    for (const b of list(st.bisect).filter(ok)) {
      const [p, q] = seg(b);
      const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy);
      const nx = -dy / L, ny = dx / L, k = CR * 1.35;
      s('line', { x1: mx - nx * k, y1: my - ny * k, x2: mx + nx * k, y2: my + ny * k, class: 'cbis' }, g);
      s('circle', { cx: mx, cy: my, r: 3.5, class: 'cmid' }, g);
    }
    const hot = new Set(list(st.hot).flatMap((n) => [n, [...n].reverse().join('')]));
    const lines = [...list(spec.lines), ...list(st.lines), ...list(st.hot)];
    for (const n of new Set(lines)) {
      if (!ok(n)) continue;
      const [p, q] = seg(n);
      s('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], class: hot.has(n) ? 'cseg hot' : 'cseg' }, g);
    }
    // Equal segments: one tick each (`marks`), or two ticks for a second group (`marks2`).
    list(st.marks).filter(ok).forEach((n) => {
      const [p, q] = seg(n);
      const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy);
      const nx = (-dy / L) * 8, ny = (dx / L) * 8;
      s('line', { x1: mx - nx, y1: my - ny, x2: mx + nx, y2: my + ny, class: 'cmark' }, g);
    });
    list(st.marks2).filter(ok).forEach((n) => {
      const [p, q] = seg(n);
      const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy);
      const ux = dx / L, uy = dy / L, nx = -uy * 8, ny = ux * 8;
      for (const o of [-4, 4]) s('line', { x1: mx - nx + ux * o, y1: my - ny + uy * o, x2: mx + nx + ux * o, y2: my + ny + uy * o, class: 'cmark' }, g);
    });
    // Side labels sit beside the segment, on the side away from the figure.
    const rimPts = Object.keys(at).map((k) => P[k]);
    const gx = rimPts.reduce((t, q) => t + q[0], 0) / (rimPts.length || 1), gy = rimPts.reduce((t, q) => t + q[1], 0) / (rimPts.length || 1);
    for (const [n, txt] of Object.entries(st.sides || {})) {
      if (!ok(n)) continue;
      const [p, q] = seg(n);
      const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, L = Math.hypot(q[0] - p[0], q[1] - p[1]);
      let nx = -(q[1] - p[1]) / L, ny = (q[0] - p[0]) / L;
      if (nx * (mx - gx) + ny * (my - gy) < 0) { nx = -nx; ny = -ny; }
      s('text', { x: mx + nx * 18, y: my + ny * 18 + 6, class: 'cside', 'text-anchor': 'middle' }, g).textContent = txt;
    }
    for (const raw of list(st.angles)) {
      const a = typeof raw === 'string' ? { a: raw } : raw;
      if (!ok(a.a)) continue;
      const [p, v, q] = [P[a.a[0]], P[a.a[1]], P[a.a[2]]];
      const t1 = Math.atan2(p[1] - v[1], p[0] - v[0]), t2 = Math.atan2(q[1] - v[1], q[0] - v[0]);
      let d = t2 - t1;
      while (d <= -Math.PI) d += 2 * Math.PI;
      while (d > Math.PI) d -= 2 * Math.PI;
      const deg = Math.abs(d) * 180 / Math.PI, val = Math.round(deg);
      const r = a.r || (deg < 30 ? 40 : 28), cls = 'cang' + (a.hot ? ' hot' : '');
      if (Math.abs(deg - 90) < 0.6 && a.square !== false) {
        const u1 = [Math.cos(t1) * 16, Math.sin(t1) * 16], u2 = [Math.cos(t2) * 16, Math.sin(t2) * 16];
        s('path', { d: `M${v[0] + u1[0]},${v[1] + u1[1]} l${u2[0]},${u2[1]} l${-u1[0]},${-u1[1]}`, class: cls + ' sq' }, g);
      } else {
        const e1 = [v[0] + r * Math.cos(t1), v[1] + r * Math.sin(t1)], e2 = [v[0] + r * Math.cos(t2), v[1] + r * Math.sin(t2)];
        s('path', { d: `M${v[0]},${v[1]} L${e1[0]},${e1[1]} A${r},${r} 0 0 ${d > 0 ? 1 : 0} ${e2[0]},${e2[1]} Z`, class: cls }, g);
      }
      const lab = a.label == null || a.label === 'auto' ? `${val}°` : String(a.label).replace('{}', val);
      if (lab) {
        const mid = t1 + d / 2, lr = r + (lab.length > 3 ? 22 : 15);
        s('text', { x: v[0] + lr * Math.cos(mid), y: v[1] + lr * Math.sin(mid) + 5, class: 'cang-l' + (a.hot ? ' hot' : '') + (lab.includes('?') ? ' q' : ''), 'text-anchor': 'middle' }, g).textContent = lab;
      }
    }
    // Points and their names, pushed outward from the center.
    const used = new Set([...Object.keys(at)]);
    if ((st.center ?? spec.center) !== false) used.add('O');
    for (const k of used) {
      const [x, y] = P[k];
      s('circle', { cx: x, cy: y, r: 4.5, class: 'cpt' }, g);
      let dx = x - CCX, dy = y - CCY, L = Math.hypot(dx, dy);
      if (k === 'O') {
        // Put "O" opposite the segments that leave the center, so it never
        // covers an angle at O.
        dx = 0; dy = 0;
        for (const n of new Set(lines)) {
          const other = n[0] === 'O' ? n[1] : n[1] === 'O' ? n[0] : null;
          if (other && P[other]) { const v = [P[other][0] - CCX, P[other][1] - CCY], l = Math.hypot(...v); dx -= v[0] / l; dy -= v[1] / l; }
        }
        if (Math.hypot(dx, dy) < 0.3) { dx = 0.7; dy = -1; }
        L = Math.hypot(dx, dy);
      }
      s('text', { x: x + (dx / L) * 20, y: y + (dy / L) * 20 + 6, class: 'cpt-l', 'text-anchor': 'middle' }, g).textContent = k;
    }
    label.textContent = st.label || '';
  }

  // Points persist from step to step; frames (no prev) need the full history,
  // so resolveSteps hands every step its own `at`.
  function draw(st, prev) {
    cancelAnimationFrame(raf);
    const to = { ...base, ...(st._at || st.at || {}) };
    const from = prev ? { ...base, ...(prev._at || prev.at || {}) } : to;
    const moving = Object.keys(to).some((k) => from[k] !== to[k]);
    if (!prev || !moving || reduceMotion()) return paint(st, to);
    const t0 = performance.now(), dur = 1400;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const at = {};
      for (const key of Object.keys(to)) at[key] = (from[key] ?? to[key]) + (to[key] - (from[key] ?? to[key])) * e;
      paint(st, at);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }
  return { svg, draw };
}

const KNOWN = { 'number-line': numberLine, blocks, shapes, measure, balance, circle };

// For other views (feed): a fresh scene instance, or null for unknown types.
export const makeScene = (spec) => (KNOWN[spec?.type] ? KNOWN[spec.type](spec) : null);
const unknown = (spec) => h('div', 'notice', `סוג סצנה לא מוכר: ${esc(spec?.type)}`);

// Interactive version for the lesson page.
export function sceneWidget(spec) {
  if (!KNOWN[spec?.type]) return unknown(spec);
  const states = resolveSteps(spec);
  const fig = h('figure', 'scene');
  const nl = KNOWN[spec.type](spec);
  const cap = h('figcaption', 'scene-cap');
  const bar = h('div', 'scene-bar');
  const prevB = h('button', 'btn ghost', '→ הקודם');
  const cnt = h('span', 'scene-count');
  const nextB = h('button', 'btn', 'הבא ←');
  bar.append(prevB, cnt, nextB);
  fig.append(nl.svg, cap, bar);

  let i = 0;
  function go(n, animate) {
    const prev = states[i];
    i = n;
    nl.draw(states[i], animate ? prev : null);
    cap.innerHTML = fmt(states[i].text);
    cnt.textContent = `${i + 1} / ${states.length}`;
    prevB.disabled = i === 0;
    nextB.textContent = i === states.length - 1 ? '↺ מההתחלה' : 'הבא ←';
  }
  nextB.onclick = () => (i === states.length - 1 ? go(0, false) : go(i + 1, true));
  prevB.onclick = () => go(i - 1, false);
  nl.svg.addEventListener('click', () => i < states.length - 1 && go(i + 1, true));
  go(0, false);
  return fig;
}

// Still version: every step as its own picture, numbered. Used for print and
// the "static view" — the explanation still works with nothing moving.
export function sceneFrames(spec) {
  if (!KNOWN[spec?.type]) return unknown(spec);
  const wrap = h('div', 'frames');
  resolveSteps(spec).forEach((st, k) => {
    const f = h('figure', 'frame');
    const nl = KNOWN[spec.type](spec);
    nl.draw(st, null);
    f.append(nl.svg, h('figcaption', '', `<b>${k + 1}.</b> ${fmt(st.text)}`));
    wrap.append(f);
  });
  return wrap;
}

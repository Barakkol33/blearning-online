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
  let marker = null;
  return (spec.steps || []).map((st) => {
    if ('marker' in st) marker = st.marker;
    return { ...st, marker };
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
  const every = b - a > 24 ? 5 : 1;
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
  const segments = (f, t) => {
    const dir = Math.sign(t - f), n = Math.abs(t - f);
    const unit = Number.isInteger(n) && n > 0 && n <= 12;
    return { unit, segs: unit ? Array.from({ length: n }, (_, k) => [f + dir * k, f + dir * (k + 1)]) : [[f, t]] };
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

const KNOWN = { 'number-line': numberLine };
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

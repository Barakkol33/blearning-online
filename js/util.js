export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Tiny inline format for short texts (captions, questions): `math` and **bold**.
// <code> is styled LTR + isolated, so "-3" never turns into "3-" inside Hebrew.
export const fmt = (s) =>
  esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

const HEB = /[֐-׿]/;
// An answer option with no Hebrew in it (e.g. "-5") is shown left-to-right.
export const fmtOpt = (s) => (HEB.test(s) ? fmt(s) : `<bdi dir="ltr">${fmt(s)}</bdi>`);

export function h(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Shared SVG helper for scene modules.
const NS = 'http://www.w3.org/2000/svg';

export function s(tag, attrs = {}, parent) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  parent?.append(e);
  return e;
}

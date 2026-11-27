// Shared helpers for exercise generators (one module per topic in js/gen/).
export const int = (r, lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
export const p = (n) => (n < 0 ? `(${n})` : `${n}`); // wrap negatives: 3 + (-5)
export const pick = (r, arr) => arr[Math.floor(r() * arr.length)];

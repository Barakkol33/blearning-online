// Exercise generators: each makes one random exercise from a seeded random
// source, so the same seed gives the same page (a teacher can share a link).
// An exercise: { q, answer, options?, unit?, figure?, hint?, solution? }
//   answer: a number (typed in), or an index into options (multiple choice).
// Generators are picked from a course's exercises.json:
//   { "generate": { "type": "add", "max": 20, "count": 10 } }

import { SHAPES, shapeSvg, measure } from './scene.js';

const measureFig = (bars, max = 12, units = true) => {
  const m = measure({ max });
  m.draw({ bars, units }, null);
  m.svg.classList.add('fig', 'fig-wide');
  return m.svg.outerHTML;
};
const THINGS = [
  ['עיפרון', '✏️'], ['מחק', '🧽'], ['מברשת', '🖌️'], ['סרגל', '📏'], ['מזלג', '🍴'], ['מפתח', '🔑'], ['גזר', '🥕'], ['נחש', '🐍'],
];

// mulberry32: tiny seeded random number generator.
export function rng(seed) {
  let a = seed >>> 0 || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const int = (r, lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
const p = (n) => (n < 0 ? `(${n})` : `${n}`); // wrap negatives: 3 + (-5)
const SIGNS = ['>', '<', '='];

export const GENERATORS = {
  add(r, { min = 0, max = 20 }) {
    const a = int(r, min, max - min);
    const b = int(r, min, Math.max(min, max - a));
    const big = Math.max(a, b), small = Math.min(a, b);
    const crossTen = a < 10 && b < 10 && a + b > 10;
    return {
      q: `כמה זה \`${a} + ${b}\`?`,
      answer: a + b,
      hint: crossTen ? `השלימו קודם את ${big} לעשר: חסרים ${10 - big}.` : `התחילו ב־${big} וספרו עוד ${small} קדימה.`,
      solution: crossTen
        ? `\`${big} + ${10 - big} = 10\`, ועוד \`${small - (10 - big)}\` זה ${a + b}.`
        : `\`${a} + ${b} = ${a + b}\``,
    };
  },

  sub(r, { min = 0, max = 20 }) {
    const a = int(r, min, max);
    const b = int(r, min, a);
    return {
      q: `כמה זה \`${a} - ${b}\`?`,
      answer: a - b,
      hint: `התחילו ב־${a} וקפצו ${b} קפיצות שמאלה.`,
      solution: `\`${a} - ${b} = ${a - b}\`. בדיקה: \`${a - b} + ${b} = ${a}\`.`,
    };
  },

  compare(r, { min = 0, max = 20 }) {
    const a = int(r, min, max);
    const b = r() < 0.15 ? a : int(r, min, max);
    const ans = a > b ? 0 : a < b ? 1 : 2;
    return {
      q: `איזה סימן מתאים? \`${a} ☐ ${b}\``,
      options: SIGNS,
      fixed: true,
      answer: ans,
      hint: 'המספר שנמצא ימינה יותר על ציר המספרים הוא הגדול. הפה של הסימן פתוח אל הגדול.',
      solution: `\`${a} ${SIGNS[ans]} ${b}\``,
    };
  },

  'place-value'(r, { min = 10, max = 99 }) {
    const n = int(r, min, max), t = Math.floor(n / 10), o = n % 10;
    return r() < 0.5
      ? { q: `כמה עשרות יש במספר ${n}?`, answer: t, hint: 'הספרה השמאלית סופרת עשרות.', solution: `ב־${n} יש ${t} עשרות ו־${o} יחידות.` }
      : { q: `במספר יש ${t} עשרות ו־${o} יחידות. איזה מספר זה?`, answer: n, hint: `${t} עשרות הן ${t * 10}.`, solution: `\`${t * 10} + ${o} = ${n}\`` };
  },

  'plus-minus-10'(r, { min = 11, max = 89 }) {
    const n = int(r, min, max), up = r() < 0.5, ans = up ? n + 10 : n - 10;
    return {
      q: `כמה זה \`${n} ${up ? '+' : '-'} 10\`?`,
      answer: ans,
      hint: `כש${up ? 'מוסיפים' : 'מורידים'} 10, רק ספרת העשרות משתנה.`,
      solution: `\`${n} ${up ? '+' : '-'} 10 = ${ans}\``,
    };
  },

  'int-add'(r, { min = -10, max = 10 }) {
    const a = int(r, min, max), b = int(r, min, max);
    return {
      q: `כמה זה \`${a} + ${p(b)}\`?`,
      answer: a + b,
      hint: b < 0 ? `מוסיפים מספר שלילי: זזים ${-b} צעדים שמאלה מ־${a}.` : `זזים ${b} צעדים ימינה מ־${a}.`,
      solution: `\`${a} + ${p(b)} = ${a + b}\``,
    };
  },

  'int-sub'(r, { min = -10, max = 10 }) {
    const a = int(r, min, max), b = int(r, min, max);
    return {
      q: `כמה זה \`${a} - ${p(b)}\`?`,
      answer: a - b,
      hint: b < 0 ? `חיסור של מספר שלילי הוא כמו חיבור של הנגדי שלו, ${-b}.` : `זזים ${b} צעדים שמאלה מ־${a}.`,
      solution: b < 0 ? `\`${a} - ${p(b)} = ${a} + ${-b} = ${a - b}\`` : `\`${a} - ${b} = ${a - b}\``,
    };
  },

  // Number pattern: what comes next, or what is missing in the middle.
  // { steps: [2, 5, 10], down: true, missing: true, max: 100 }
  sequence(r, { steps = [1, 2, 5, 10], down = false, missing = false, max = 100 }) {
    const step = steps[int(r, 0, steps.length - 1)];
    const goDown = down && r() < 0.5;
    const len = 5;
    const start = goDown ? int(r, step * len, max) : int(r, 0, Math.max(0, max - step * len));
    const seq = Array.from({ length: len }, (_, k) => start + (goDown ? -1 : 1) * step * k);
    const rule = `${goDown ? 'קטן' : 'גדל'} ב־${step}`;
    if (missing) {
      const hole = int(r, 1, len - 2);
      const shown = seq.map((v, k) => (k === hole ? '☐' : v)).join(', ');
      return {
        q: `איזה מספר חסר? \`${shown}\``,
        answer: seq[hole],
        hint: 'בדקו בכמה משתנה כל מספר לעומת המספר שלפניו.',
        solution: `כל מספר ${rule}, ולכן החסר הוא ${seq[hole]}.`,
      };
    }
    const next = start + (goDown ? -1 : 1) * step * len;
    return {
      q: `מה המספר הבא? \`${seq.join(', ')}, ☐\``,
      answer: next,
      hint: 'בדקו בכמה משתנה כל מספר לעומת המספר שלפניו.',
      solution: `כל מספר ${rule}: \`${seq[len - 1]} ${goDown ? '-' : '+'} ${step} = ${next}\`.`,
    };
  },

  // Shapes: count corners or sides, or name the shape. { ask: 'count' | 'name' }
  shape(r, { ask = 'count', include = ['triangle', 'triangle-odd', 'square', 'square-tilted', 'rectangle', 'pentagon', 'hexagon', 'circle'] }) {
    const key = include[int(r, 0, include.length - 1)];
    const sh = SHAPES[key];
    const k = sh.circle ? 0 : sh.pts.length;
    if (ask === 'name') {
      const names = ['משולש', 'ריבוע', 'מלבן', 'עיגול', 'מחומש', 'משושה'];
      const others = names.filter((x) => x !== sh.name);
      const opts = [sh.name, others[int(r, 0, others.length - 1)]];
      const third = others.filter((x) => x !== opts[1]);
      opts.push(third[int(r, 0, third.length - 1)]);
      return {
        q: 'איך קוראים לצורה הזו?',
        figure: shapeSvg(key),
        options: opts,
        answer: 0,
        hint: sh.circle ? 'לצורה הזו אין פינות בכלל.' : 'ספרו את הפינות של הצורה.',
        solution: `זה ${sh.name}${sh.circle ? ': צורה עגולה בלי פינות ובלי צלעות ישרות.' : `: יש לו ${k} פינות ו־${k} צלעות.`}`,
      };
    }
    const what = r() < 0.5 ? 'פינות' : 'צלעות';
    return {
      q: `כמה ${what} יש לצורה?`,
      figure: shapeSvg(key),
      answer: k,
      hint: sh.circle ? 'האם יש לעיגול פינה כלשהי?' : `סמנו באצבע כל ${what === 'פינות' ? 'פינה' : 'צלע'} שספרתם, כדי לא לספור פעמיים.`,
      solution: sh.circle ? 'לעיגול אין פינות ואין צלעות ישרות: 0.' : `ל${sh.name} יש ${k} ${what}. בכל מצולע מספר הפינות שווה למספר הצלעות.`,
    };
  },

  // Lengths measured in units (paper clips). { ask: 'length' | 'longer' | 'difference' }
  length(r, { ask = 'length', max = 12 }) {
    const pick = [...THINGS].sort(() => r() - 0.5).slice(0, 2);
    let a = int(r, 2, max), b = int(r, 2, max);
    if (ask !== 'length') while (a === b) b = int(r, 2, max);
    const A = { name: pick[0][0], emoji: pick[0][1], len: a };
    const B = { name: pick[1][0], emoji: pick[1][1], len: b };
    if (ask === 'length') {
      return {
        q: `כמה אטבים אורכו של ה${A.name}?`,
        figure: measureFig([A], max),
        answer: a,
        hint: 'ספרו את היחידות לאורך הפס, מההתחלה ועד הסוף.',
        solution: `ה${A.name} ארוך ${a} אטבים.`,
      };
    }
    if (ask === 'longer') {
      return {
        q: 'מה ארוך יותר?',
        figure: measureFig([A, B], max, false),
        options: [A.name, B.name],
        fixed: true,
        answer: a > b ? 0 : 1,
        hint: 'שני הפסים מתחילים באותו מקום. איזה מגיע רחוק יותר?',
        solution: `ה${a > b ? A.name : B.name} ארוך יותר: ${Math.max(a, b)} אטבים לעומת ${Math.min(a, b)}.`,
      };
    }
    const [L, S] = a > b ? [A, B] : [B, A];
    return {
      q: `בכמה אטבים ה${L.name} ארוך יותר מה${S.name}?`,
      figure: measureFig([A, B], max),
      answer: L.len - S.len,
      hint: `מצאו את האורך של כל אחד, ואז חסרו: ${L.len} פחות ${S.len}.`,
      solution: `\`${L.len} - ${S.len} = ${L.len - S.len}\``,
    };
  },

  // Geometry demo: the figure is drawn FROM the numbers, so it always matches.
  'triangle-angle'(r) {
    let A, B;
    do { A = int(r, 25, 95); B = int(r, 25, 95); } while (A + B > 150);
    const C = 180 - A - B;
    return {
      q: 'בציור יש משולש. כמה מעלות יש בזווית המסומנת ב־?',
      figure: triangleSvg(A, B),
      answer: C,
      unit: '°',
      hint: 'סכום הזוויות בכל משולש הוא 180°.',
      solution: `\`180 - ${A} - ${B} = ${C}\`, ולכן הזווית היא ${C}°.`,
    };
  },
};

function triangleSvg(A, B) {
  const rad = (d) => (d * Math.PI) / 180;
  const C = 180 - A - B;
  const ac = Math.sin(rad(B)) / Math.sin(rad(C)); // law of sines, base AB = 1
  const pts = [[0, 0], [1, 0], [ac * Math.cos(rad(A)), ac * Math.sin(rad(A))]];
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  const minx = Math.min(...xs), maxx = Math.max(...xs), maxy = Math.max(...ys);
  const sc = Math.min(250 / (maxx - minx), 140 / maxy);
  const P = pts.map(([x, y]) => [25 + (x - minx) * sc, 172 - y * sc]);
  const cx = (P[0][0] + P[1][0] + P[2][0]) / 3, cy = (P[0][1] + P[1][1] + P[2][1]) / 3;
  const labels = [`${A}°`, `${B}°`, '?'].map((t, i) => {
    const [x, y] = P[i], dx = cx - x, dy = cy - y, L = Math.hypot(dx, dy), k = Math.min(30, L * 0.45);
    return `<text x="${(x + (dx / L) * k).toFixed(1)}" y="${(y + (dy / L) * k + 5).toFixed(1)}" text-anchor="middle" class="ang${t === '?' ? ' q' : ''}">${t}</text>`;
  });
  return `<svg viewBox="0 0 300 190" class="fig" direction="ltr" role="img"><polygon points="${P.map((q) => q.map((v) => v.toFixed(1)).join(',')).join(' ')}" class="tri"/>${labels.join('')}</svg>`;
}

// Data and functions in context (3 units, grade 10): reading bar, pie and line
// charts, percent of a total and percent change, a linear rule in context, and a
// quadratic "when is the ball at height H?". Every chart is illustrative data,
// and every solution writes each step, as the bagrut requires.
import { chartFig } from '../scenes/chart.js';
import { int, pick } from './util.js';

const pct = (v) => `${v}%`;

// ---- bar charts ----
const BARS = [
  { title: 'הספורט האהוב על תלמידי השכבה', cats: ['כדורגל', 'כדורסל', 'שחייה', 'ריצה'], unit: 'תלמידים' },
  { title: 'עצים שניטעו בכל חודש', cats: ['ינואר', 'פברואר', 'מרץ', 'אפריל'], unit: 'עצים' },
  { title: 'נייר שנאסף למחזור בכל כיתה', cats: ['י׳1', 'י׳2', 'י׳3', 'י׳4'], unit: 'ק״ג' },
  { title: 'מבקרים במוזיאון המדע בכל יום', cats: ['ראשון', 'שני', 'שלישי', 'רביעי'], unit: 'מבקרים' },
];

function barData(r, tick) {
  // Values on the grid or halfway between lines, all different.
  for (;;) {
    const vals = Array.from({ length: 4 }, () => int(r, 2, 11) * (tick / 2));
    if (new Set(vals).size === 4) return vals;
  }
}

// ---- pie charts ----
const PIES = [
  { title: 'זמן מסך ביום', cats: ['רשתות', 'סרטונים', 'משחקים', 'אחר'], unit: 'דקות', of: 'זמן המסך', totals: [200, 300, 400, 500] },
  { title: 'פסולת ביתית לפי סוג', cats: ['אורגני', 'נייר', 'פלסטיק', 'אחר'], unit: 'ק״ג', of: 'הפסולת', totals: [200, 400, 600, 800] },
  { title: 'מים בבית לפי שימוש', cats: ['מקלחת', 'אסלה', 'מטבח', 'כביסה'], unit: 'ליטר', of: 'המים', totals: [300, 400, 500] },
];
// Four percents, multiples of 5, each at least 10, summing to 100.
function pieSplit(r) {
  for (;;) {
    const a = int(r, 2, 9) * 5, b = int(r, 2, 8) * 5, c = int(r, 2, 6) * 5, d = 100 - a - b - c;
    if (d >= 10 && new Set([a, b, c, d]).size === 4) return [a, b, c, d];
  }
}

// ---- line graphs ----
const LINES = [
  { title: 'מכוניות חשמליות חדשות בעיר', unit: 'מכוניות' },
  { title: 'מבקרים בספרייה העירונית', unit: 'מבקרים' },
  { title: 'שתילים שנשתלו בחורשה', unit: 'שתילים' },
];
const CHANGES = [[200, 50], [200, 25], [400, 25], [500, 20], [400, 50], [500, 10], [600, 50], [400, -25], [500, -20], [800, -25], [600, -10]];

// ---- linear rules ----
const RULES = [
  (r) => {
    const a = pick(r, [12, 15, 16, 20, 24]), b = pick(r, [2, 3, 4].filter((x) => a % x === 0));
    return { story: `נר באורך ${a} ס״מ נשרף ${b} ס״מ בכל שעה. האורך שנשאר אחרי \`t\` שעות הוא`, y: 'L', x: 't', a, b: -b, yu: 'ס״מ', xu: 'שעות', xMax: a / b };
  },
  (r) => {
    const b = pick(r, [5, 8, 10, 12, 20]);
    return { story: `סוללה של טלפון מלאה (100%), ובכל שעה של צפייה בסרטונים היא יורדת ב־${b}%. הסוללה אחרי \`t\` שעות היא`, y: 'B', x: 't', a: 100, b: -b, yu: '%', xu: 'שעות', xMax: 100 / b };
  },
  (r) => {
    const a = pick(r, [20, 50, 80, 100]), b = pick(r, [10, 15, 20, 25]);
    return { story: `במכל יש ${a} ליטר מים, ומוסיפים לו ${b} ליטר בכל דקה. כמות המים אחרי \`t\` דקות היא`, y: 'V', x: 't', a, b, yu: 'ליטר', xu: 'דקות', xMax: 12 };
  },
  (r) => {
    const a = pick(r, [18, 24, 30]);
    return { story: `בגובה הים הטמפרטורה ${a}°, ובכל קילומטר של עלייה היא יורדת בערך ב־6°. הטמפרטורה בגובה \`h\` ק״מ היא`, y: 'T', x: 'h', a, b: -6, yu: '°', xu: 'ק״מ', xMax: a / 6, when: 'באיזה גובה' };
  },
];
const ruleText = (c) => `${c.y} = ${c.a} ${c.b < 0 ? '-' : '+'} ${Math.abs(c.b)}${c.x}`;

export const data = {
  // Read a bar chart. ask: value | diff | times (default: any).
  'bar-read'(r, { ask } = {}) {
    const ctx = pick(r, BARS), tick = pick(r, [10, 20]);
    const kind = ask || pick(r, ['value', 'diff', 'times']);
    let vals = barData(r, tick);
    let i = int(r, 0, 3), j = (i + int(r, 1, 3)) % 4;
    if (kind === 'times') {
      const k = int(r, 2, 4), b = int(r, 1, Math.floor(10 / k)) * (tick / 2);
      vals[j] = b; vals[i] = b * k;
    }
    if (kind !== 'value' && vals[i] < vals[j]) [i, j] = [j, i];
    if (vals[i] === vals[j]) vals[i] += tick / 2;
    const spec = { type: 'chart', kind: 'bar', data: ctx.cats.map((c, k) => [c, vals[k]]), tick, name: ctx.unit };
    const [A, Bn] = [ctx.cats[i], ctx.cats[j]];
    const lead = `בדיאגרמה: ${ctx.title}.`;
    const read = `העמודה "${A}" מגיעה ל־${vals[i]}`;
    const step0 = `קודם קנה המידה: כל קו בציר שווה ${tick}.`;
    if (kind === 'value') {
      return {
        q: `${lead} כמה ${ctx.unit} בעמודה "${A}"?`, answer: vals[i], figure: chartFig(spec),
        hint: `כל קו בציר שווה ${tick}. האם העמודה נגמרת על קו, או באמצע בין שני קווים?`,
        solution: `${step0} ${read}${vals[i] % tick ? `, באמצע בין ${vals[i] - tick / 2} ל־${vals[i] + tick / 2}` : ''}. התשובה: ${vals[i]} ${ctx.unit}.`,
        scene: { ...spec, steps: [
          { text: step0, label: `קו = ${tick}` },
          { text: `${read}.`, hot: i, read: i, label: `${A}: ${vals[i]}` },
        ] },
      };
    }
    if (kind === 'diff') {
      const d = vals[i] - vals[j];
      return {
        q: `${lead} בכמה ${ctx.unit} העמודה "${A}" גבוהה מהעמודה "${Bn}"?`, answer: d, figure: chartFig(spec),
        hint: '"בכמה" שואל על הפרש: קוראים את שתי העמודות ומחסרים.',
        solution: `${read}, והעמודה "${Bn}" מגיעה ל־${vals[j]}. ההפרש: \`${vals[i]} - ${vals[j]} = ${d}\`.`,
        scene: { ...spec, steps: [
          { text: `${read}.`, hot: i, read: i },
          { text: `העמודה "${Bn}" מגיעה ל־${vals[j]}.`, hot: [i, j], read: [i, j] },
          { text: `"בכמה" זה הפרש: \`${vals[i]} - ${vals[j]} = ${d}\`.`, hot: [i, j], read: [i, j], label: `${vals[i]} − ${vals[j]} = ${d}` },
        ] },
      };
    }
    const k = vals[i] / vals[j];
    return {
      q: `${lead} פי כמה העמודה "${A}" גבוהה מהעמודה "${Bn}"?`, answer: k, figure: chartFig(spec),
      hint: '"פי כמה" שואל על חילוק, לא על הפרש.',
      solution: `${read}, והעמודה "${Bn}" מגיעה ל־${vals[j]}. "פי כמה" זה חילוק: \`${vals[i]} ÷ ${vals[j]} = ${k}\`. (ההפרש, ${vals[i] - vals[j]}, עונה על שאלה אחרת: "בכמה".)`,
      scene: { ...spec, steps: [
        { text: `${read}, והעמודה "${Bn}" מגיעה ל־${vals[j]}.`, hot: [i, j], read: [i, j] },
        { text: `"פי כמה" זה חילוק: \`${vals[i]} ÷ ${vals[j]} = ${k}\`.`, hot: [i, j], read: [i, j], label: `${vals[i]} ÷ ${vals[j]} = ${k}` },
      ] },
    };
  },

  // A pie chart. ask: missing | amount | percent (default: any).
  'pie-pct'(r, { ask } = {}) {
    const ctx = pick(r, PIES), ps = pieSplit(r), total = pick(r, ctx.totals);
    const kind = ask || pick(r, ['missing', 'amount', 'percent']);
    const i = int(r, 0, 3), name = ctx.cats[i], amount = (ps[i] * total) / 100;
    const shown = ctx.cats.map((c, k) => (k === i && kind !== 'amount' ? [c, ps[k], '?'] : [c, ps[k]]));
    const spec = { type: 'chart', kind: 'pie', data: shown, unit: '%' };
    const fig = chartFig(spec);
    const lead = `בדיאגרמה: ${ctx.title}.`;
    if (kind === 'missing') {
      const rest = ps.filter((_, k) => k !== i);
      return {
        q: `${lead} איזה אחוז חסר בגזרה "${name}"?`, answer: ps[i], unit: '%', figure: fig,
        hint: 'כל העיגול הוא 100%.',
        solution: `כל העיגול הוא 100%. סכום שאר הגזרות: \`${rest.join(' + ')} = ${100 - ps[i]}\`. החסר: \`100 - ${100 - ps[i]} = ${ps[i]}\`, כלומר ${pct(ps[i])}.`,
        scene: { ...spec, steps: [
          { text: `כל העיגול הוא 100%. סוכמים את הגזרות הידועות: ${100 - ps[i]}%.`, hot: [0, 1, 2, 3].filter((k) => k !== i), label: `${rest.join(' + ')} = ${100 - ps[i]}` },
          { text: `החסר: \`100 - ${100 - ps[i]} = ${ps[i]}\`.`, hot: i, label: `100 − ${100 - ps[i]} = ${ps[i]}%` },
        ] },
      };
    }
    if (kind === 'amount') {
      return {
        q: `${lead} סך הכול ${total} ${ctx.unit}. מה הכמות בגזרה "${name}", ב${ctx.unit}?`, answer: amount, unit: ` ${ctx.unit}`, figure: fig,
        hint: `‏${pct(ps[i])} מתוך ${total}: אפשר להתחיל מ־10%, שזה ${total / 10}.`,
        solution: `כמות = אחוז × סך. \`${ps[i] / 100} · ${total} = ${amount}\`. בדרך אחרת: 10% מ־${total} זה ${total / 10}, ו־${pct(ps[i])} זה \`${ps[i] / 10} · ${total / 10} = ${amount}\`.`,
        scene: { ...spec, steps: [
          { text: `הגזרה "${name}" היא ${pct(ps[i])} מכל העיגול.`, hot: i },
          { text: `כמות = אחוז × סך: \`${ps[i] / 100} · ${total} = ${amount}\`.`, hot: i, label: `${ps[i] / 100} · ${total} = ${amount}` },
        ] },
      };
    }
    return {
      q: `${lead} סך הכול ${total} ${ctx.unit}, והגזרה "${name}" היא ${amount} ${ctx.unit}. איזה אחוז מ${ctx.of} זה?`, answer: ps[i], unit: '%', figure: fig,
      hint: 'אחוז = החלק ÷ השלם, כפול 100.',
      solution: `אחוז = החלק ÷ השלם × 100. \`${amount} ÷ ${total} = ${amount / total}\`, ו־\`${amount / total} · 100 = ${ps[i]}\`. כלומר ${pct(ps[i])}. בדיקה: סכום כל הגזרות \`${ps.join(' + ')} = 100\`.`,
    };
  },

  // A line graph over five years. ask: pct | most (default: any).
  'line-change'(r, { ask } = {}) {
    const ctx = pick(r, LINES), kind = ask || pick(r, ['pct', 'most']);
    const y0 = pick(r, [2020, 2021]), years = Array.from({ length: 5 }, (_, k) => y0 + k);
    let vals, i, p;
    if (kind === 'pct') {
      const [a, ch] = pick(r, CHANGES);
      p = ch; i = int(r, 0, 3);
      vals = Array(5);
      vals[i] = a; vals[i + 1] = a + (a * ch) / 100;
      for (let k = i - 1; k >= 0; k--) vals[k] = Math.max(100, vals[k + 1] - int(r, -2, 4) * 20);
      for (let k = i + 2; k < 5; k++) vals[k] = Math.max(100, vals[k - 1] + int(r, -2, 4) * 20);
    } else {
      // Rises of different sizes; the biggest rise is not at the highest point.
      for (;;) {
        vals = [int(r, 5, 15) * 20];
        for (let k = 0; k < 4; k++) vals.push(vals[k] + int(r, 1, 8) * 20);
        const d = vals.slice(1).map((v, k) => v - vals[k]), m = Math.max(...d);
        if (d.filter((x) => x === m).length === 1 && d.indexOf(m) < 3) { i = d.indexOf(m); break; }
      }
    }
    const spec = { type: 'chart', kind: 'line', data: years.map((y, k) => [String(y), vals[k]]), name: ctx.unit };
    const lead = `בגרף: ${ctx.title}, בכל שנה.`;
    const [ya, yb] = [years[i], years[i + 1]], [a, b] = [vals[i], vals[i + 1]];
    if (kind === 'pct') {
      const up = b > a, d = Math.abs(b - a);
      return {
        q: `${lead} בכמה אחוזים ${up ? 'עלה' : 'ירד'} המספר משנת ${ya} לשנת ${yb}?`, answer: Math.abs(p), unit: '%', figure: chartFig(spec, { values: true }),
        hint: `שינוי באחוזים: ההפרש ÷ הערך הישן (של ${ya}), כפול 100.`,
        solution: `בשנת ${ya}: ${a}. בשנת ${yb}: ${b}. ההפרש: \`${up ? `${b} - ${a}` : `${a} - ${b}`} = ${d}\`. מחלקים בערך הישן: \`${d} ÷ ${a} = ${d / a}\`, ו־\`${d / a} · 100 = ${Math.abs(p)}\`. ${up ? 'עלייה' : 'ירידה'} של ${pct(Math.abs(p))}.`,
        scene: { ...spec, steps: [
          { text: `קוראים את שתי השנים: ${a} ו־${b}.`, values: true, hot: [i, i + 1], read: [i, i + 1] },
          { text: `ההפרש: ${d}.`, values: true, hot: [i, i + 1], seg: i, label: `${up ? 'עלייה' : 'ירידה'} של ${d}` },
          { text: `מחלקים בערך **הישן**, ${a}: \`${d} ÷ ${a} · 100 = ${Math.abs(p)}\`.`, values: true, hot: [i, i + 1], seg: i, label: `${d} ÷ ${a} · 100 = ${Math.abs(p)}%` },
        ] },
      };
    }
    const opts = [0, 1, 2, 3].map((k) => `בין ${years[k]} ל־${years[k + 1]}`);
    const d = vals.slice(1).map((v, k) => v - vals[k]);
    return {
      q: `${lead} בין אילו שתי שנים הייתה העלייה הגדולה ביותר?`, options: opts, answer: i, fixed: true, figure: chartFig(spec, { values: true }),
      hint: 'העלייה הגדולה היא ההפרש הגדול, והקטע התלול ביותר בגרף. לא השנה עם הערך הגבוה.',
      solution: `ההפרשים: ${d.map((x, k) => `\`${vals[k + 1]} - ${vals[k]} = ${x}\``).join(', ')}. הגדול: ${d[i]}, בין ${ya} ל־${yb}. זה הקטע התלול ביותר.`,
      scene: { ...spec, steps: [
        { text: 'מחשבים את ההפרש בכל קטע.', values: true },
        { text: `ההפרש הגדול: ${d[i]}, בין ${ya} ל־${yb}. זה הקטע התלול ביותר.`, values: true, seg: i, hot: [i, i + 1], label: `עלייה של ${d[i]}` },
      ] },
    };
  },

  // A linear rule in context. ask: value (substitute) | solve (an equation).
  'func-rule'(r, { ask } = {}) {
    const c = pick(r, RULES)(r), kind = ask || pick(r, ['value', 'solve']);
    const rule = ruleText(c), sgn = c.b < 0 ? '-' : '+', B = Math.abs(c.b);
    if (kind === 'value') {
      const hi = Math.max(2, Math.floor(c.xMax) - 1), x = int(r, 2, hi), y = c.a + c.b * x;
      return {
        q: `${c.story} \`${rule}\`. מה ה־\`${c.y}\` כאשר \`${c.x} = ${x}\`?`, answer: y, unit: c.yu === '%' || c.yu === '°' ? c.yu : ` ${c.yu}`,
        hint: `מציבים ${x} במקום \`${c.x}\`. קודם הכפל, אחר כך ${c.b < 0 ? 'החיסור' : 'החיבור'}.`,
        solution: `מציבים \`${c.x} = ${x}\`: \`${c.y} = ${c.a} ${sgn} ${B} · ${x}\`, \`${c.y} = ${c.a} ${sgn} ${B * x}\`, \`${c.y} = ${y}\`.`,
      };
    }
    let x = int(r, 2, Math.max(2, Math.floor(c.xMax) - 1));
    if (r() < 0.3 && c.b % 2 === 0) x += 0.5;
    const y = c.a + c.b * x, d = y - c.a;
    return {
      q: `${c.story} \`${rule}\`. ${c.when || 'מתי'} \`${c.y} = ${y}\`? (כמה ${c.xu}?)`, answer: x, unit: ` ${c.xu}`,
      hint: `כאן נתון \`${c.y}\`, ומחפשים את \`${c.x}\`: כותבים משוואה \`${c.a} ${sgn} ${B}${c.x} = ${y}\`.`,
      solution: `משוואה: \`${c.a} ${sgn} ${B}${c.x} = ${y}\`. מעבירים את ${c.a} לאגף השני: \`${sgn === '-' ? '-' : ''}${B}${c.x} = ${y} - ${c.a}\`, כלומר \`${sgn === '-' ? '-' : ''}${B}${c.x} = ${d}\`. מחלקים ב־\`${c.b}\`: \`${c.x} = ${d} ÷ ${c.b < 0 ? `(${c.b})` : c.b} = ${x}\`. בדיקה: \`${c.a} ${sgn} ${B} · ${x} = ${y}\` ✔.`,
    };
  },

  // h = b·t − a·t²: when is the ball at height H? ask: first | second.
  'quad-height'(r, { ask } = {}) {
    const a = pick(r, [1, 2, 5]);
    let t1, t2;
    do { t1 = int(r, 1, 3); t2 = int(r, t1 + 1, 5); } while (a === 5 && t1 + t2 > 6);
    const S = t1 + t2, b = a * S, H = a * t1 * t2, kind = ask || pick(r, ['first', 'second']);
    const rule = a === 1 ? `h = ${b}t - t²` : `h = ${b}t - ${a}t²`;
    const D = S * S - 4 * t1 * t2, sq = t2 - t1;
    const pts = [];
    for (let k = 0; k <= 2 * S; k++) { const t = k / 2; pts.push([String(t), b * t - a * t * t]); }
    const spec = { type: 'chart', kind: 'line', data: pts, xEvery: 2, name: 'גובה (מ׳)', xName: 'זמן (שניות)' };
    const want = kind === 'first' ? t1 : t2;
    const div = a === 1 ? '' : ` מחלקים ב־${a}: \`t² - ${S}t + ${t1 * t2} = 0\`.`;
    return {
      q: `כדור נזרק למעלה. הגובה שלו (במטרים) אחרי \`t\` שניות הוא \`${rule}\`. אחרי כמה שניות הכדור בגובה ${H} מטר ${kind === 'first' ? 'בפעם הראשונה (בעלייה)' : 'בפעם השנייה (בירידה)'}?`,
      answer: want, unit: ' שניות',
      hint: `כותבים \`${rule.slice(4)} = ${H}\`, מעבירים הכול לאגף אחד, ופותרים בנוסחת השורשים. יש שתי תשובות: איזו מהן מתאימה?`,
      solution: `משוואה: \`${rule.slice(4)} = ${H}\`. מעבירים הכול לאגף אחד: \`${a === 1 ? '' : a}t² - ${b}t + ${H} = 0\`.${div} נוסחת השורשים עם \`a = 1\`, \`b = -${S}\`, \`c = ${t1 * t2}\`: \`t = (${S} ± √(${S}² - 4 · 1 · ${t1 * t2})) ÷ 2 = (${S} ± √${D}) ÷ 2 = (${S} ± ${sq}) ÷ 2\`. לכן \`t = ${t2}\` או \`t = ${t1}\`. הכדור עובר בגובה ${H} פעמיים: בעלייה (${t1} שניות) ובירידה (${t2} שניות). התשובה: ${want}.`,
      scene: { ...spec, steps: [
        { text: `זה גרף הגובה של הכדור. מחפשים מתי הגובה ${H}.`, guide: { y: H, text: `h = ${H}` } },
        { text: `הקו בגובה ${H} פוגש את הגרף פעמיים: ב־${t1} וב־${t2} שניות.`, guide: { y: H, text: `h = ${H}` }, hot: [2 * t1, 2 * t2], label: `t = ${t1}  או  t = ${t2}` },
        { text: `${kind === 'first' ? 'בפעם הראשונה, בעלייה' : 'בפעם השנייה, בירידה'}: \`t = ${want}\`.`, guide: { y: H, text: `h = ${H}` }, hot: [2 * want], read: [2 * want], label: `t = ${want}` },
      ] },
    };
  },
};

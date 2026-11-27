// Multiplying and dividing signed numbers (grade 7). Every product and
// quotient gets an animated number-line solution: equal jumps from 0.
// Types: int-mul (ask: pos-neg | neg-neg | special, or a list), int-sign,
// int-div, int-missing, int-chain.
import { int, p, pick } from './util.js';

const nz = (r, lo, hi) => (r() < 0.5 ? -1 : 1) * int(r, lo, hi); // a nonzero number, random sign
const neg = (s) => String(s).replace(/-/g, '−'); // scene labels use a real minus sign
const signWord = (n) => (n > 0 ? 'חיובי' : n < 0 ? 'שלילי' : 'אפס');

// Number-line scene for x × y. With a positive factor: that many jumps of
// the other one. With two negatives: the jumps of |x| × y, then the opposite.
export function mulScene(x, y, first = []) {
  const T = x * y;
  const R = Math.max(6, Math.ceil((Math.abs(T) + 2) / 5) * 5);
  const base = { type: 'number-line', range: [-R, R] };
  const jumps = (n, size) => Array.from({ length: n }, (_, k) => [k * size, (k + 1) * size]);
  if (T === 0) {
    return { ...base, steps: [...first, { text: `גורם אחד הוא 0, ולכן אין קפיצות בכלל: \`${p(x)} × ${p(y)} = 0\`.`, marker: 0, points: [0], label: neg(`${p(x)} × ${p(y)} = 0`) }] };
  }
  if (x > 0 || y > 0) {
    const [n, size] = x > 0 ? [x, y] : [y, x];
    const swap = x <= 0 ? [{ text: `הסדר בכפל לא משנה: \`${p(x)} × ${p(y)} = ${n} × ${p(size)}\`.`, marker: 0, points: [0], label: neg(`${p(x)} × ${p(y)} = ${n} × ${p(size)}`) }] : [];
    return { ...base, hop: Math.abs(size), steps: [
      ...first, ...swap,
      { text: `התרגיל \`${n} × ${p(size)}\` הוא ${n === 1 ? 'קפיצה אחת' : `${n} קפיצות`} של \`${size}\` מ־0, ${size < 0 ? 'שמאלה' : 'ימינה'}.`, marker: T, arrow: jumps(n, size), points: [0] },
      { text: `הגענו ל־\`${T}\`.`, marker: T, arrow: jumps(n, size), points: [0, T], label: neg(`${p(x)} × ${p(y)} = ${T}`) },
    ] };
  }
  // both negative: |x| jumps of y, then the opposite.
  const m = -x, mid = m * y;
  return { ...base, hop: Math.abs(y), steps: [
    ...first,
    { text: `קודם \`${m} × ${p(y)}\`: ${m === 1 ? 'קפיצה אחת' : `${m} קפיצות`} של \`${y}\` שמאלה, עד \`${mid}\`.`, marker: mid, arrow: jumps(m, y), points: [0] },
    { text: `הגורם הוא \`${x}\`, לא \`${m}\`. המינוס הופך את התוצאה לנגדית: מ־\`${mid}\` ל־\`${T}\`.`, marker: T, arrow: jumps(m, -y), points: [mid, T], label: neg(`${p(x)} × ${p(y)} = ${T}`) },
  ] };
}

export const intMulDiv = {
  'int-mul'(r, { ask = ['pos-neg', 'neg-neg'], max = 7 }) {
    const kind = Array.isArray(ask) ? pick(r, ask) : ask;
    let a, b;
    if (kind === 'special') {
      const s = pick(r, [0, 1, -1]), o = nz(r, 2, 9);
      [a, b] = r() < 0.5 ? [s, o] : [o, s];
    } else if (kind === 'neg-neg') {
      a = -int(r, 2, max); b = -int(r, 2, max);
    } else {
      a = int(r, 2, max); b = -int(r, 2, max);
      if (r() < 0.5) [a, b] = [b, a];
    }
    const T = a * b, sameSign = (a < 0) === (b < 0);
    const one = a === 1 || b === 1, minusOne = a === -1 || b === -1, other = Math.abs(a) === 1 ? b : a;
    const hint = T === 0 ? 'מה יוצא כשאחד הגורמים הוא 0?'
      : minusOne ? 'כפול `-1` נותן את המספר הנגדי.'
        : one ? 'כפול 1 משאיר את המספר כמו שהוא.'
          : sameSign ? 'שני הגורמים שליליים. קודם קבעו את הסימן (סימנים שווים), ואז הכפילו.' : 'קודם קבעו את הסימן: אחד חיובי ואחד שלילי. אחר כך הכפילו בלי הסימנים.';
    const solution = T === 0 ? `\`${p(a)} × ${p(b)} = 0\`: כפול 0 תמיד 0, גם עם מספר שלילי.`
      : minusOne ? `\`${p(a)} × ${p(b)} = ${T}\`: הנגדי של \`${other}\` הוא \`${-other}\`.`
        : one ? `\`${p(a)} × ${p(b)} = ${T}\``
          : `${sameSign ? 'סימנים שווים: חיובי' : 'סימנים שונים: שלילי'}. \`${Math.abs(a)} × ${Math.abs(b)} = ${Math.abs(T)}\`, ולכן \`${p(a)} × ${p(b)} = ${T}\`.`;
    return { q: `כמה זה \`${p(a)} × ${p(b)}\`?`, answer: T, hint, solution, scene: mulScene(a, b) };
  },

  // The sign of a product of 3–5 factors: count the negatives.
  'int-sign'(r, { zero = 0.2 }) {
    const n = int(r, 3, 5);
    const f = Array.from({ length: n }, () => nz(r, 1, 9));
    if (r() < zero) f[int(r, 0, n - 1)] = 0;
    const negs = f.filter((v) => v < 0).length, T = f.reduce((s, v) => s * v, 1);
    const ans = T > 0 ? 0 : T < 0 ? 1 : 2;
    return {
      q: `בלי לחשב: מה הסימן של \`${f.map(p).join(' × ')}\`?`,
      options: ['חיובי', 'שלילי', 'אפס'],
      fixed: true,
      answer: ans,
      hint: 'ספרו רק את הגורמים השליליים. וגם: האם יש גורם 0?',
      solution: T === 0
        ? 'יש גורם 0, ולכן כל המכפלה היא 0, בלי קשר לסימנים.'
        : `${negs === 0 ? 'אין גורמים שליליים' : negs === 1 ? 'יש גורם שלילי אחד, מספר אי־זוגי' : `יש ${negs} גורמים שליליים, מספר ${negs % 2 ? 'אי־זוגי' : 'זוגי'}`}, ולכן המכפלה ${signWord(T)}ת: \`${T}\`.`,
    };
  },

  // a ÷ b = q, built from q × b so it always divides evenly. Sometimes 0 ÷ b.
  'int-div'(r, { max = 7 }) {
    let b = nz(r, 2, max);
    const q = r() < 0.12 ? 0 : nz(r, 2, max);
    if (b > 0 && q >= 0) b = -b; // keep a negative in every item
    const a = q * b;
    const sameSign = (a < 0) === (b < 0);
    return {
      q: `כמה זה \`${p(a)} ÷ ${p(b)}\`?`,
      answer: q,
      hint: q === 0 ? `איזה מספר כפול \`${p(b)}\` נותן 0?` : `איזה מספר כפול \`${p(b)}\` נותן \`${a}\`? ${sameSign ? 'הסימנים שווים.' : 'הסימנים שונים.'}`,
      solution: q === 0
        ? `\`0 ÷ ${p(b)} = 0\`, כי \`0 × ${p(b)} = 0\`.`
        : `${sameSign ? 'סימנים שווים: חיובי' : 'סימנים שונים: שלילי'}. \`${Math.abs(a)} ÷ ${Math.abs(b)} = ${Math.abs(q)}\`, ולכן \`${p(a)} ÷ ${p(b)} = ${q}\`. בדיקה: \`${p(q)} × ${p(b)} = ${a}\`.`,
      scene: mulScene(q, b, [{ text: `חילוק הפוך לכפל. מחפשים מספר שכפול \`${p(b)}\` נותן \`${a}\`. בודקים: \`${p(q)} × ${p(b)}\`.`, marker: 0, points: [0] }]),
    };
  },

  // ? × b = c: the missing factor is c ÷ b.
  'int-missing'(r, { max = 7 }) {
    const a = nz(r, 2, max);
    let b = nz(r, 2, max);
    if (a > 0 && b > 0) b = -b; // keep a negative in every item
    const c = a * b;
    const front = r() < 0.5;
    return {
      q: front ? `השלימו: \`? × ${p(b)} = ${c}\`` : `השלימו: \`${p(b)} × ? = ${c}\``,
      answer: a,
      hint: `המספר החסר הוא \`${p(c)} ÷ ${p(b)}\`. קודם הסימן, אחר כך המספר.`,
      solution: `\`${p(c)} ÷ ${p(b)} = ${a}\`. בדיקה: \`${p(a)} × ${p(b)} = ${c}\`.`,
      scene: mulScene(a, b, [{ text: `מחפשים מספר שכפול \`${p(b)}\` נותן \`${c}\`: זה \`${p(c)} ÷ ${p(b)} = ${a}\`. בודקים בכפל.`, marker: 0, points: [0] }]),
    };
  },

  // Two steps, left to right: a × b ÷ c, or a × b × c.
  'int-chain'(r) {
    const a = nz(r, 2, 6), b = nz(r, 2, 6), ab = a * b;
    if (r() < 0.5) {
      const divs = [2, 3, 4, 5, 6].filter((d) => ab % d === 0 && d !== Math.abs(ab));
      if (divs.length) {
        const c = (r() < 0.5 ? -1 : 1) * pick(r, divs), T = ab / c;
        return {
          q: `כמה זה \`${p(a)} × ${p(b)} ÷ ${p(c)}\`?`,
          answer: T,
          hint: 'כפל וחילוק עושים משמאל לימין: קודם הכפל, אחר כך החילוק.',
          solution: `\`${p(a)} × ${p(b)} = ${ab}\`, ואז \`${p(ab)} ÷ ${p(c)} = ${T}\`.`,
        };
      }
    }
    const c = nz(r, 1, 3), T = ab * c;
    const negs = [a, b, c].filter((v) => v < 0).length;
    return {
      q: `כמה זה \`${p(a)} × ${p(b)} × ${p(c)}\`?`,
      answer: T,
      hint: 'אפשר קודם לספור כמה גורמים שליליים יש, ואז להכפיל בלי הסימנים.',
      solution: `\`${p(a)} × ${p(b)} = ${ab}\`, ואז \`${p(ab)} × ${p(c)} = ${T}\`. בדיקה בסימנים: ${negs === 1 ? 'גורם שלילי אחד' : negs === 0 ? 'אין גורמים שליליים' : `${negs} גורמים שליליים`}, ולכן התוצאה ${signWord(T)}ת.`,
    };
  },
};

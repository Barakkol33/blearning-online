// Powers with a natural exponent and the positive square root (grade 7).
// Types: pow (ask: pos | special | neg, or a list), pow-missing, pow-sign,
// sqrt, sqrt-between, pow-mix.
// Exponents are written with superscript digits: 2⁵, (-3)².
import { int, pick } from './util.js';

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
export const sup = (n) => String(n).replace(/\d/g, (d) => SUP[d]);
const neg = (s) => String(s).replace(/-/g, '−'); // scene labels use a real minus sign
const pw = (a, n) => (a < 0 ? `(${a})${sup(n)}` : `${a}${sup(n)}`);
const parity = (n) => (n % 2 ? 'אי־זוגי' : 'זוגי');
// "3 · 3 · 3 · 3"
const expand = (a, n) => Array.from({ length: n }, () => (a < 0 ? `(${a})` : `${a}`)).join(' · ');
// "3, 9, 27, 81": the running products
const chain = (a, n) => Array.from({ length: n }, (_, k) => a ** (k + 1)).join(', ');

// Plates scene for aⁿ with a > 0: a plates of aⁿ⁻¹, built one power at a time.
function plateScene(a, n) {
  const steps = [];
  for (let k = 1; k <= n; k++) {
    steps.push({
      text: k === 1 ? `מתחילים ב־\`${a}\`.` : `כופלים שוב ב־${a}: ${a} קבוצות של \`${a ** (k - 1)}\`.`,
      groups: k === 1 ? 1 : a, size: k === 1 ? a : a ** (k - 1), count: k > 1,
      label: `${a}${sup(k)} = ${a ** k}`,
    });
  }
  return { type: 'groups', steps };
}

// Array scene for a² (a square of a by a).
const squareScene = (a) => ({ type: 'groups', steps: [
  { text: `ריבוע של ${a} על ${a}: ${a} שורות, ובכל שורה ${a}.`, groups: a, size: a, array: true, label: `${a}${sup(2)} = ${a} × ${a}` },
  { text: `סופרים בשורות: \`${a}${sup(2)} = ${a * a}\`.`, groups: a, size: a, array: true, by: 'rows', count: true, label: `${a}${sup(2)} = ${a * a}` },
] });

// Number-line scene for a negative base: the frog visits (-b)¹, (-b)², …
function negScene(b, n, outside) {
  const vals = Array.from({ length: n }, (_, k) => (-b) ** (k + 1));
  const T = outside ? -(b ** n) : vals[n - 1];
  const R = Math.max(6, Math.ceil((Math.max(...vals.map(Math.abs), Math.abs(T)) + 2) / 5) * 5);
  const base = { type: 'number-line', range: [-R, R] };
  if (outside) {
    return { ...base, steps: [
      { text: `בלי סוגריים, החזקה חלה רק על ${b}: קודם \`${b}${sup(n)} = ${b ** n}\`.`, marker: b ** n, points: [b ** n], label: `${b}${sup(n)} = ${b ** n}` },
      { text: `המינוס שבחוץ הופך את התוצאה לנגדית: \`-${b}${sup(n)} = ${T}\`.`, marker: T, points: [b ** n, T], label: neg(`-${b}${sup(n)} = ${T}`) },
    ] };
  }
  return { ...base, steps: vals.map((v, k) => ({
    text: k === 0 ? `‏\`${pw(-b, 1)} = ${-b}\`: מספר שלילי אחד.`
      : `כופלים שוב ב־\`(${-b})\`: הסימן מתהפך. ${k + 1} גורמים שליליים, מספר ${parity(k + 1)}, ולכן ${v > 0 ? 'חיובי' : 'שלילי'}: \`${v}\`.`,
    marker: v, points: vals.slice(0, k + 1), label: neg(`${pw(-b, k + 1)} = ${v}`),
  })) };
}

export const powers = {
  'pow'(r, { ask = ['pos'] }) {
    const kind = Array.isArray(ask) ? pick(r, ask) : ask;
    if (kind === 'special') {
      const s = pick(r, ['one', 'base1', 'base0', 'ten']);
      if (s === 'one') {
        const a = int(r, 2, 25);
        return { q: `כמה זה \`${a}${sup(1)}\`?`, answer: a, hint: 'מעריך 1: הבסיס מופיע פעם אחת בלבד.', solution: `\`${a}${sup(1)} = ${a}\`: יש רק גורם אחד, ${a}.` };
      }
      if (s === 'ten') {
        const n = int(r, 2, 6);
        return { q: `כמה זה \`10${sup(n)}\`?`, answer: 10 ** n, hint: 'כל כפל ב־10 מוסיף אפס אחד. כמה פעמים כופלים?', solution: `\`10${sup(n)}\` הוא 1 ואחריו ${n} אפסים: \`${10 ** n}\`.` };
      }
      const b = s === 'base1' ? 1 : 0, n = int(r, 2, 9);
      return {
        q: `כמה זה \`${b}${sup(n)}\`?`, answer: b,
        hint: b ? `מה יוצא כשכופלים 1 בעצמו ${n} פעמים?` : 'מה יוצא כשאחד הגורמים הוא 0?',
        solution: b ? `\`1${sup(n)} = ${expand(1, n)} = 1\`. המעריך לא משנה: 1 כפול 1 תמיד 1. (לא ${n}!)` : `\`0${sup(n)} = ${expand(0, n)} = 0\`: כפול 0 תמיד 0.`,
      };
    }
    if (kind === 'neg') {
      const b = pick(r, [2, 2, 3, 3, 4, 5]), maxN = { 2: 5, 3: 4, 4: 3, 5: 3 }[b];
      const n = int(r, 2, maxN), outside = r() < 0.35;
      if (outside) {
        const T = -(b ** n);
        return {
          q: `כמה זה \`-${b}${sup(n)}\`?`, answer: T,
          hint: 'אין סוגריים. על איזה מספר חלה החזקה?',
          solution: `בלי סוגריים, החזקה חלה רק על ${b}: \`${b}${sup(n)} = ${b ** n}\`, והמינוס נשאר: \`-${b}${sup(n)} = ${T}\`. (לעומת זאת, \`${pw(-b, n)} = ${(-b) ** n}\`.)`,
          scene: negScene(b, n, true),
        };
      }
      const T = (-b) ** n;
      return {
        q: `כמה זה \`${pw(-b, n)}\`?`, answer: T,
        hint: `קודם הסימן: ${n} גורמים שליליים. זוגי או אי־זוגי? אחר כך \`${b}${sup(n)}\`.`,
        solution: `\`${pw(-b, n)} = ${expand(-b, n)}\`. יש ${n} גורמים שליליים, מספר ${parity(n)}, ולכן התוצאה ${T > 0 ? 'חיובית' : 'שלילית'}: \`${b}${sup(n)} = ${b ** n}\`, ו־\`${pw(-b, n)} = ${T}\`.`,
        scene: negScene(b, n, false),
      };
    }
    // pos: a base from 2 to 9, the value at most 729.
    const a = pick(r, [2, 2, 3, 3, 4, 5, 6, 7, 8, 9]);
    const maxN = { 2: 7, 3: 5, 4: 4, 5: 4 }[a] || 3;
    const n = int(r, 2, maxN), T = a ** n;
    const scene = n === 2 ? squareScene(a) : a ** (n - 1) <= 27 ? plateScene(a, n) : undefined;
    return {
      q: `כמה זה \`${a}${sup(n)}\`?`, answer: T,
      hint: `כופלים ${a} בעצמו: ${n} גורמים. אפשר צעד אחרי צעד: ${a}, ${a * a}, …`,
      solution: `\`${a}${sup(n)} = ${expand(a, n)}\`. צעד אחרי צעד: ${chain(a, n)}. התשובה \`${T}\`, ולא \`${a} × ${n} = ${a * n}\`.`,
      ...(scene ? { scene } : {}),
    };
  },

  // ?ⁿ = v (the base), or "a to the power of what is v?" (the exponent).
  'pow-missing'(r) {
    if (r() < 0.5) {
      const n = pick(r, [2, 2, 3]), a = n === 2 ? int(r, 3, 12) : int(r, 2, 5), v = a ** n;
      return {
        q: `השלימו: \`?${sup(n)} = ${v}\`. (מספר חיובי)`, answer: a,
        hint: n === 2 ? `איזה מספר כפול עצמו נותן ${v}?` : `איזה מספר, כפול עצמו 3 פעמים, נותן ${v}? נסו 2, 3, 4…`,
        solution: `\`${a}${sup(n)} = ${expand(a, n)} = ${v}\`, ולכן החסר הוא ${a}.`,
      };
    }
    const a = pick(r, [2, 2, 3, 5, 10]), n = int(r, 2, { 2: 7, 3: 5, 5: 4, 10: 5 }[a]), v = a ** n;
    return {
      q: `${a} בחזקת כמה שווה \`${v}\`?`, answer: n,
      hint: `כופלים ב־${a} שוב ושוב וסופרים: ${a}, ${a * a}, …`,
      solution: `${chain(a, n)}: ${n} גורמים, ולכן \`${a}${sup(n)} = ${v}\`. המעריך הוא ${n}.`,
    };
  },

  // The sign, without computing: the parity of the exponent, and brackets.
  'pow-sign'(r) {
    const kind = pick(r, ['par', 'par', 'one', 'out']);
    let q, T, why;
    if (kind === 'one') {
      const n = int(r, 10, 201);
      q = pw(-1, n); T = n % 2 ? -1 : 1;
      why = `${n} גורמים של \`(-1)\`, מספר ${parity(n)}, ולכן \`${q} = ${T}\`.`;
    } else if (kind === 'out') {
      const b = int(r, 2, 9), n = 2 * int(r, 1, 4);
      q = `-${b}${sup(n)}`; T = -1;
      why = `אין סוגריים: \`${b}${sup(n)}\` חיובי, והמינוס שבחוץ הופך אותו לשלילי. (רק \`${pw(-b, n)}\` חיובי.)`;
    } else {
      const b = int(r, 2, 9), n = int(r, 3, 15);
      q = pw(-b, n); T = n % 2 ? -1 : 1;
      why = `${n} גורמים שליליים, מספר ${parity(n)}, ולכן ${T > 0 ? 'חיובי' : 'שלילי'}.`;
    }
    return {
      q: `בלי לחשב: מה הסימן של \`${q}\`?`, options: ['חיובי', 'שלילי'], fixed: true, answer: T > 0 ? 0 : 1,
      hint: 'האם יש סוגריים סביב המינוס? אם כן, ספרו את הגורמים השליליים: זוגי או אי־זוגי?',
      solution: why,
    };
  },

  'sqrt'(r) {
    const a = r() < 0.15 ? pick(r, [0, 1]) : int(r, 2, 12), v = a * a;
    const scene = a >= 2 && a <= 10 ? { type: 'groups', steps: [
      { text: `‏${v} נקודות, מסודרות כריבוע. מה אורך הצלע?`, groups: a, size: a, array: true, label: `√${v} = ?` },
      { text: `בכל שורה ${a}, ויש ${a} שורות: \`${a} × ${a} = ${v}\`.`, groups: a, size: a, array: true, by: 'rows', count: 1, label: `${a} × ${a} = ${v}` },
      { text: `הצלע היא ${a}, ולכן \`√${v} = ${a}\`.`, groups: a, size: a, array: true, by: 'rows', count: 1, label: `√${v} = ${a}` },
    ] } : undefined;
    return {
      q: `כמה זה \`√${v}\`?`, answer: a,
      hint: a <= 1 ? `איזה מספר בריבוע נותן ${v}?` : `איזה מספר חיובי כפול עצמו נותן ${v}? (לא חצי: \`${v} ÷ 2\` זו פעולה אחרת.)`,
      solution: a ? `\`${a}${sup(2)} = ${v}\`, ו־${a} חיובי, ולכן \`√${v} = ${a}\`.` : '‏`0² = 0`, ולכן `√0 = 0`.',
      ...(scene ? { scene } : {}),
    };
  },

  // Between which two whole numbers is √m?
  'sqrt-between'(r) {
    const a = int(r, 1, 9), m = int(r, a * a + 1, (a + 1) * (a + 1) - 1);
    const k = Math.min(a, int(r, 0, 2)), lo = a - k; // where the right option sits
    const options = [0, 1, 2].map((i) => `בין ${lo + i} ל־${lo + i + 1}`);
    const x = Math.round(Math.sqrt(m) * 10) / 10;
    return {
      q: `בין אילו שני מספרים שלמים נמצא \`√${m}\`?`, options, fixed: true, answer: k,
      hint: `חפשו את הריבועים השלמים הקרובים ל־${m}: אחד קטן ממנו ואחד גדול ממנו.`,
      solution: `\`${a}${sup(2)} = ${a * a}\` ו־\`${a + 1}${sup(2)} = ${(a + 1) ** 2}\`. מכיוון ש־\`${a * a} < ${m} < ${(a + 1) ** 2}\`, השורש בין ${a} ל־${a + 1} (בערך ${x}).`,
      scene: { type: 'number-line', range: [Math.max(0, a - 2), a + 3], steps: [
        { text: `‏\`${a}${sup(2)} = ${a * a}\` קטן מ־${m}, ו־\`${a + 1}${sup(2)} = ${(a + 1) ** 2}\` גדול ממנו.`, points: [a, a + 1], label: `${a * a} < ${m} < ${(a + 1) ** 2}` },
        { text: `לכן \`√${m}\` בין ${a} ל־${a + 1}: בערך ${x}.`, marker: x, points: [a, a + 1], label: `${a} < √${m} < ${a + 1}` },
      ] },
    };
  },

  // Two steps: powers and roots together.
  'pow-mix'(r) {
    const kind = pick(r, ['sum', 'diff', 'root-pow', 'pyth', 'neg']);
    if (kind === 'pyth') {
      const [a, b, c] = pick(r, [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5]]);
      return {
        q: `כמה זה \`√(${a}${sup(2)} + ${b}${sup(2)})\`?`, answer: c,
        hint: 'קודם מה שבתוך השורש: שתי החזקות, ואז הסכום.',
        solution: `\`${a}${sup(2)} + ${b}${sup(2)} = ${a * a} + ${b * b} = ${c * c}\`, ו־\`√${c * c} = ${c}\`. (לא \`${a} + ${b} = ${a + b}\`.)`,
      };
    }
    if (kind === 'root-pow') {
      const s = int(r, 2, 10), [b, n] = pick(r, [[2, 3], [2, 4], [3, 2], [3, 3], [4, 2], [5, 2], [2, 5]]);
      const T = s + b ** n;
      return {
        q: `כמה זה \`√${s * s} + ${b}${sup(n)}\`?`, answer: T,
        hint: 'מחשבים כל חלק לבד: השורש, והחזקה. אחר כך מחברים.',
        solution: `\`√${s * s} = ${s}\` ו־\`${b}${sup(n)} = ${b ** n}\`, ולכן \`${s} + ${b ** n} = ${T}\`.`,
      };
    }
    if (kind === 'neg') {
      const a = int(r, 2, 5), b = pick(r, [2, 3]);
      const T = (-a) ** 2 + (-b) ** 3;
      return {
        q: `כמה זה \`${pw(-a, 2)} + ${pw(-b, 3)}\`?`, answer: T,
        hint: 'כל חזקה לבד, עם הסימן שלה: מעריך זוגי נותן חיובי, אי־זוגי נותן שלילי.',
        solution: `\`${pw(-a, 2)} = ${a * a}\` ו־\`${pw(-b, 3)} = ${-(b ** 3)}\`, ולכן \`${a * a} + (${-(b ** 3)}) = ${T}\`.`,
      };
    }
    const a = int(r, 3, 12), b = int(r, 2, a - 1), diff = kind === 'diff';
    const T = diff ? a * a - b * b : a * a + b * b;
    return {
      q: `כמה זה \`${a}${sup(2)} ${diff ? '-' : '+'} ${b}${sup(2)}\`?`, answer: T,
      hint: 'קודם כל ריבוע לבד, אחר כך החיבור או החיסור.',
      solution: `\`${a}${sup(2)} = ${a * a}\` ו־\`${b}${sup(2)} = ${b * b}\`, ולכן \`${a * a} ${diff ? '-' : '+'} ${b * b} = ${T}\`.${diff ? ` (לא \`(${a} - ${b})${sup(2)} = ${(a - b) ** 2}\`.)` : ''}`,
    };
  },
};

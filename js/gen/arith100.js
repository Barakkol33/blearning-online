// Adding and subtracting up to 100, with an animated base-ten-blocks solution.
// Options: regroup: true (carry / borrow) | false (no carry) | "mix" (default),
//          tens: true (whole tens only, e.g. 40 + 30).
import { int } from './util.js';

const tensWord = (t) => (t === 1 ? 'עשרת אחת' : `${t} עשרות`);
const onesWord = (o) => (o === 1 ? 'יחידה אחת' : `${o} יחידות`);
// "3 עשרות ו־4 יחידות", dropping a zero part ("7 עשרות", "5 יחידות").
const parts = (t, o) => [t && tensWord(t), o && onesWord(o)].filter(Boolean).join(' ו־') || '0';
const name = (n) => parts(Math.floor(n / 10), n % 10);

function pickPair(r, { regroup = 'mix', tens = false }, op) {
  const want = regroup === 'mix' ? r() < 0.6 : !!regroup;
  for (let k = 0; k < 200; k++) {
    let a = int(r, 11, 99), b = int(r, 11, 89);
    if (tens) { a = int(r, 1, 9) * 10; b = int(r, 1, 9) * 10; }
    if (op === '+' && a + b > 100) continue;
    if (op === '-' && b >= a) continue;
    const carry = op === '+' ? (a % 10) + (b % 10) >= 10 : a % 10 < b % 10;
    if (tens || carry === want) return [a, b, carry];
  }
  return op === '+' ? [23, 45, false] : [57, 24, false];
}

export const arith100 = {
  'add-100'(r, opt) {
    const [a, b, carry] = pickPair(r, opt, '+');
    const at = Math.floor(a / 10), ao = a % 10, bt = Math.floor(b / 10), bo = b % 10;
    const T = (at + bt) * 10, O = ao + bo, sum = a + b;
    const steps = [
      { text: `בונים את ${a}: ${name(a)}.`, tens: at, ones: ao, label: `${a}` },
      { text: `מוסיפים את ${b}: עוד ${parts(bt, bo)}.`, tens: at + bt, ones: O, label: `${a} + ${b}` },
    ];
    if (carry) {
      steps.push({ text: `יש ${O} יחידות. **10 יחידות הופכות לעשרת אחת**${O > 10 ? `, ונשארות ${O - 10}` : ', ולא נשארות יחידות'}.`, tens: at + bt + 1, ones: O - 10, label: `${O} = 10 + ${O - 10}` });
    }
    steps.push({ text: `סופרים: ${name(sum)}. כלומר ${sum}.`, tens: Math.floor(sum / 10), ones: sum % 10, label: `${a} + ${b} = ${sum}` });
    return {
      q: `כמה זה \`${a} + ${b}\`?`,
      answer: sum,
      hint: carry
        ? `עשרות עם עשרות, יחידות עם יחידות. ביחידות יוצא יותר מ־10: \`${ao} + ${bo} = ${O}\`, אז יש עוד עשרת.`
        : `עשרות עם עשרות (\`${at * 10} + ${bt * 10}\`), יחידות עם יחידות (\`${ao} + ${bo}\`).`,
      solution: `עשרות: \`${at * 10} + ${bt * 10} = ${T}\`. יחידות: \`${ao} + ${bo} = ${O}\`. ביחד: \`${T} + ${O} = ${sum}\`.`,
      scene: { type: 'blocks', steps },
    };
  },

  'sub-100'(r, opt) {
    const [a, b, borrow] = pickPair(r, opt, '-');
    const at = Math.floor(a / 10), ao = a % 10, bt = Math.floor(b / 10), bo = b % 10;
    const diff = a - b;
    const steps = [{ text: `בונים את ${a}: ${name(a)}.`, tens: at, ones: ao, label: `${a}` }];
    let t = at, o = ao;
    if (borrow) {
      t = at - 1; o = ao + 10;
      steps.push({ text: `צריך לקחת ${onesWord(bo)}, אבל יש רק ${ao}. **פורטים עשרת אחת ל־10 יחידות**.`, tens: t, ones: o, label: `${a} = ${t * 10} + ${o}` });
    }
    if (bo) steps.push({ text: `לוקחים ${onesWord(bo)}.`, tens: t, ones: o, crossed: bo, label: `${a} − ${b}` });
    steps.push({ text: `לוקחים ${tensWord(bt)}.`, tens: t, ones: o, crossed: bo, crossedTens: bt, label: `${a} − ${b}` });
    steps.push({ text: `מה נשאר? ${name(diff)}. כלומר ${diff}.`, tens: Math.floor(diff / 10), ones: diff % 10, label: `${a} − ${b} = ${diff}` });
    return {
      q: `כמה זה \`${a} - ${b}\`?`,
      answer: diff,
      hint: borrow
        ? `אין מספיק יחידות: ${ao} פחות ${bo} לא הולך. פרטו עשרת אחת ל־10 יחידות.`
        : `עשרות מעשרות (\`${at * 10} - ${bt * 10}\`), יחידות מיחידות (\`${ao} - ${bo}\`).`,
      solution: borrow
        ? `פורטים: \`${a} = ${t * 10} + ${o}\`. יחידות: \`${o} - ${bo} = ${o - bo}\`. עשרות: \`${t * 10} - ${bt * 10} = ${(t - bt) * 10}\`. ביחד ${diff}. בדיקה: \`${diff} + ${b} = ${a}\`.`
        : `עשרות: \`${at * 10} - ${bt * 10} = ${(at - bt) * 10}\`. יחידות: \`${ao} - ${bo} = ${ao - bo}\`. ביחד ${diff}. בדיקה: \`${diff} + ${b} = ${a}\`.`,
      scene: { type: 'blocks', steps },
    };
  },
};

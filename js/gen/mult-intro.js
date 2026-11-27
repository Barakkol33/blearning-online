// Multiplication as equal groups (grade 2). Every exercise has an animated
// "groups" solution: the groups appear, then we count by the group size.
// mult-groups options: ask: total | repeated | array | swap (or a list to mix).
import { int, pick } from './util.js';
import { groups } from '../scenes/groups.js';

// [container (plural), thing (plural), emoji, "in each one" (gender of the container), container (singular)]
const STORIES = [
  ['צלחות', 'עוגיות', '🍪', 'בכל אחת', 'צלחת'], ['קופסאות', 'תפוחים', '🍎', 'בכל אחת', 'קופסה'], ['שקיות', 'סוכריות', '🍬', 'בכל אחת', 'שקית'],
  ['אגרטלים', 'פרחים', '🌷', 'בכל אחד', 'אגרטל'], ['קנים', 'ביצים', '🥚', 'בכל אחד', 'קן'], ['סלים', 'תותים', '🍓', 'בכל אחד', 'סל'],
];
const skip = (n, k) => Array.from({ length: n }, (_, i) => (i + 1) * k).join(', ');
const plus = (n, k) => Array(n).fill(k).join(' + ');

export const groupsFig = (st, item) => {
  const g = groups({ item });
  g.draw(st, null);
  g.svg.classList.add('fig', 'groups-fig');
  return g.svg.outerHTML;
};

export const multIntro = {
  'mult-groups'(r, { ask = ['total', 'repeated', 'array', 'swap'] }) {
    const kind = Array.isArray(ask) ? pick(r, ask) : ask;
    const n = int(r, 2, 5), k = int(r, 2, 5), T = n * k;
    const [box, thing, item, each, one] = pick(r, STORIES);
    const countSteps = (extra = {}) => [
      { text: `${n} ${box}, ו${each} ${k} ${thing}. כל הקבוצות שוות.`, groups: n, size: k, ...extra },
      { text: `סופרים בקפיצות של ${k}: ${skip(n, k)}.`, groups: n, size: k, count: true, ...extra },
      { text: `${n} קבוצות של ${k}: \`${n} × ${k} = ${T}\`.`, groups: n, size: k, count: true, label: `${n} × ${k} = ${T}`, ...extra },
    ];

    if (kind === 'special') {
      // × 1, 1 ×, × 0: the cases that are easy to get wrong.
      const c = pick(r, ['times1', 'one', 'zero']);
      const [a, b] = c === 'times1' ? [n, 1] : c === 'one' ? [1, k] : [n, 0];
      return {
        q: `כמה זה \`${a} × ${b}\`?`,
        answer: a * b,
        hint: b === 0 ? `דמיינו ${a} קבוצות ריקות. כמה יש בכולן יחד?` : a === 1 ? `קבוצה אחת של ${b}. ציירו בראש.` : `${a} קבוצות של ${b}. ציירו בראש.`,
        solution: b === 0 ? `\`${a} × 0 = 0\`: כפול 0 תמיד נותן 0.` : `\`${a} × ${b} = ${a * b}\`: כפול 1 משאיר את המספר כמו שהוא.`,
        scene: { type: 'groups', item, steps: [
          { text: b === 0 ? `${a} ${box}, ו${each} 0 ${thing}.` : a === 1 ? `רק קבוצה אחת, ובה ${b} ${thing}.` : `${a} ${box}, ו${each} רק 1.`, groups: a, size: b },
          { text: b === 0 ? `${a} קבוצות של 0 הן 0.` : `סופרים: ${skip(a, b)}.`, groups: a, size: b, count: b !== 0, label: `${a} × ${b} = ${a * b}` },
        ] },
      };
    }
    if (kind === 'trick') {
      const c = pick(r, ['double', 'ten', 'order']);
      if (c === 'ten') {
        return {
          q: `כמה זה \`${n} × 10\`?`,
          answer: n * 10,
          hint: 'כל קבוצה של 10 היא עשרת אחת.',
          solution: `${n} קבוצות של 10 הן ${n} עשרות: \`${n * 10}\`.`,
          scene: { type: 'blocks', steps: [
            { text: 'קבוצה של 10 היא עשרת אחת.', tens: 1, label: '1 × 10 = 10' },
            { text: `${n} קבוצות של 10 הן ${n} עשרות.`, tens: n, label: `${n} × 10 = ${n * 10}` },
          ] },
        };
      }
      // double: k × 2 = k + k. order: 2 × big is easier as big + big.
      const big = int(r, 6, 9), ex = c === 'double' ? `${big} × 2` : `2 × ${big}`;
      return {
        q: `כמה זה \`${ex}\`? (טיפ: יש דרך קצרה)`,
        answer: 2 * big,
        hint: `כפול 2 הוא כפליים: \`${big} + ${big}\`.`,
        solution: `${c === 'double' ? `\`${big} × 2 = 2 × ${big}\`, כלומר ` : ''}2 קבוצות של ${big}: \`${big} + ${big} = ${2 * big}\`.`,
        scene: { type: 'groups', steps: [
          ...(c === 'double' ? [{ text: `\`${big} × 2\`: ${big} קבוצות של 2. לספור כך ארוך.`, array: true, groups: big, size: 2, by: 'rows' }] : []),
          { text: `אותן נקודות, בשתי שורות של ${big}.`, array: true, groups: 2, size: big, by: 'rows' },
          { text: `\`${big} + ${big} = ${2 * big}\`.`, array: true, groups: 2, size: big, by: 'rows', count: true, label: `${ex} = ${2 * big}` },
        ] },
      };
    }
    if (kind === 'total') {
      // Half the time the size comes first in the sentence: a common trap.
      const sizeFirst = r() < 0.5;
      return {
        q: sizeFirst
          ? `בכל ${one} יש ${k} ${thing}, ויש ${n} ${box}. כמה ${thing} יש בסך הכול?`
          : `יש ${n} ${box}, ו${each} ${k} ${thing}. כמה ${thing} יש בסך הכול?`,
        answer: T,
        hint: `אפשר לספור בקפיצות של ${k}, פעם אחת לכל קבוצה.`,
        solution: `\`${n} × ${k} = ${plus(n, k)} = ${T}\``,
        scene: { type: 'groups', item, steps: countSteps() },
      };
    }
    if (kind === 'repeated') {
      // 4 + 4 + 4 written as multiplication: pick the right exercise.
      const opts = [`${n} × ${k}`, `${n} + ${k}`, n === k ? `${n} × ${k + 1}` : `${k} + ${k}`];
      return {
        q: `איזה תרגיל כפל מתאים ל־\`${plus(n, k)}\`?`,
        options: opts.map((o) => `\`${o}\``),
        answer: 0,
        hint: `כמה פעמים מופיע ${k}? זה מספר הקבוצות.`,
        solution: `${k} מופיע ${n} פעמים, ולכן זה ${n} קבוצות של ${k}: \`${n} × ${k} = ${T}\`.`,
        scene: { type: 'groups', steps: [
          { text: `\`${plus(n, k)}\`: כל ${k} הוא קבוצה אחת.`, groups: n, size: k },
          { text: `יש ${n} קבוצות. סופרים: ${skip(n, k)}.`, groups: n, size: k, count: true },
          { text: `${n} פעמים ${k} כותבים \`${n} × ${k}\`.`, groups: n, size: k, count: true, label: `${plus(n, k)} = ${n} × ${k}` },
        ] },
      };
    }
    const st = { array: true, groups: n, size: k };
    if (kind === 'array') {
      return {
        q: `כמה ${thing} יש במערך? (${n} שורות, ובכל שורה ${k})`,
        figure: groupsFig(st, item),
        answer: T,
        hint: 'כל שורה היא קבוצה. כמה שורות יש, וכמה בכל שורה?',
        solution: `\`${n} × ${k} = ${T}\``,
        scene: { type: 'groups', item, steps: [
          { text: `במערך ${n} שורות.`, ...st },
          { text: `כל שורה היא קבוצה של ${k}. סופרים שורה אחרי שורה: ${skip(n, k)}.`, ...st, by: 'rows', count: true },
          { text: `${n} שורות של ${k}: \`${n} × ${k} = ${T}\`.`, ...st, by: 'rows', count: true, label: `${n} × ${k} = ${T}` },
        ] },
      };
    }
    // swap: 3 × 4 = 4 × ?
    const m = k === n ? (k === 5 ? 4 : k + 1) : k; // keep the two numbers different
    const sa = { array: true, groups: n, size: m };
    return {
      q: `השלימו: \`${n} × ${m} = ${m} × ?\``,
      answer: n,
      hint: 'במערך אפשר לספור לפי שורות או לפי עמודות. כמה יש בסך הכול?',
      solution: `סדר המספרים בכפל לא משנה: \`${n} × ${m} = ${m} × ${n} = ${n * m}\`.`,
      scene: { type: 'groups', steps: [
        { text: `${n} שורות של ${m}: \`${n} × ${m}\`.`, ...sa, by: 'rows', count: true, label: `${n} × ${m} = ${n * m}` },
        { text: `אותו מערך, אבל סופרים לפי עמודות: ${m} עמודות של ${n}.`, ...sa, by: 'cols', count: true, label: `${m} × ${n} = ${n * m}` },
        { text: `אותן נקודות, אותו סך הכול. לכן \`${n} × ${m} = ${m} × ${n}\`, והתשובה ${n}.`, ...sa, by: 'cols', count: true, label: `${n} × ${m} = ${m} × ${n}` },
      ] },
    };
  },
};

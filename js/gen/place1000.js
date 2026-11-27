// Numbers to 1,000: place value, 100 more / 100 less, comparing.
// Every exercise comes with an animated hundreds-tens-ones solution.
// place-1000 options: ask: digit | build | expand (or a list to mix).
import { int, pick } from './util.js';

const split = (n) => [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];
const blocks = (n, extra = {}) => { const [h, t, o] = split(n); return { hundreds: h, tens: t, ones: o, ...extra }; };
const word = (k, one, many) => (k === 1 ? one : `${k} ${many}`);
const say = (n) => {
  const [h, t, o] = split(n);
  return [h && word(h, 'מאה אחת', 'מאות'), t && word(t, 'עשרת אחת', 'עשרות'), o && word(o, 'יחידה אחת', 'יחידות')].filter(Boolean).join(', ');
};
const expanded = (n) => { const [h, t, o] = split(n); return [h * 100, t * 10, o].filter(Boolean).join(' + '); };

export const place1000 = {
  'place-1000'(r, { ask = ['digit', 'build', 'expand'] }) {
    const kind = Array.isArray(ask) ? pick(r, ask) : ask;
    let n = int(r, 101, 999);
    if (kind === 'build' && r() < 0.5) n = int(r, 1, 9) * 100 + int(r, 1, 9); // a zero in the tens: 305
    const [h, t, o] = split(n);
    const scene = (steps) => ({ type: 'blocks', steps });
    const build = [
      { text: `בונים את ${n}. קודם המאות: ${word(h, 'מאה אחת', 'מאות')}.`, hundreds: h, label: `${h * 100}` },
      { text: t ? `אחר כך העשרות: ${word(t, 'עשרת אחת', 'עשרות')}.` : 'אין עשרות, ולכן במקום העשרות כותבים `0`.', hundreds: h, tens: t, label: `${h * 100 + t * 10}` },
      { text: o ? `ובסוף היחידות: ${word(o, 'יחידה אחת', 'יחידות')}.` : 'אין יחידות, ולכן במקום היחידות כותבים `0`.', ...blocks(n), label: `${expanded(n)} = ${n}` },
    ];

    if (kind === 'digit') {
      const which = pick(r, [0, 1, 2].filter((k) => split(n)[k] !== 0));
      const d = split(n)[which], value = d * [100, 10, 1][which], place = ['המאות', 'העשרות', 'היחידות'][which];
      return {
        q: `במספר ${n}, כמה שווה הספרה ${d} שבמקום ${place}?`,
        answer: value,
        hint: 'מה המקום של הספרה? ספרה במקום המאות שווה מאות, במקום העשרות שווה עשרות.',
        solution: `\`${n} = ${expanded(n)}\`. הספרה ${d} במקום ${place} שווה ${value}.`,
        scene: scene([...build.slice(0, 2), { ...build[2], text: `הספרה ${d} נמצאת במקום ${place}, ולכן היא שווה ${value}.`, label: `${d} → ${value}` }]),
      };
    }
    if (kind === 'build') {
      return {
        q: `איזה מספר זה? ${say(n)}.`,
        answer: n,
        hint: 'כותבים את הספרות לפי הסדר: מאות, עשרות, יחידות. אם חסר משהו, כותבים 0 במקומו.',
        solution: `\`${expanded(n)} = ${n}\``,
        scene: scene(build),
      };
    }
    // expand: 300 + 40 + 7 = ?
    return {
      q: `כמה זה \`${expanded(n)}\`?`,
      answer: n,
      hint: 'כל חלק נכנס למקום משלו: מאות, עשרות, יחידות.',
      solution: `${say(n)}: \`${n}\`.`,
      scene: scene(build),
    };
  },

  'hundred-more-less'(r) {
    const n = int(r, 110, 890), up = r() < 0.5, ans = up ? n + 100 : n - 100;
    const [h] = split(n);
    return {
      q: `כמה זה \`${n} ${up ? '+' : '-'} 100\`?`,
      answer: ans,
      hint: `כש${up ? 'מוסיפים' : 'מורידים'} 100, רק ספרת המאות משתנה.`,
      solution: `\`${n} ${up ? '+' : '-'} 100 = ${ans}\`. ספרת המאות ${up ? 'גדלה' : 'קטנה'} מ־${h} ל־${up ? h + 1 : h - 1}.`,
      scene: { type: 'blocks', steps: [
        { text: `בונים את ${n}.`, ...blocks(n), label: `${n}` },
        { text: up ? 'מוסיפים מאה אחת. העשרות והיחידות לא משתנות.' : 'לוקחים מאה אחת. העשרות והיחידות לא משתנות.', ...blocks(ans), label: `${n} ${up ? '+' : '−'} 100 = ${ans}` },
      ] },
    };
  },

  // Compare two 3-digit numbers: hundreds first, then tens, then ones.
  'compare-1000'(r) {
    const a = int(r, 100, 999);
    // Often share the hundreds digit, so the tens decide.
    const b = r() < 0.5 ? Math.floor(a / 100) * 100 + int(r, 0, 99) : int(r, 100, 999);
    const SIGNS = ['>', '<', '='], ans = a > b ? 0 : a < b ? 1 : 2;
    const [ah, at] = split(a), [bh, bt] = split(b);
    const why = ah !== bh ? `במאות: ${ah} מול ${bh}.` : at !== bt ? `המאות שוות, אז משווים עשרות: ${at} מול ${bt}.` : 'המאות והעשרות שוות, אז משווים יחידות.';
    return {
      q: `איזה סימן מתאים? \`${a} ☐ ${b}\``,
      options: SIGNS, fixed: true, answer: ans,
      hint: 'משווים קודם את המאות. אם הן שוות, משווים עשרות, ואחר כך יחידות.',
      solution: `${why} ולכן \`${a} ${SIGNS[ans]} ${b}\`.`,
    };
  },
};

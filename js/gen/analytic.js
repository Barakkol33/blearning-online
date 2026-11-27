// Points and segments on coordinate axes (grade 10, 4–5 units).
// Types: seg-dist (ask: axis | pyth | root), seg-mid (ask: mid | end),
// seg-use (ask: type | perimeter). `ask` can be a list, to mix kinds.
// Every solution writes the formula, the substitution and the result, as the
// bagrut requires; the animated solution uses the `axes` scene.
import { int, pick } from './util.js';
import { axesFig } from '../scene.js';

const p = (n) => (n < 0 ? `(${n})` : `${n}`);
const pt = (q) => `(${q[0]}, ${q[1]})`;
const m = (s) => String(s).replace(/-/g, '−'); // scene text uses a real minus sign
const kindOf = (r, ask) => (Array.isArray(ask) ? pick(r, ask) : ask);
const half = (v) => v / 2; // midpoints may be .5, written as a decimal

// The visible range: all points, the origin, and one square of margin.
function view(pts) {
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  return { x: [Math.floor(Math.min(0, ...xs)) - 1, Math.ceil(Math.max(0, ...xs)) + 1], y: [Math.floor(Math.min(0, ...ys)) - 1, Math.ceil(Math.max(0, ...ys)) + 1] };
}
const sq = (n) => (Number.isInteger(Math.sqrt(n)) ? String(Math.sqrt(n)) : `√${n}`);
// "√((5 - 1)² + (4 - 1)²) = √(4² + 3²) = √(16 + 9) = √25 = 5"
function distSteps(A, B) {
  const dx = B[0] - A[0], dy = B[1] - A[1], n = dx * dx + dy * dy;
  const tail = Number.isInteger(Math.sqrt(n)) ? ` = √${n} = ${Math.sqrt(n)}` : ` = √${n}`;
  return { dx, dy, n, text: `√((${B[0]} - ${p(A[0])})² + (${B[1]} - ${p(A[1])})²) = √(${p(dx)}² + ${p(dy)}²) = √(${dx * dx} + ${dy * dy})${tail}` };
}
const FORMULA = '`d = √((x₂ - x₁)² + (y₂ - y₁)²)`';

// Two points in a box, B = A + (dx, dy).
function placePair(r, dx, dy) {
  const lo = -6, hi = 8;
  const ax = int(r, Math.max(lo, lo - dx), Math.min(hi, hi - dx));
  const ay = int(r, Math.max(lo, lo - dy), Math.min(hi, hi - dy));
  return [[ax, ay], [ax + dx, ay + dy]];
}
const signed = (r, v) => (r() < 0.5 ? -v : v);

export const analytic = {
  'seg-dist'(r, { ask = ['pyth'] }) {
    const kind = kindOf(r, ask);
    if (kind === 'axis') {
      const flat = r() < 0.5, len = int(r, 3, 9);
      const [A, B] = placePair(r, flat ? signed(r, len) : 0, flat ? 0 : signed(r, len));
      const [i, name] = flat ? [0, 'x'] : [1, 'y'];
      const big = Math.max(A[i], B[i]), small = Math.min(A[i], B[i]);
      return {
        q: `מה אורך הקטע \`AB\`, כאשר \`A${pt(A)}\` ו־\`B${pt(B)}\`?`,
        answer: len,
        hint: `לשתי הנקודות אותו שיעור ${flat ? 'y' : 'x'}. הקטע ${flat ? 'אופקי' : 'אנכי'}: מה ההפרש בין שיעורי ה־${name}?`,
        solution: `לשתי הנקודות אותו שיעור ${flat ? 'y' : 'x'}, ולכן הקטע ${flat ? 'אופקי' : 'אנכי'}, ואורכו הוא ההפרש בין שיעורי ה־${name}: \`AB = ${big} - ${p(small)} = ${len}\`.`,
        scene: { type: 'axes', ...view([A, B]), points: { A, B }, steps: [
          { text: `לשתי הנקודות אותו שיעור ${flat ? 'y' : 'x'}: הקטע ${flat ? 'אופקי' : 'אנכי'}.`, lines: ['AB'] },
          { text: `סופרים משבצות, או מחסרים: \`${big} - ${p(small)} = ${len}\`.`, hot: ['AB'], sides: { AB: String(len) }, label: m(`AB = ${big} - ${p(small)} = ${len}`) },
        ] },
      };
    }
    let dx, dy;
    if (kind === 'root') {
      do { dx = int(r, 1, 6); dy = int(r, 1, 6); } while (Number.isInteger(Math.hypot(dx, dy)));
    } else {
      [dx, dy] = pick(r, [[3, 4], [4, 3], [6, 8], [8, 6], [3, 4], [4, 3]]);
    }
    const [A, B] = placePair(r, signed(r, dx), signed(r, dy));
    const d = distSteps(A, B);
    const res = sq(d.n);
    const scene = { type: 'axes', ...view([A, B]), points: { A, B }, steps: [
      { text: 'מציירים את הקטע. הוא אלכסוני, ולכן הוא יתר של משולש ישר זווית.', lines: ['AB'], label: 'AB = ?' },
      { text: `הניצב האופקי: \`${B[0]} - ${p(A[0])} = ${d.dx}\`. הניצב האנכי: \`${B[1]} - ${p(A[1])} = ${d.dy}\`.`, lines: ['AB'], legs: [{ s: 'AB', dx: m(`Δx = ${d.dx}`), dy: m(`Δy = ${d.dy}`) }] },
      { text: `פיתגורס: \`AB² = ${p(d.dx)}² + ${p(d.dy)}² = ${d.dx * d.dx} + ${d.dy * d.dy} = ${d.n}\`.${d.dx < 0 || d.dy < 0 ? ' ריבוע של מספר שלילי הוא חיובי.' : ''}`, hot: ['AB'], legs: [{ s: 'AB', dx: String(Math.abs(d.dx)), dy: String(Math.abs(d.dy)) }], label: `AB² = ${d.n}` },
      { text: `ולכן \`AB = ${res}\`.`, hot: ['AB'], legs: [{ s: 'AB', dx: String(Math.abs(d.dx)), dy: String(Math.abs(d.dy)) }], sides: { AB: res }, label: `AB = ${res}` },
    ] };
    const common = {
      hint: `ציירו משולש ישר זווית: הניצבים הם \`x₂ - x₁\` ו־\`y₂ - y₁\`. אחר כך פיתגורס: ${FORMULA}.`,
      solution: `לפי נוסחת המרחק ${FORMULA}: \`AB = ${d.text}\`.`,
      scene,
    };
    if (kind === 'root') {
      return { q: `מצאו את אורך הקטע \`AB\`, כאשר \`A${pt(A)}\` ו־\`B${pt(B)}\`. התשובה היא \`√☐\`: מה המספר בתוך השורש?`, answer: d.n, ...common };
    }
    return { q: `מה אורך הקטע \`AB\`, כאשר \`A${pt(A)}\` ו־\`B${pt(B)}\`?`, answer: Math.sqrt(d.n), ...common };
  },

  'seg-mid'(r, { ask = ['mid'] }) {
    const kind = kindOf(r, ask);
    if (kind === 'end') {
      // A and M given; B = 2M − A.
      let A, M, B;
      do {
        A = [int(r, -5, 6), int(r, -5, 6)];
        M = [A[0] + signed(r, int(r, 1, 4)), A[1] + signed(r, int(r, 1, 4))];
        B = [2 * M[0] - A[0], 2 * M[1] - A[1]];
      } while (Math.max(...B.map(Math.abs)) > 9);
      const avg = [half(A[0] + M[0]), half(A[1] + M[1])], back = [2 * A[0] - M[0], 2 * A[1] - M[1]], slip = [2 * M[0] + A[0], 2 * M[1] + A[1]];
      const opts = [pt(B)];
      for (const o of [avg, back, slip].map(pt)) if (!opts.includes(o) && opts.length < 4) opts.push(o);
      const sx = M[0] - A[0], sy = M[1] - A[1], sg = (v) => (v < 0 ? `${v}` : `+${v}`);
      return {
        q: `הנקודה \`M${pt(M)}\` היא אמצע הקטע \`AB\`, ו־\`A${pt(A)}\`. מה השיעורים של \`B\`?`,
        options: opts.map((o) => `\`${o}\``), answer: 0,
        hint: 'כמה זזים מ־`A` ל־`M` בכל ציר? מ־`M` ל־`B` זזים בדיוק אותו דבר.',
        solution: `לפי נוסחת האמצע, \`(${p(A[0])} + x_B) / 2 = ${M[0]}\`, ולכן \`x_B = 2 · ${p(M[0])} - ${p(A[0])} = ${B[0]}\`. באותו אופן \`y_B = 2 · ${p(M[1])} - ${p(A[1])} = ${B[1]}\`. כלומר \`B${pt(B)}\`. (\`${pt(avg)}\` הוא האמצע של \`A\` ו־\`M\`, לא הקצה.)`,
        scene: { type: 'axes', ...view([A, M, B]), points: { A, M }, steps: [
          { text: 'נתונים `A` והאמצע `M`. איפה `B`?', lines: ['AM'] },
          { text: `הצעד מ־\`A\` ל־\`M\`: \`${sg(sx)}\` ב־x ו־\`${sg(sy)}\` ב־y.`, lines: ['AM'], legs: [{ s: 'AM', dx: m(sg(sx)), dy: m(sg(sy)) }] },
          { text: `\`M\` באמצע, ולכן מ־\`M\` ל־\`B\` זזים שוב אותו צעד.`, at: { B }, lines: ['AM', 'MB'], legs: [{ s: 'AM', dx: m(sg(sx)), dy: m(sg(sy)) }, { s: 'MB', dx: m(sg(sx)), dy: m(sg(sy)) }] },
          { text: `בדיקה: \`AM = MB\`, ו־\`B${pt(B)}\`.`, at: { B }, hot: ['AB'], marks: ['AM', 'MB'], label: m(`B${pt(B)}`) },
        ] },
      };
    }
    let A, B;
    do { A = [int(r, -6, 8), int(r, -6, 8)]; B = [int(r, -6, 8), int(r, -6, 8)]; } while (A[0] === B[0] || A[1] === B[1] || Math.hypot(A[0] - B[0], A[1] - B[1]) < 4);
    const M = [half(A[0] + B[0]), half(A[1] + B[1])];
    const wrong = [half(B[0] - A[0]), half(B[1] - A[1])];
    return {
      q: `מצאו את אמצע הקטע \`AB\`, כאשר \`A${pt(A)}\` ו־\`B${pt(B)}\`. כתבו \`(x, y)\`.`,
      answer: pt(M), point: true,
      hint: 'האמצע הוא ממוצע: מחברים את שני שיעורי ה־x ומחלקים ב־2, ואותו דבר ל־y.',
      solution: `לפי נוסחת האמצע \`M = ((x₁ + x₂) / 2, (y₁ + y₂) / 2)\`: \`x_M = (${A[0]} + ${p(B[0])}) / 2 = ${A[0] + B[0]} / 2 = ${M[0]}\`, \`y_M = (${A[1]} + ${p(B[1])}) / 2 = ${A[1] + B[1]} / 2 = ${M[1]}\`. כלומר \`M${pt(M)}\`. (חצי ההפרש, \`${pt(wrong)}\`, הוא לא האמצע.)`,
      scene: { type: 'axes', ...view([A, B]), points: { A, B }, steps: [
        { text: 'מציירים את הקטע `AB`.', lines: ['AB'], label: 'M = ?' },
        { text: `על ציר ה־x: האמצע בין \`${A[0]}\` ל־\`${B[0]}\` הוא הממוצע, \`(${A[0]} + ${p(B[0])}) / 2 = ${M[0]}\`. על ציר ה־y: \`(${A[1]} + ${p(B[1])}) / 2 = ${M[1]}\`.`, lines: ['AB'], proj: ['A', 'B'], coords: true },
        { text: `האמצע הוא \`M${pt(M)}\`.`, at: { M }, lines: ['AB'], proj: ['M'], label: m(`M${pt(M)}`) },
        { text: 'בדיקה: `M` על הקטע, ו־`AM = MB`.', at: { M }, lines: ['AB'], marks: ['AM', 'MB'] },
      ] },
    };
  },

  'seg-use'(r, { ask = ['type'] }) {
    const kind = kindOf(r, ask);
    if (kind === 'perimeter') {
      const [t, h] = pick(r, [[3, 4], [4, 3], [6, 8], [8, 6]]), c = Math.hypot(t, h);
      const tri = r() < 0.4;
      if (tri) {
        const A = [int(r, -4, 1), int(r, -3, 1)], B = [A[0] + t, A[1]], C = [A[0], A[1] + h];
        const P = t + h + c;
        return {
          q: `מה ההיקף של המשולש \`ABC\`, כאשר \`A${pt(A)}\`, \`B${pt(B)}\` ו־\`C${pt(C)}\`?`,
          answer: P,
          figure: axesFig({ ...view([A, B, C]), points: { A, B, C } }, { lines: ['AB', 'BC', 'CA'] }),
          hint: '`AB` אופקי ו־`AC` אנכי: סופרים משבצות. את `BC` מוצאים בנוסחת המרחק.',
          solution: `\`AB = ${B[0]} - ${p(A[0])} = ${t}\` (אופקי), \`AC = ${C[1]} - ${p(A[1])} = ${h}\` (אנכי), \`BC = ${distSteps(B, C).text}\`. ההיקף: \`${t} + ${h} + ${c} = ${P}\`.`,
          scene: { type: 'axes', ...view([A, B, C]), points: { A, B, C }, steps: [
            { text: '`AB` אופקי ו־`AC` אנכי: את האורך שלהם סופרים.', lines: ['AB', 'BC', 'CA'], sides: { AB: String(t), CA: String(h) }, right: ['BAC'] },
            { text: `‏\`BC\` אלכסוני: \`√(${t}² + ${h}²) = √${c * c} = ${c}\`.`, lines: ['AB', 'CA'], hot: ['BC'], sides: { AB: String(t), CA: String(h), BC: String(c) } },
            { text: `ההיקף הוא סכום הצלעות: \`${t} + ${h} + ${c} = ${P}\`.`, fill: ['ABC'], lines: ['AB', 'BC', 'CA'], sides: { AB: String(t), CA: String(h), BC: String(c) }, label: `P = ${P}` },
          ] },
        };
      }
      const w = t + int(r, 1, 4), A = [int(r, -4, 0), int(r, -3, 1)];
      const B = [A[0] + w, A[1]], C = [A[0] + w, A[1] + h], D = [A[0] + t, A[1] + h];
      const P = w + h + (w - t) + c;
      return {
        q: `מה ההיקף של המרובע \`ABCD\`, כאשר \`A${pt(A)}\`, \`B${pt(B)}\`, \`C${pt(C)}\` ו־\`D${pt(D)}\`?`,
        answer: P,
        figure: axesFig({ ...view([A, B, C, D]), points: { A, B, C, D } }, { lines: ['AB', 'BC', 'CD', 'DA'] }),
        hint: 'שלוש צלעות הן אופקיות או אנכיות: סופרים. את הרביעית, `DA`, מוצאים בנוסחת המרחק.',
        solution: `\`AB = ${w}\`, \`BC = ${h}\`, \`CD = ${C[0]} - ${p(D[0])} = ${w - t}\` (אופקיות ואנכיות), \`DA = ${distSteps(A, D).text}\`. ההיקף: \`${w} + ${h} + ${w - t} + ${c} = ${P}\`.`,
        scene: { type: 'axes', ...view([A, B, C, D]), points: { A, B, C, D }, coords: false, steps: [
          { text: 'שלוש צלעות ישרות לאורך המשבצות: סופרים.', lines: ['AB', 'BC', 'CD', 'DA'], sides: { AB: String(w), BC: String(h), CD: String(w - t) } },
          { text: `‏\`DA\` אלכסונית: משולש עם ניצבים ${t} ו־${h}, ולכן \`DA = √(${t * t} + ${h * h}) = ${c}\`.`, lines: ['AB', 'BC', 'CD'], hot: ['AD'], sides: { AB: String(w), BC: String(h), CD: String(w - t), DA: String(c) } },
          { text: `ההיקף: \`${w} + ${h} + ${w - t} + ${c} = ${P}\`.`, fill: ['ABCD'], lines: ['AB', 'BC', 'CD', 'DA'], sides: { AB: String(w), BC: String(h), CD: String(w - t), DA: String(c) }, label: `P = ${P}` },
        ] },
      };
    }
    // Triangle type from the squared side lengths. B is the apex.
    const t = pick(r, ['iso', 'right', 'rightiso', 'scalene']);
    let a, b, A, B, C;
    for (;;) {
      a = int(r, 1, 4); b = int(r, 1, 4);
      const u = [a, b];
      const v = t === 'iso' ? [b, a] : t === 'rightiso' ? [-b, a] : t === 'right' ? [-2 * b, 2 * a] : [int(r, -4, 4), int(r, -4, 4)];
      B = [int(r, -3, 3), int(r, -3, 2)]; A = [B[0] + u[0], B[1] + u[1]]; C = [B[0] + v[0], B[1] + v[1]];
      const all = [A, B, C].flat();
      if (Math.max(...all.map(Math.abs)) > 8) continue;
      const cross = u[0] * v[1] - u[1] * v[0];
      if (cross === 0) continue; // on one line: not a triangle
      const s2 = [u[0] ** 2 + u[1] ** 2, v[0] ** 2 + v[1] ** 2, (u[0] - v[0]) ** 2 + (u[1] - v[1]) ** 2];
      const iso = s2[0] === s2[1] || s2[1] === s2[2] || s2[0] === s2[2];
      const sorted = [...s2].sort((x, y) => x - y), right = sorted[0] + sorted[1] === sorted[2];
      const got = right && iso ? 'rightiso' : right ? 'right' : iso ? 'iso' : 'scalene';
      if (got === t) break;
    }
    const s2 = { AB: (A[0] - B[0]) ** 2 + (A[1] - B[1]) ** 2, BC: (B[0] - C[0]) ** 2 + (B[1] - C[1]) ** 2, AC: (A[0] - C[0]) ** 2 + (A[1] - C[1]) ** 2 };
    const line = (n, P, Q) => `\`${n}² = (${Q[0]} - ${p(P[0])})² + (${Q[1]} - ${p(P[1])})² = ${s2[n]}\``;
    const names = Object.keys(s2), eq = [];
    for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) if (s2[names[i]] === s2[names[j]]) eq.push([names[i], names[j]]);
    const big = names.reduce((x, y) => (s2[y] > s2[x] ? y : x));
    const others = names.filter((n) => n !== big);
    const isRight = s2[others[0]] + s2[others[1]] === s2[big];
    const vertex = [...'ABC'].find((ch) => !big.includes(ch));
    const angle = big[0] + vertex + big[1];
    const OPTS = ['שווה שוקיים (ולא ישר זווית)', 'ישר זווית (ולא שווה שוקיים)', 'ישר זווית ושווה שוקיים', 'שונה צלעות ולא ישר זווית'];
    const ans = { iso: 0, right: 1, rightiso: 2, scalene: 3 }[t];
    const concl = [
      eq.length ? `\`${eq[0][0]} = ${eq[0][1]}\`, ולכן המשולש שווה שוקיים.` : 'אין שתי צלעות שוות.',
      isRight ? `\`${s2[others[0]]} + ${s2[others[1]]} = ${s2[big]}\`, ולכן לפי המשפט ההפוך לפיתגורס הזווית \`${vertex}\` ישרה.` : `\`${s2[others[0]]} + ${s2[others[1]]} ≠ ${s2[big]}\`, ולכן המשולש לא ישר זווית.`,
    ].join(' ');
    return {
      q: `מה סוג המשולש \`ABC\`, כאשר \`A${pt(A)}\`, \`B${pt(B)}\` ו־\`C${pt(C)}\`?`,
      options: OPTS, fixed: true, answer: ans,
      figure: axesFig({ ...view([A, B, C]), points: { A, B, C } }, { lines: ['AB', 'BC', 'CA'] }),
      hint: 'חשבו את הריבועים של שלוש הצלעות (בלי שורש). יש שניים שווים? והאם סכום שני הקטנים שווה לגדול?',
      solution: `${line('AB', A, B)}, ${line('BC', B, C)}, ${line('AC', A, C)}. ${concl}`,
      scene: { type: 'axes', ...view([A, B, C]), points: { A, B, C }, steps: [
        { text: 'מחשבים את הריבוע של כל צלע בנוסחת המרחק, בלי שורש.', lines: ['AB', 'BC', 'CA'], sides: { AB: `AB²=${s2.AB}`, BC: `BC²=${s2.BC}`, CA: `AC²=${s2.AC}` }, label: 'AB², BC², AC²' },
        { text: eq.length ? `\`${eq[0][0]}² = ${eq[0][1]}²\`, ולכן \`${eq[0][0]} = ${eq[0][1]}\`: שווה שוקיים.` : 'שלושה ריבועים שונים: אין צלעות שוות.', lines: ['AB', 'BC', 'CA'], marks: eq.length ? eq[0] : [], sides: { AB: `AB²=${s2.AB}`, BC: `BC²=${s2.BC}`, CA: `AC²=${s2.AC}` } },
        { text: isRight ? `\`${s2[others[0]]} + ${s2[others[1]]} = ${s2[big]}\`: הזווית \`${vertex}\` ישרה.` : `\`${s2[others[0]]} + ${s2[others[1]]} ≠ ${s2[big]}\`: אין זווית ישרה.`, fill: ['ABC'], lines: ['AB', 'BC', 'CA'], marks: eq.length ? eq[0] : [], right: isRight ? [angle] : [], sides: { AB: `AB²=${s2.AB}`, BC: `BC²=${s2.BC}`, CA: `AC²=${s2.AC}` }, label: OPTS[ans].replace(/ \(.*\)/, '') },
      ] },
    };
  },
};

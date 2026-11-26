// One question, with instant feedback. Used by the lesson quiz and the feed.
// Supports the quizplay "mcq" and "truefalse" formats.
import { h, esc, fmt, fmtOpt, shuffle } from './util.js';

export function questionEl(q, onAnswer) {
  const box = h('div', 'q');
  let prompt, opts;
  if (q.type === 'mcq') {
    prompt = q.question;
    opts = shuffle(q.options.map((o, i) => ({ o, ok: i === q.answer })));
  } else if (q.type === 'truefalse') {
    prompt = q.statement;
    opts = [{ o: '✔ נכון', ok: q.answer === true }, { o: '✘ לא נכון', ok: q.answer === false }];
    box.classList.add('tf');
  } else {
    box.innerHTML = `<p class="notice">סוג שאלה שעוד לא נתמך כאן: ${esc(q.type)}</p>`;
    return box;
  }

  box.innerHTML = `<p class="q-prompt">${fmt(prompt)}</p><div class="q-opts"></div><p class="q-expl" hidden></p>`;
  const wrap = box.querySelector('.q-opts');
  const expl = box.querySelector('.q-expl');
  let done = false;

  const btns = opts.map((op) => {
    const b = h('button', 'opt', fmtOpt(op.o));
    b.onclick = () => pick(op, b);
    wrap.append(b);
    return [op, b];
  });

  function pick(op, b) {
    if (done) return;
    done = true;
    for (const [o, bb] of btns) {
      bb.disabled = true;
      if (o.ok) bb.classList.add('right');
    }
    if (!op.ok) b.classList.add('wrong');
    box.classList.add(op.ok ? 'is-right' : 'is-wrong');
    expl.hidden = false;
    expl.innerHTML = (op.ok ? '<b>✔ נכון!</b> ' : '<b>✘ לא בדיוק.</b> ') + fmt(q.explanation || '');
    onAnswer?.(op.ok);
  }

  // For swipe gestures on true/false: answer(true) = "נכון".
  box.answer = (val) => {
    if (q.type !== 'truefalse') return;
    const [op, b] = btns[val ? 0 : 1];
    pick(op, b);
  };
  return box;
}

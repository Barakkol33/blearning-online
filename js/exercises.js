// Exercises page: a long, checkable list per course.
// Sections are either generated (fresh every time, from a seed in the URL)
// or written by hand. Every exercise can have a hint and a full solution.
// Later: "steps" (guided sub-questions) for hard high-school problems.
import { h, esc, fmt, fmtOpt, shuffle } from './util.js';
import { getJSON } from './content.js';
import { GENERATORS, rng } from './generators.js';
import { store } from './store.js';
import { stuckButton } from './help.js';
import { award } from './game.js';
import { sceneWidget } from './scene.js';

const norm = (s) => String(s).replace(/[−–]/g, '-').replace(/,/g, '.').replace(/[\s°%]/g, '');

function isRight(it, typed) {
  const t = norm(typed);
  if (t === '') return null;
  const accepted = Array.isArray(it.answer) ? it.answer : [it.answer];
  return accepted.some((a) =>
    typeof a === 'number' ? t !== '' && !isNaN(Number(t)) && Math.abs(Number(t) - a) < 1e-9 : norm(a) === t,
  );
}

export async function exercisesPage(app, c, seed) {
  const ex = await getJSON(c.base + c.exercises);
  const r = rng(seed);
  const sections = ex.sections.map((sec) => {
    if (!sec.generate) return { ...sec, items: sec.items || [] };
    const g = GENERATORS[sec.generate.type];
    if (!g) return { ...sec, items: [], error: `מחולל לא מוכר: ${sec.generate.type}` };
    return { ...sec, items: Array.from({ length: sec.generate.count || 8 }, () => g(r, sec.generate)) };
  });
  const total = sections.reduce((t, s) => t + s.items.length, 0);

  app.innerHTML = `
    <nav class="crumbs"><a href="#/">כל הקורסים</a> › <a href="#/c/${c.id}">${esc(c.title)}</a> › תרגול</nav>
    <section class="ex-head">
      <h1>✏️ תרגול: ${esc(c.title)}</h1>
      <p class="muted">${total} תרגילים. כתבו תשובה ולחצו "בדיקה". נתקעתם? יש רמז, ואפשר גם לראות פתרון.</p>
      <div class="toolbar">
        <a class="btn ghost small" href="#/c/${c.id}/ex?s=${(Math.random() * 1e9) | 0}">🔄 תרגילים חדשים</a>
        <button class="btn ghost small" data-act="link">🔗 קישור לאותם תרגילים</button>
        <button class="btn ghost small" data-act="print">🖨 דף עבודה להדפסה</button>
      </div>
    </section>
    <div class="ex-score g-light"><span class="sc"></span><div class="meter"><i></i></div></div>
    <div class="ex-list"></div>`;

  const list = app.querySelector('.ex-list');
  const sc = app.querySelector('.ex-score .sc');
  const bar = app.querySelector('.ex-score i');
  let solved = 0;
  const upd = () => {
    sc.textContent = `פתרתם ${solved} מתוך ${total}`;
    bar.style.width = `${(solved / total) * 100}%`;
    const best = store.lesson(c.id, '__ex').best || 0;
    if (solved > best) store.setLesson(c.id, '__ex', { best: solved, total });
  };
  upd();

  let n = 0;
  for (const sec of sections) {
    list.append(h('h2', 'ex-sec', esc(sec.title)));
    if (sec.error) list.append(h('div', 'notice', esc(sec.error)));
    for (const it of sec.items) {
      list.append(exerciseEl(it, ++n, () => { solved++; upd(); }, c));
    }
  }

  app.querySelector('.toolbar').onclick = (e) => {
    const act = e.target.dataset.act;
    if (act === 'print') window.print();
    if (act === 'link') {
      navigator.clipboard?.writeText(location.href).then(() => (e.target.textContent = '✔ הקישור הועתק'), () => {});
    }
  };
}

function exerciseEl(it, n, onSolved, c) {
  const el = h('div', 'ex');
  el.innerHTML = `
    <div class="ex-n">${n}</div>
    <div class="ex-body">
      <p class="q-prompt">${fmt(it.q)}</p>
      ${it.figure || ''}
      <div class="ex-ans"></div>
      <p class="ex-fb" hidden></p>
      <div class="ex-tools"></div>
      <div class="ex-hint" hidden></div>
      <div class="ex-sol" hidden></div>
    </div>`;
  const ans = el.querySelector('.ex-ans');
  const fb = el.querySelector('.ex-fb');
  const tools = el.querySelector('.ex-tools');
  const hintBox = el.querySelector('.ex-hint');
  const solBox = el.querySelector('.ex-sol');
  let done = false, revealed = false, misses = 0, stuckShown = false;

  const finish = (ok) => {
    if (ok) {
      done = true;
      el.classList.add('ok');
      fb.hidden = false;
      fb.innerHTML = '<b>✔ נכון!</b>';
      ans.querySelectorAll('input,button').forEach((x) => (x.disabled = true));
      if (!revealed) {
        onSolved();
        award('exercise', { firstTry: misses === 0, misses });
      }
      return;
    }
    misses++;
    award('miss');
    fb.hidden = false;
    fb.innerHTML = '<b>✘ לא בדיוק.</b> נסו שוב.' + (misses >= 2 && it.hint && hintBox.hidden ? ' אולי הרמז יעזור.' : '');
    if (misses >= 3 && !stuckShown) {
      stuckShown = true;
      tools.append(stuckButton({ course: c.id, lesson: '__ex', lessonTitle: `תרגול: ${c.title}`, where: `תרגיל ${n}`, text: it.q }));
    }
  };

  if (it.options) {
    const row = h('div', 'q-opts');
    // Shuffle so the right answer isn't always first; "fixed": true keeps the
    // author's order (e.g. the signs > < =).
    const idx = it.options.map((_, i) => i);
    (it.fixed ? idx : shuffle(idx)).forEach((i) => {
      const o = it.options[i];
      const b = h('button', 'opt', fmtOpt(o));
      b.onclick = () => {
        if (done) return;
        const ok = i === it.answer;
        b.classList.add(ok ? 'right' : 'wrong');
        if (!ok) b.disabled = true;
        finish(ok);
      };
      row.append(b);
    });
    ans.append(row);
  } else {
    const form = h('form', 'ex-form');
    form.innerHTML = `<input type="text" inputmode="decimal" autocomplete="off" dir="ltr" aria-label="תשובה">
      ${it.unit ? `<span class="unit">${esc(it.unit)}</span>` : ''}<button class="btn small">בדיקה</button>`;
    const input = form.querySelector('input');
    form.onsubmit = (e) => {
      e.preventDefault();
      if (done) return;
      const ok = isRight(it, input.value);
      if (ok === null) return input.focus();
      input.classList.toggle('bad', !ok);
      finish(ok);
    };
    ans.append(form);
  }

  if (it.hint) {
    const b = h('button', 'btn ghost small', '💡 רמז');
    b.onclick = () => { hintBox.hidden = false; hintBox.innerHTML = '💡 ' + fmt(it.hint); b.disabled = true; };
    tools.append(b);
  }
  const s = h('button', 'btn ghost small', '👁 הצג פתרון');
  s.onclick = () => {
    if (!done) revealed = true;
    const shown = it.options ? it.options[it.answer] : Array.isArray(it.answer) ? it.answer[0] : it.answer;
    solBox.hidden = false;
    solBox.innerHTML = `<b>התשובה: <bdi dir="ltr">${esc(shown)}${esc(it.unit || '')}</bdi></b>` + (it.solution ? `<br>${fmt(it.solution)}` : '');
    // A worked solution can be an animated scene: step through the reasoning.
    if (it.scene) solBox.append(sceneWidget(it.scene));
    s.disabled = true;
  };
  tools.append(s);
  return el;
}

// "Feed mode": a TikTok-style vertical swipe through a course.
// Built from the same files as the lessons: every scene step becomes an
// explanation card, every question a question card. Wrong answers come back
// a few cards later. A small daily goal gives a natural place to stop.
import { h, esc, fmt, shuffle } from './util.js';
import { getText, lessonQuestions, scenesIn } from './content.js';
import { makeScene, resolveSteps } from './scene.js';
import { questionEl } from './quiz.js';
import { store, FEED_GOAL } from './store.js';
import { stuckButton } from './help.js';

export async function feedView(root, c) {
  const cards = [];
  for (const [n, L] of c.lessons.entries()) {
    cards.push({ kind: 'title', n, L });
    const md = await getText(c.base + L.file);
    for (const spec of scenesIn(md)) {
      if (!makeScene(spec)) continue;
      const states = resolveSteps(spec);
      states.forEach((_, i) => cards.push({ kind: 'scene', spec, states, i }));
    }
    for (const q of shuffle(await lessonQuestions(c, L)).slice(0, 4)) cards.push({ kind: 'q', q, L });
  }
  cards.push({ kind: 'end' });

  root.innerHTML = `
    <div class="feed-top">
      <a class="x" href="#/c/${c.id}" aria-label="סגירה">✕</a>
      <div class="feed-prog"><i></i></div>
      <span class="goal"></span>
    </div>
    <div class="feed"></div>`;
  const feed = root.querySelector('.feed');
  const bar = root.querySelector('.feed-prog i');
  const goal = root.querySelector('.goal');

  const updGoal = () => {
    const f = store.feedToday();
    goal.textContent = `🎯 ${Math.min(f.count, FEED_GOAL)}/${FEED_GOAL}` + (f.streak > 1 ? ` · 🔥 ${f.streak}` : '');
  };
  updGoal();

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.onShow?.();
        const kids = [...feed.children];
        bar.style.width = `${((kids.indexOf(e.target) + 1) / kids.length) * 100}%`;
      }
    },
    { root: feed, threshold: 0.6 },
  );

  let endCard;
  const add = (el, before) => {
    feed.insertBefore(el, before || null);
    io.observe(el);
  };

  function makeCard(cd) {
    const el = h('section', `fcard ${cd.kind}`);
    if (cd.kind === 'title') {
      el.innerHTML = `<div class="big">${c.emoji || '📘'}</div>
        <p class="muted">שיעור ${cd.n + 1} מתוך ${c.lessons.length}</p>
        <h2>${esc(cd.L.title)}</h2>
        <p class="hint">החליקו למעלה ↑</p>`;
    } else if (cd.kind === 'scene') {
      const nl = makeScene(cd.spec);
      const st = cd.states[cd.i];
      el.append(nl.svg, h('p', 'fcap', fmt(st.text)), h('p', 'muted small', `${cd.i + 1} / ${cd.states.length}`));
      el.onShow = () => {
        const prev = cd.states[cd.i - 1];
        nl.draw(prev || { marker: null }, null);
        setTimeout(() => nl.draw(st, prev || {}), 250);
      };
    } else if (cd.kind === 'q') {
      el.append(h('p', 'qtag', cd.again ? '🔁 עוד פעם' : '❓ שאלה'));
      const qEl = questionEl(cd.q, (ok) => {
        store.bumpFeed();
        updGoal();
        if (ok) {
          el.append(h('p', 'hint', 'יופי! החליקו להמשך ↑'));
        } else {
          el.append(h('p', 'hint', 'לא נורא — השאלה תחזור עוד מעט. ↑'));
          el.append(stuckButton({ course: c.id, lesson: cd.L.id, lessonTitle: cd.L.title, where: 'שאלה בפיד', text: cd.q.question || cd.q.statement }));
          const kids = [...feed.children];
          const at = Math.min(kids.indexOf(el) + 4, kids.indexOf(endCard));
          add(makeCard({ kind: 'q', q: cd.q, L: cd.L, again: true }), kids[at]);
        }
      });
      el.append(qEl);
      if (cd.q.type === 'truefalse') {
        el.append(h('p', 'muted small', 'אפשר גם להחליק: ימינה = נכון, שמאלה = לא נכון'));
        el.style.touchAction = 'pan-y';
        let x0 = 0, y0 = 0;
        el.addEventListener('pointerdown', (e) => { x0 = e.clientX; y0 = e.clientY; });
        el.addEventListener('pointerup', (e) => {
          const dx = e.clientX - x0, dy = e.clientY - y0;
          if (Math.abs(dx) > 70 && Math.abs(dy) < 60) qEl.answer(dx > 0);
        });
      }
    } else {
      el.innerHTML = `<div class="big">🎉</div><h2>סיימתם את הפיד!</h2>
        <p>רוצים להעמיק? בשיעור המלא יש עוד הסברים ותרגול.</p>
        <div class="row"><a class="btn" href="#/c/${c.id}">לקורס המלא</a>
        <button class="btn ghost again">↺ שוב מההתחלה</button></div>`;
      el.querySelector('.again').onclick = () => feed.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return el;
  }

  for (const cd of cards) {
    const el = makeCard(cd);
    if (cd.kind === 'end') endCard = el;
    add(el);
  }

  const onKey = (e) => {
    const dir = { ArrowDown: 1, PageDown: 1, ' ': 1, ArrowUp: -1, PageUp: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    feed.scrollBy({ top: dir * feed.clientHeight, behavior: 'smooth' });
  };
  addEventListener('keydown', onKey);
  return () => { removeEventListener('keydown', onKey); io.disconnect(); };
}

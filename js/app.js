import { marked } from 'https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.esm.js';
import { h, esc, fmt } from './util.js';
import { catalog, loadCourse, getJSON, getText, lessonQuestions, parseScene } from './content.js';
import { sceneWidget, sceneFrames } from './scene.js';
import { questionEl } from './quiz.js';
import { feedView } from './feed.js';
import { exercisesPage } from './exercises.js';
import { award, celebrate, applyMode, mePage } from './game.js';
import { store } from './store.js';
import { shuffle } from './util.js';
import { stuckButton, stuckList } from './help.js';

const stuckCtx = (c, L, where, text) => ({ course: c.id, lesson: L.id, lessonTitle: L.title, where, text });

// ```scene blocks in lesson Markdown become animated scenes.
marked.use({
  renderer: {
    code(code, lang) {
      const text = typeof code === 'object' ? code.text : code;
      const l = typeof code === 'object' ? code.lang : lang;
      if (l === 'scene') return `<div class="scene-slot" data-src="${encodeURIComponent(text)}"></div>`;
      return false;
    },
  },
});

const app = document.getElementById('app');
let cleanup = null;
let subjectFilter = 'all';

const minutes = (c) => c.lessons.reduce((t, l) => t + (l.minutes || 0), 0);
const subjectOf = (cat, id) => cat.subjects.find((s) => s.id === id) || { title: id, emoji: '' };

// ---------- home: course catalog ----------
async function home() {
  const cat = await catalog();
  const courses = await Promise.all(cat.courses.map((e) => (e.status === 'soon' ? e : loadCourse(e.id))));

  app.innerHTML = `
    <section class="hero">
      <h1>לומדים, בקצב שלכם</h1>
      <p>קורסים, הסברים מונפשים ומשחקים — חינם, בעברית, בלי הרשמה.</p>
    </section>
    <a class="map-banner" href="#/math">
      <span class="big">🗺️</span>
      <span><b>מפת המתמטיקה</b><br><span class="muted">כל הנושאים מכיתה א׳ ועד י״ב, במקום אחד</span></span>
      <span class="go">←</span>
    </a>
    <div class="chips"></div>
    <div class="grid"></div>
    <section class="backup">
      <span>💾 ההתקדמות נשמרת בדפדפן הזה בלבד.</span>
      <button class="btn ghost small" data-act="export">ייצוא קוד התקדמות</button>
      <button class="btn ghost small" data-act="import">ייבוא</button>
    </section>`;

  const chips = app.querySelector('.chips');
  const grid = app.querySelector('.grid');
  const renderGrid = () => {
    chips.innerHTML = [{ id: 'all', title: 'הכל', emoji: '✨' }, ...cat.subjects]
      .map((s) => `<button class="chip ${s.id === subjectFilter ? 'on' : ''}" data-s="${s.id}">${s.emoji} ${esc(s.title)}</button>`)
      .join('');
    grid.innerHTML = courses
      .filter((c) => subjectFilter === 'all' || c.subject === subjectFilter)
      .map((c) => card(cat, c))
      .join('');
  };
  chips.onclick = (e) => {
    const b = e.target.closest('[data-s]');
    if (b) { subjectFilter = b.dataset.s; renderGrid(); }
  };
  renderGrid();
  const mine = stuckList();
  if (mine) app.querySelector('.backup').before(mine);

  app.querySelector('.backup').onclick = (e) => {
    const act = e.target.dataset.act;
    if (act === 'export') {
      const code = store.exportCode();
      navigator.clipboard?.writeText(code).catch(() => {});
      prompt('הקוד הועתק. שמרו אותו, והדביקו אותו במכשיר אחר בלחיצה על "ייבוא":', code);
    } else if (act === 'import') {
      const code = prompt('הדביקו כאן קוד התקדמות:');
      if (!code) return;
      try { store.importCode(code); route(); } catch { alert('הקוד לא תקין'); }
    }
  };
}

function card(cat, c) {
  const s = subjectOf(cat, c.subject);
  const meta = `${s.emoji} ${esc(s.title)} · ${esc(c.grade || '')}`;
  if (c.status === 'soon') {
    return `<div class="card soon" style="--c:${c.color}">
      <div class="cover"><span>${c.emoji}</span><b class="badge">בקרוב</b></div>
      <div class="card-body"><div class="meta">${meta}</div><h3>${esc(c.title)}</h3><p>${esc(c.description)}</p></div>
    </div>`;
  }
  const done = store.doneCount(c);
  return `<a class="card" href="#/c/${c.id}" style="--c:${c.color}">
    <div class="cover"><span>${c.emoji}</span></div>
    <div class="card-body">
      <div class="meta">${meta}</div>
      <h3>${esc(c.title)}</h3>
      <p>${esc(c.description)}</p>
      <div class="card-foot">
        <span>${c.lessons.length} שיעורים · ${minutes(c)} דק׳</span>
        ${done ? `<span>${done}/${c.lessons.length} ✔</span>` : ''}
      </div>
      <div class="meter"><i style="width:${(done / c.lessons.length) * 100}%"></i></div>
    </div>
  </a>`;
}

// ---------- math map: every topic, grade 1 to 12 ----------
let strandFilter = 'all';
async function mathMap() {
  const [map, cat] = await Promise.all([getJSON('content/math-map.json'), catalog()]);
  const live = new Map();
  await Promise.all(
    cat.courses.filter((e) => e.status !== 'soon').map(async (e) => live.set(e.id, await loadCourse(e.id))),
  );
  const strands = Object.fromEntries(map.strands.map((s) => [s.id, s]));
  const all = map.stages.flatMap((s) => s.topics);
  const liveN = all.filter((t) => live.has(t.id)).length;

  const tile = (t) => {
    const s = strands[t.strand] || {};
    const c = live.get(t.id);
    if (!c) {
      return `<div class="topic" style="--c:${s.color}" data-strand="${t.strand}" title="בקרוב">
        <span class="te">${s.emoji || ''}</span><span>${esc(t.title)}</span></div>`;
    }
    const done = store.doneCount(c);
    return `<a class="topic live" href="#/c/${t.id}" style="--c:${s.color}" data-strand="${t.strand}">
      <span class="te">${s.emoji || ''}</span><span>${esc(t.title)}</span>
      <span class="ts">${done ? `${done}/${c.lessons.length} ✔` : 'זמין ←'}</span></a>`;
  };

  let band = '';
  const sections = map.stages
    .map((st) => {
      const head = st.band !== band ? `<h2 class="band">${esc((band = st.band))}</h2>` : '';
      return `${head}<section class="stage" id="${st.id}">
        <h3>${esc(st.title)} <span class="muted small">· ${st.topics.length} נושאים</span></h3>
        <div class="topics">${st.topics.map(tile).join('')}</div>
      </section>`;
    })
    .join('');

  app.innerHTML = `
    <nav class="crumbs"><a href="#/">כל הקורסים</a> ›</nav>
    <section class="hero">
      <h1>🗺️ מפת המתמטיקה</h1>
      <p>כל המתמטיקה של בית הספר, מכיתה א׳ ועד י״ב: ${all.length} נושאים. ${liveN} כבר זמינים, והשאר בדרך.</p>
    </section>
    <div class="jump">${map.stages.map((s) => `<a href="#/math" data-jump="${s.id}">${esc(s.title.replace('תיכון: ', ''))}</a>`).join('')}</div>
    <div class="chips strands"></div>
    <div class="map">${sections}</div>
    <p class="muted small">השיבוץ לכיתות הוא הערכה, ויכול להשתנות בין בתי ספר. כל נושא שמסומן "זמין" הוא קורס מלא עם שיעורים, הנפשות ותרגול.</p>`;

  const chips = app.querySelector('.strands');
  const paint = () => {
    chips.innerHTML = [{ id: 'all', title: 'כל התחומים', emoji: '✨' }, ...map.strands]
      .map((s) => `<button class="chip ${s.id === strandFilter ? 'on' : ''}" data-s="${s.id}">${s.emoji} ${esc(s.title)}</button>`)
      .join('');
    for (const el of app.querySelectorAll('.topic')) {
      el.classList.toggle('dim', strandFilter !== 'all' && el.dataset.strand !== strandFilter);
    }
  };
  chips.onclick = (e) => {
    const b = e.target.closest('[data-s]');
    if (b) { strandFilter = b.dataset.s; paint(); }
  };
  app.querySelector('.jump').onclick = (e) => {
    const a = e.target.closest('[data-jump]');
    if (!a) return;
    e.preventDefault();
    document.getElementById(a.dataset.jump)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  paint();
}

// ---------- course page ----------
async function coursePage(id) {
  const c = await loadCourse(id);
  if (c.status === 'soon') {
    app.innerHTML = `<div class="notice">הקורס "${esc(c.title)}" עוד בהכנה. <a href="#/">חזרה</a></div>`;
    return;
  }
  const next = c.lessons.find((l) => !store.lesson(id, l.id).done) || c.lessons[0];
  const started = store.doneCount(c) > 0;
  app.innerHTML = `
    <nav class="crumbs"><a href="#/">כל הקורסים</a> ›</nav>
    <section class="course-hero" style="--c:${c.color}">
      <div class="big">${c.emoji}</div>
      <div>
        <p class="meta">${esc(c.grade || '')}</p>
        <h1>${esc(c.title)}</h1>
        <p>${esc(c.description)}</p>
        <div class="row">
          <a class="btn" href="#/c/${id}/l/${next.id}">${started ? '▶ המשיכו' : '▶ התחילו'}</a>
          ${c.exercises ? `<a class="btn ghost" href="#/c/${id}/ex">✏️ תרגול${store.lesson(id, '__ex').best ? ` (${store.lesson(id, '__ex').best} ✔)` : ''}</a>` : ''}
          <a class="btn ghost" href="#/c/${id}/feed">📱 מצב פיד</a>
        </div>
      </div>
    </section>
    <section class="panel">
      <h2>מה תלמדו</h2>
      <ul class="outcomes">${(c.outcomes || []).map((o) => `<li>${fmt(o)}</li>`).join('')}</ul>
    </section>
    <section class="panel">
      <h2>תוכן הקורס</h2>
      <ol class="lessons">
        ${c.lessons.map((l, i) => {
          const p = store.lesson(id, l.id);
          return `<li><a href="#/c/${id}/l/${l.id}">
            <span class="num ${p.done ? 'done' : ''}">${p.done ? '✔' : i + 1}</span>
            <span class="lt">${esc(l.title)}</span>
            <span class="muted">${l.minutes || '?'} דק׳${p.best != null ? ` · ${Math.round(p.best * 100)}%` : ''}</span>
          </a></li>`;
        }).join('')}
      </ol>
    </section>
    <p class="muted small">נכתב על ידי ${esc(c.author || '?')} · רישיון ${esc(c.license || '?')}</p>`;
}

// ---------- lesson page ----------
async function lessonPage(id, lid) {
  const c = await loadCourse(id);
  const idx = c.lessons.findIndex((l) => l.id === lid);
  if (idx < 0) throw new Error('אין שיעור כזה');
  const L = c.lessons[idx];
  const [md, qs] = await Promise.all([getText(c.base + L.file), lessonQuestions(c, L)]);
  const prev = c.lessons[idx - 1], next = c.lessons[idx + 1];

  app.innerHTML = `
    <nav class="crumbs"><a href="#/">כל הקורסים</a> › <a href="#/c/${id}">${esc(c.title)}</a> › שיעור ${idx + 1}</nav>
    <div class="toolbar">
      <button class="btn ghost small" data-act="static">📄 תצוגה סטטית</button>
      <button class="btn ghost small" data-act="print">🖨 הדפסה</button>
      <a class="btn ghost small" href="${c.base + L.file}" target="_blank" rel="noopener">📝 קובץ המקור</a>
    </div>
    <article class="lesson">${marked.parse(md)}</article>
    <div class="lesson-stuck"></div>
    <section class="quiz panel"></section>
    <nav class="lesson-nav">
      ${prev ? `<a class="btn ghost" href="#/c/${id}/l/${prev.id}">→ ${esc(prev.title)}</a>` : '<span></span>'}
      ${next ? `<a class="btn" href="#/c/${id}/l/${next.id}">${esc(next.title)} ←</a>` : c.exercises ? `<a class="btn" href="#/c/${id}/ex">✏️ לתרגול ←</a>` : `<a class="btn" href="#/c/${id}">סיום הקורס 🎉</a>`}
    </nav>`;

  for (const slot of app.querySelectorAll('.scene-slot')) {
    try {
      const spec = parseScene(decodeURIComponent(slot.dataset.src));
      const first = spec.steps?.[0]?.text || '';
      slot.append(sceneWidget(spec), sceneFrames(spec), stuckButton(stuckCtx(c, L, 'ההסבר המונפש', first)));
    } catch (e) {
      slot.append(h('div', 'notice', `שגיאה בסצנה: ${esc(e.message)}`));
    }
  }

  app.querySelector('.toolbar').onclick = (e) => {
    const act = e.target.dataset.act;
    if (act === 'static') {
      const on = document.body.classList.toggle('static');
      e.target.textContent = on ? '🎬 תצוגה מונפשת' : '📄 תצוגה סטטית';
    } else if (act === 'print') window.print();
  };

  app.querySelector('.lesson-stuck').append(stuckButton(stuckCtx(c, L, 'השיעור כולו', '')));
  renderQuiz(app.querySelector('.quiz'), c, L, qs);
}

function renderQuiz(sec, c, L, qs) {
  sec.innerHTML = '<h2>בדקו את עצמכם</h2>';
  if (!qs.length) { sec.remove(); return; }
  const list = shuffle(qs);
  let right = 0, answered = 0;
  const res = h('div', 'quiz-result');
  for (const q of list) {
    const qEl = questionEl(q, (ok) => {
      answered++;
      if (ok) right++;
      else qEl.append(stuckButton(stuckCtx(c, L, 'שאלה', q.question || q.statement)));
      if (answered === list.length) finish();
    });
    sec.append(qEl);
  }
  sec.append(res);
  function finish() {
    const score = right / list.length;
    const p = store.lesson(c.id, L.id);
    const perfectNow = score === 1 && !p.perfect;
    store.setLesson(c.id, L.id, { done: true, best: Math.max(score, p.best || 0), perfect: p.perfect || score === 1 });
    const courseDone = !p.done && store.doneCount(c) === c.lessons.length;
    award('lesson', { first: !p.done, perfect: perfectNow, courseDone });
    if (perfectNow || courseDone) celebrate();
    const note = score === 1 ? 'כל הכבוד על הדיוק.' : score >= 0.6 ? 'רוב התשובות נכונות. כדאי לעבור שוב על מה שטעיתם.' : 'כדאי לחזור על השיעור ולנסות שוב, זה בסדר.';
    res.innerHTML = `<p>ענית נכון על <b>${right}</b> מתוך <b>${list.length}</b>. <span class="g-light">${note}</span></p>`;
    const again = h('button', 'btn ghost', '↺ נסו שוב');
    again.onclick = () => renderQuiz(sec, c, L, qs);
    res.append(again);
  }
}

// ---------- router ----------
async function route() {
  cleanup?.();
  cleanup = null;
  document.body.classList.remove('feed-mode', 'static');
  const hash = location.hash || '#/';
  let m;
  try {
    if ((m = hash.match(/^#\/c\/([\w-]+)\/feed$/))) {
      document.body.classList.add('feed-mode');
      app.innerHTML = '<p class="loading">טוען…</p>';
      cleanup = await feedView(app, await loadCourse(m[1]));
    } else if ((m = hash.match(/^#\/c\/([\w-]+)\/ex(?:\?s=(\d+))?$/))) {
      const c = await loadCourse(m[1]);
      if (!c.exercises) throw new Error('לקורס הזה עוד אין דף תרגול');
      let seed = Number(m[2]);
      if (!seed) {
        seed = (Math.random() * 1e9) | 0;
        history.replaceState(null, '', `#/c/${m[1]}/ex?s=${seed}`); // shareable: same seed, same exercises
      }
      await exercisesPage(app, c, seed);
    } else if ((m = hash.match(/^#\/c\/([\w-]+)\/l\/([\w-]+)$/))) await lessonPage(m[1], m[2]);
    else if ((m = hash.match(/^#\/c\/([\w-]+)$/))) await coursePage(m[1]);
    else if (hash === '#/math') await mathMap();
    else if (hash === '#/me') mePage(app);
    else await home();
  } catch (err) {
    console.error(err);
    app.innerHTML = `<div class="notice">משהו השתבש: ${esc(err.message)}<br><a href="#/">לדף הבית</a></div>`;
  }
  window.scrollTo(0, 0);
}
addEventListener('hashchange', route);
applyMode();
route();

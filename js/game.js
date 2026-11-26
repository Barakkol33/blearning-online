// Game layer, with three modes the viewer picks:
//   off   — just learning: no points, achievements, goals or streaks
//   light — progress, scores and achievements (default)
//   full  — also points (⭐), levels and celebrations
// Rewards follow docs/education.md: small and informative, and they reward
// persistence and asking for help, not only speed.
import { h, esc } from './util.js';
import { store } from './store.js';

export const MODES = {
  off: { title: 'בלי משחק', emoji: '📖', desc: 'רק החומר והתרגול. בלי נקודות, בלי הישגים ובלי יעדים.' },
  light: { title: 'קצת משחק', emoji: '🏅', desc: 'התקדמות, ציונים והישגים.' },
  full: { title: 'הרבה משחק', emoji: '🎮', desc: 'גם נקודות, רמות וחגיגות כשמצליחים.' },
};

const ACH = [
  { id: 'first-lesson', emoji: '👣', title: 'צעד ראשון', desc: 'סיימתם שיעור ראשון', test: (n) => n.lessons >= 1 },
  { id: 'lessons-10', emoji: '📚', title: 'עשרה שיעורים', desc: 'סיימתם 10 שיעורים', test: (n) => n.lessons >= 10 },
  { id: 'course', emoji: '🎓', title: 'סיימתם קורס', desc: 'עברתם על כל השיעורים בקורס', test: (n) => n.courses >= 1 },
  { id: 'perfect', emoji: '🎯', title: 'בלי טעויות', desc: 'כל התשובות נכונות בבדיקה של שיעור', test: (n) => n.perfect >= 1 },
  { id: 'ex-10', emoji: '✏️', title: 'מתאמנים', desc: 'פתרתם 10 תרגילים', test: (n) => n.ex >= 10 },
  { id: 'ex-100', emoji: '💯', title: 'מאה תרגילים', desc: 'פתרתם 100 תרגילים', test: (n) => n.ex >= 100 },
  { id: 'combo-5', emoji: '🔥', title: 'ברצף', desc: '5 תרגילים נכונים ברצף, בניסיון הראשון', test: (n) => n.bestCombo >= 5 },
  { id: 'comeback', emoji: '💪', title: 'לא מוותרים', desc: 'פתרתם תרגיל אחרי שתי טעויות', test: (n) => n.comeback >= 1 },
  { id: 'help', emoji: '🙋', title: 'שואלים זה חכם', desc: 'ביקשתם עזרה כשנתקעתם', test: (n) => n.help >= 1 },
  { id: 'feed-goal', emoji: '📱', title: 'יעד יומי', desc: 'הגעתם ליעד היומי בפיד', test: (n) => n.goals >= 1 },
  { id: 'streak-3', emoji: '📅', title: 'שלושה ימים', desc: 'למדתם שלושה ימים ברצף', test: (n) => n.bestStreak >= 3 },
];

const XP = { lesson: 20, perfect: 10, exercise: 5, firstTry: 2, feedRight: 2, achievement: 25 };
export const level = (xp) => 1 + Math.floor(xp / 100);

export const mode = () => store.game().mode;

export function setMode(m) {
  store.game().mode = m;
  store.saveGame();
  applyMode();
}

export function applyMode() {
  const b = document.body.classList;
  b.remove('game-off', 'game-light', 'game-full');
  b.add('game-' + mode());
  updateChip();
}

// Record something the learner did. Returns the points earned.
export function award(event, data = {}) {
  const g = store.game();
  const n = g.n;
  const inc = (k, by = 1) => (n[k] = (n[k] || 0) + by);
  let xp = 0;
  if (event === 'lesson') {
    if (data.first) { inc('lessons'); xp += XP.lesson; }
    if (data.perfect) { inc('perfect'); xp += XP.perfect; }
    if (data.courseDone) inc('courses');
  } else if (event === 'exercise') {
    inc('ex');
    xp += XP.exercise;
    if (data.firstTry) {
      inc('combo');
      n.bestCombo = Math.max(n.bestCombo || 0, n.combo);
      xp += XP.firstTry;
    } else n.combo = 0;
    if (data.misses >= 2) inc('comeback');
  } else if (event === 'miss') {
    n.combo = 0;
  } else if (event === 'feed') {
    if (data.ok) xp += XP.feedRight;
    if (data.goalReached) inc('goals');
    if (data.streak) n.bestStreak = Math.max(n.bestStreak || 0, data.streak);
  } else if (event === 'help') {
    inc('help');
  }
  const fresh = ACH.filter((a) => !g.ach[a.id] && a.test(n));
  for (const a of fresh) {
    g.ach[a.id] = Date.now();
    xp += XP.achievement;
  }
  g.xp += xp;
  store.saveGame();
  updateChip();
  if (mode() !== 'off') {
    fresh.forEach((a, i) => setTimeout(() => toast(`${a.emoji} הישג חדש: <b>${esc(a.title)}</b>`, true), i * 900));
    if (mode() === 'full' && xp && !fresh.length) pop(`+${xp} ⭐`);
  }
  return xp;
}

// Big moments (perfect quiz, finished course): only in full mode.
export function celebrate() {
  if (mode() === 'full') confetti();
}

function toast(html, big) {
  const t = h('div', 'toast', html);
  document.body.append(t);
  if (big && mode() === 'full') confetti();
  setTimeout(() => t.classList.add('out'), 2600);
  setTimeout(() => t.remove(), 3100);
}

function pop(text) {
  const chip = document.getElementById('game-chip');
  if (!chip || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const p = h('span', 'xp-pop', text);
  chip.append(p);
  setTimeout(() => p.remove(), 1100);
}

function confetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = h('div', 'confetti');
  const bits = ['🎉', '⭐', '✨', '🟡', '🔵', '🟢'];
  for (let i = 0; i < 22; i++) {
    const s = h('span', '', bits[i % bits.length]);
    s.style.setProperty('--x', `${Math.random() * 100}vw`);
    s.style.setProperty('--d', `${0.9 + Math.random() * 0.9}s`);
    s.style.setProperty('--r', `${Math.random() * 720 - 360}deg`);
    box.append(s);
  }
  document.body.append(box);
  setTimeout(() => box.remove(), 2000);
}

export function updateChip() {
  const chip = document.getElementById('game-chip');
  if (!chip) return;
  const g = store.game();
  const count = Object.keys(g.ach).length;
  chip.innerHTML =
    mode() === 'full' ? `⭐ ${g.xp} · רמה ${level(g.xp)}` : mode() === 'light' ? `🏅 ${count}` : '📖';
  chip.title = 'ההישגים שלי והגדרות משחק';
}

// #/me — achievements, stats and the mode picker.
export function mePage(app) {
  const g = store.game();
  const n = g.n;
  const m = mode();
  app.innerHTML = `
    <nav class="crumbs"><a href="#/">כל הקורסים</a> ›</nav>
    <section class="hero"><h1>${m === 'off' ? '📖 ההתקדמות שלי' : '🏅 ההישגים שלי'}</h1></section>
    <section class="panel">
      <h2>כמה משחק?</h2>
      <p class="muted small">אפשר לשנות בכל רגע. ההגדרה נשמרת בדפדפן הזה.</p>
      <div class="modes">${Object.entries(MODES)
        .map(([k, v]) => `<button class="mode ${k === m ? 'on' : ''}" data-mode="${k}"><span class="big">${v.emoji}</span><b>${v.title}</b><span class="muted small">${v.desc}</span></button>`)
        .join('')}</div>
    </section>
    <section class="panel">
      <h2>במספרים</h2>
      <div class="stats">
        <div><b>${n.lessons || 0}</b><span>שיעורים</span></div>
        <div><b>${n.ex || 0}</b><span>תרגילים</span></div>
        <div><b>${n.courses || 0}</b><span>קורסים</span></div>
        ${m === 'full' ? `<div><b>${g.xp}</b><span>⭐ נקודות · רמה ${level(g.xp)}</span></div>` : ''}
      </div>
    </section>
    ${m === 'off' ? '' : `<section class="panel">
      <h2>הישגים <span class="muted small">${Object.keys(g.ach).length} מתוך ${ACH.length}</span></h2>
      <div class="ach">${ACH.map((a) => `<div class="a ${g.ach[a.id] ? 'got' : ''}"><span class="big">${a.emoji}</span><b>${esc(a.title)}</b><span class="muted small">${esc(a.desc)}</span></div>`).join('')}</div>
    </section>`}`;
  app.querySelector('.modes').onclick = (e) => {
    const b = e.target.closest('[data-mode]');
    if (b) { setMode(b.dataset.mode); mePage(app); }
  };
}

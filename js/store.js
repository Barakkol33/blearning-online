// Progress lives in this browser only (localStorage). No accounts, no server.
// Export/import gives a copy-paste code to move progress between devices.
const KEY = 'lomdim:v1';
let mem = null;

function load() {
  if (mem) return mem;
  try { mem = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { mem = {}; }
  mem.lessons ??= {};
  mem.feed ??= {};
  return mem;
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch { /* private mode etc. */ }
}
const day = (t = Date.now()) => new Date(t).toLocaleDateString('en-CA');

export const FEED_GOAL = 10;

export const store = {
  lesson(c, l) {
    return load().lessons[`${c}/${l}`] || {};
  },
  setLesson(c, l, patch) {
    const s = load();
    const k = `${c}/${l}`;
    s.lessons[k] = { ...s.lessons[k], ...patch };
    save();
  },
  doneCount(course) {
    return course.lessons.filter((l) => this.lesson(course.id, l.id).done).length;
  },
  feedToday() {
    const s = load();
    const today = day();
    if (s.feed.date !== today) {
      const keep = s.feed.date === day(Date.now() - 864e5) && s.feed.count > 0;
      s.feed = { date: today, count: 0, streak: keep ? s.feed.streak || 0 : 0 };
    }
    return s.feed;
  },
  bumpFeed() {
    const f = this.feedToday();
    if (f.count === 0) f.streak = (f.streak || 0) + 1;
    f.count++;
    save();
    return f;
  },
  stuck() {
    return load().stuck || [];
  },
  addStuck(item) {
    const s = load();
    s.stuck ??= [];
    s.stuck = s.stuck.filter((x) => x.url !== item.url || x.where !== item.where);
    s.stuck.unshift(item);
    save();
    return item;
  },
  resolveStuck(i) {
    const s = load();
    s.stuck?.splice(i, 1);
    save();
  },
  exportCode() {
    return btoa(unescape(encodeURIComponent(JSON.stringify(load()))));
  },
  importCode(code) {
    mem = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
    load();
    save();
  },
};

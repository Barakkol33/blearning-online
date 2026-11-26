// "I still don't get it" — the student flags the exact spot they're stuck on.
// Static-site friendly: the flag is saved in this browser ("my questions"),
// and the student can ask a person now (share a link by WhatsApp, or see a
// list of help options from content/help.json) or keep it for later.
import { h, esc, fmt } from './util.js';
import { getJSON } from './content.js';
import { store } from './store.js';
import { award } from './game.js';

export function stuckButton(ctx) {
  // ctx: { course, lesson, where, text }  — `where` is a short human label.
  const b = h('button', 'btn ghost small stuck', '🤔 עדיין לא הבנתי');
  b.onclick = () => openStuck(ctx);
  return b;
}

async function openStuck(ctx) {
  const item = store.addStuck({ ...ctx, url: location.href, at: Date.now() });
  award('help');
  const help = await getJSON('content/help.json').catch(() => ({ options: [] }));
  const msg = `היי, נתקעתי ב"${ctx.where}" (${ctx.lessonTitle}).\n${ctx.text ? ctx.text + '\n' : ''}אפשר עזרה? ${location.href}`;

  const dlg = h('dialog', 'stuck-dlg');
  dlg.innerHTML = `
    <h2>🤔 זה בסדר לא להבין עדיין</h2>
    <p>שמרנו את המקום הזה ב<b>"השאלות שלי"</b> בדף הבית, כדי שתוכלו לחזור אליו.</p>
    <p class="muted small">נתקעתם ב: ${fmt(ctx.where)}</p>
    <h3>לשאול מישהו עכשיו</h3>
    <div class="row">
      <a class="btn" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(msg)}">💬 שליחה בוואטסאפ למורה או לחבר</a>
      <button class="btn ghost copy">📋 העתקת השאלה</button>
    </div>
    <h3>או לבקש עזרה</h3>
    <ul class="help-list">${help.options
      .map((o) => `<li>${o.url ? `<a href="${esc(o.url)}" target="_blank" rel="noopener">${esc(o.title)}</a>` : `<b>${esc(o.title)}</b>`}<br><span class="muted small">${esc(o.description)}</span></li>`)
      .join('')}</ul>
    <div class="row end"><button class="btn ghost close">שמרתי, אחזור לזה אחר כך</button></div>`;
  dlg.querySelector('.copy').onclick = (e) => {
    navigator.clipboard?.writeText(msg).then(() => (e.target.textContent = '✔ הועתק'), () => {});
  };
  dlg.querySelector('.close').onclick = () => dlg.close();
  dlg.addEventListener('close', () => dlg.remove());
  document.body.append(dlg);
  dlg.showModal();
  return item;
}

// Home-page list of saved "stuck" spots.
export function stuckList() {
  const items = store.stuck();
  if (!items.length) return null;
  const sec = h('section', 'panel my-q');
  sec.innerHTML = `<h2>🤔 השאלות שלי</h2>
    <p class="muted small">מקומות שסימנתם שלא הבנתם. אפשר להראות אותם למורה, או לחזור אליהם אחרי שמישהו הסביר.</p>
    <ul>${items
      .map((it, i) => `<li><a href="${esc(it.url)}">${esc(it.lessonTitle)} — ${fmt(it.where)}</a>
        <button class="btn ghost small" data-done="${i}">✔ הבנתי</button></li>`)
      .join('')}</ul>`;
  sec.onclick = (e) => {
    const i = e.target.dataset.done;
    if (i == null) return;
    store.resolveStuck(+i);
    const next = stuckList();
    next ? sec.replaceWith(next) : sec.remove();
  };
  return sec;
}

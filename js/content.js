// Everything the site shows comes from plain files under content/.
import { load as yamlLoad } from 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.mjs';

const cache = new Map();
function get(path, kind) {
  if (!cache.has(path)) {
    cache.set(
      path,
      fetch(path).then((r) => {
        if (!r.ok) throw new Error(`${path}: ${r.status}`);
        return kind === 'json' ? r.json() : r.text();
      }),
    );
  }
  return cache.get(path);
}
export const getJSON = (p) => get(p, 'json');
export const getText = (p) => get(p, 'text');

export const catalog = () => getJSON('content/catalog.json');

// All courses live in this repo under content/courses/<id>/.
export async function loadCourse(id) {
  const cat = await catalog();
  const entry = cat.courses.find((c) => c.id === id);
  if (!entry) throw new Error(`אין קורס בשם ${id}`);
  if (entry.status === 'soon') return { ...entry, lessons: [] };
  const base = `content/courses/${id}/`;
  const c = await getJSON(base + 'course.json');
  return { ...c, id, base, status: 'live' };
}

// Question files use the quizplay format: { type, questions: [...] }.
export async function lessonQuestions(course, lesson) {
  const sets = await Promise.all((lesson.questions || []).map((f) => getJSON(course.base + f)));
  return sets.flatMap((s) => s.questions.map((q) => ({ ...q, type: s.type })));
}

// Authors write free Hebrew text after `text:` / `label:`, which often contains
// ": " (a YAML key marker). Quote those values for them so they never have to.
export const parseScene = (src) =>
  yamlLoad(
    src.replace(/^(\s*(?:-\s+)?(?:text|label):[ \t]+)(?!["'|>])(.+?)\s*$/gm, (_, k, v) => k + JSON.stringify(v)),
  );

export function scenesIn(md) {
  const out = [];
  for (const m of md.matchAll(/```scene\r?\n([\s\S]*?)```/g)) {
    try { out.push(parseScene(m[1])); } catch (e) { console.warn('bad scene', e); }
  }
  return out;
}

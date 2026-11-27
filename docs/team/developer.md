# Role: Developer

**You decide how it's built, and you build it. You don't change what is taught or which features were chosen.**

You are the engineer of a no-build static site: vanilla ES modules, hash routing, content as files. Your job is to deliver exactly what the teacher and product files describe, with the least new code, in a way that makes the *next* chapter easier to build.

## How to do the job

1. **Read both handoff files** (`1-teacher.md`, `2-product.md`) and list every item you must deliver.
2. **For each item, decide: reuse, extend or new.**
   - **Reuse:** an existing scene type, generator or question type does it as is.
   - **Extend:** add an option to an existing module. Keep old content working.
   - **New:** a new module. Scene types go in `js/scenes/<name>.js` and are added to `KNOWN` in `js/scene.js`. Generators go in `js/gen/<name>.js` and are merged in `js/generators.js`. One file per kind.
3. **Write `plan/3-developer.md`:** the item list, each with its decision and files; then any risks.
4. **Build:** the course files (`course.json`, `lessons/`, `questions/`, `exercises.json`), plus the code.
5. **Check:** follow the steps in the checks section below. Fix everything before commit.
6. **Register and record:** add the course to `catalog.json` and tick it in `TODO.md`. Document a new scene option or generator in the README, and add new features to the feature menu in [product.md](product.md).

## Emphasis

- **Least new code.** Prefer data (YAML or JSON) over code, and an option over a new module.
- **Modular.** A new thing plugs in through a registry. No edits scattered across files.
- **Generators are honest.** Seeded, no repeated questions in a section, correct math, and Hebrew grammar that holds for every random choice (gender, singular or plural, "0 units").
- **Every generated exercise has a solution;** an animated one where a picture helps.
- **RTL details:** math in backticks; a Hebrew line never starts with a number or English.
- **Look at it.** Code that renders isn't done until a screenshot looks right: sizes, overlaps, empty states.
- **Game layer:** add an achievement in `js/game.js`. UI that should hide in "off" mode gets the class `g-light` (or `g-full` for full mode only).
- **Don't break other courses.** Run the checks on older courses that use a module you changed.

## Checks

1. Start a local server: `python -m http.server 8765`.
2. Open `dev/scenes.html` in headless Chrome. The title must be "Scene check: ok".
3. Open `dev/solutions.html?course=<id>&seed=N` with 2 seeds. The title must be "Solutions: N ok".
4. Take screenshots of the solutions page and one lesson, and look at them.
5. Run the same checks for any older course that uses a changed module.

## Template: `plan/3-developer.md`

```md
# Developer: <chapter>

| Item | Decision | Files |
|---|---|---|
| Groups animation, lesson 1 | reuse `groups` | lessons/01-*.md |
| ×0 exercises | extend `mult-groups` with ask: special | js/gen/mult-intro.js |

## New code
- …

## Risks / checks
- …
```

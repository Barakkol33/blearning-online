# blearning-online

A free, open Hebrew learning site: courses, animated explanations, quizzes and a swipe "feed", built from plain text files. Static: runs on GitHub Pages and stores progress in the browser.

**Live site: https://barakkol33.github.io/blearning-online/**

Status: proof of concept. Math only: all of grade 1, the start of grade 2, negative numbers (grade 7), and one high-school sample (a triangle inscribed in a circle). See the course list in [TODO.md](TODO.md).

Planning docs: [the team](docs/team/README.md) (manager, teacher, product, developer, researcher: how every chapter is made) · [high school](docs/high-school.md) · [market](docs/market.md)

Dev: `dev/scenes.html` renders every scene of every live course as still frames, to catch broken scenes.

## Run locally

No build step, and no server code: the site is plain HTML, CSS and JavaScript. Locally, serve the folder with any static file server, for example:

```sh
npx serve .                  # Node
python -m http.server 8000   # or Python, if you have it
```

Opening `index.html` straight from disk won't work, because browsers block `fetch` from `file://`.

## How content works

```
content/
  catalog.json                 # list of courses (+ "soon" placeholders)
  help.json                    # where stuck students can get human help
  courses/<id>/
    course.json                # title, subject, grade, lessons
    lessons/01-*.md            # lesson text (Markdown) with ```scene blocks
    questions/01-*.mcq.json    # questions in the quizplay format
```

### Add a course

1. Copy `content/courses/negative-numbers/` to a new folder and edit it.
2. Add `{ "id": "<folder-name>" }` to `content/catalog.json`.

All courses live in this repo. Courses hosted elsewhere aren't linked for now.

### Questions

These use the same format as [quizplay](https://github.com/Barakkol33/quizplay). Supported here so far: `mcq` and `truefalse`. Put math in backticks so it shows left to right inside Hebrew: `` `-3 + 5` ``.

### Scenes (animations)

A scene is a fenced block in the lesson:

````md
```scene
type: number-line
range: [-6, 6]
steps:
  - text: נחשב `2 + 3`. מתחילים ב־`2`.
    marker: 2
    points: [2]
  - text: מוסיפים 3: קופצים 3 קפיצות ימינה.
    marker: 5
    arrow: [2, 5]
    label: "2 + 3 = 5"
```
````

Each step is a full picture plus one sentence:
- `points`: dots on the line.
- `arrow`: `[from, to]`, or a list of such pairs.
- `label`: big text above the line.
- `marker`: where the 🐸 is. It stays where it was until a step moves it.

The same steps render animated in the lesson, as numbered still frames in the static and print views, and one step per card in the feed.

Other scene types: `blocks` (tens and ones), `shapes`, `measure` (lengths in units), `balance` (a scale), and `circle` (geometry in a circle: points by angle, chords, angle arcs with live values, equal-length marks, perpendicular bisectors; points slide along the circle between steps). Each type lists its step keys in a comment above it in [js/scene.js](js/scene.js).

The `axes` scene ([js/scenes/axes.js](js/scenes/axes.js)) is a coordinate plane for analytic geometry: a grid in a chosen range (`x: [-1, 8]`, `y: [-1, 6]`), points given in coordinates (`points: { A: [1, 1] }`, labeled `A(1, 1)` unless `coords: false`), and per step `at` (add or move points; they slide), `show`, `lines`, `hot`, `dash`, `fill`, `marks`/`marks2`, `sides`, `legs` (the right triangle under a segment, with the leg lengths), `proj` (dashed lines from a point to both axes) and `right`. `axesFig(spec, step)` (exported from `js/scene.js`) draws a still figure for an exercise.

Exercise generators live in `js/gen/` (one module per topic, merged into the registry in `js/generators.js`). An exercise can carry a `scene` too: its worked solution, shown step by step under "הצג פתרון". `dev/solutions.html?course=<id>` shows every solution scene of a course's exercises as still frames.

Signed numbers (`js/gen/int-muldiv.js`): `int-mul` (`ask`: `pos-neg`, `neg-neg`, `special`), `int-sign` (sign of 3–5 factors), `int-div`, `int-missing` (`? × b = c`) and `int-chain` (`a × b ÷ c`). Each product and quotient gets a number-line solution of equal jumps from 0, built by `mulScene(x, y)`.

Powers and square roots (`js/gen/powers.js`): `pow` (`ask`: `pos`, `special`, `neg`), `pow-missing` (missing base or exponent), `pow-sign` (sign without computing; `-bⁿ` vs `(-b)ⁿ`), `sqrt`, `sqrt-between` (choice) and `pow-mix` (two steps). Exponents are superscript digits, via `sup(n)`. Solutions: a `groups` array for squares and roots, plates built one power at a time for small `aⁿ`, and a number line for negative bases and estimates.

Analytic geometry (`js/gen/analytic.js`): `seg-dist` (`ask`: `axis`, `pyth`, `root`: the number under `√`), `seg-mid` (`ask`: `mid`, a typed point; `end`, choice with misconception distractors) and `seg-use` (`ask`: `type`, the triangle type from squared sides; `perimeter`). Every solution writes the formula and the full substitution, with an `axes` scene. A typed answer that is a point uses `"answer": "(1, 2)", "point": true`.

## License

Content: CC BY-SA 4.0. Code: MIT.

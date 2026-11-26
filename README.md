# blearning-online

A free, open Hebrew learning site: courses, animated explanations, quizzes and a swipe "feed", built from plain text files. Static: runs on GitHub Pages and stores progress in the browser.

Status: proof of concept, with one course (מספרים שליליים, grade 7).

Planning docs: [goals](docs/goals.md) · [education](docs/education.md) (how to write courses) · [research](docs/research.md) · [product](docs/product.md) · [market](docs/market.md)

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

## License

Content: CC BY-SA 4.0. Code: MIT.

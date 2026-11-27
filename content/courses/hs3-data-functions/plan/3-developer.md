# Developer: מסקנות מנתונים: דיאגרמות, גרפים ופונקציות

| Item | Decision | Files |
|---|---|---|
| Bar, pie and line charts, step by step (lessons 1–3, ball graph in lesson 4) | **new** scene `chart` (`kind: bar \| pie \| line`), registered in `KNOWN` | js/scenes/chart.js, js/scene.js, styles.css |
| Reading line to the axis, half-line ("חצי = 60"), cut axis, steep segment | `chart` step keys `read`, `guide`, `min`, `seg`, `hot`, `values` | js/scenes/chart.js |
| Candle graph: table points, the line, reading `L = 5` back to `t` | **reuse** `axes` (from `analytic-points-segments`): `points`, `lines`, `at`, `proj` | lessons/04-function.md |
| Percent table, `t`/`L` table | Markdown tables | lessons/02-*.md, 04-*.md |
| 📜 / 🛒 / 💡, mcq, truefalse | reuse | lessons/, questions/ |
| Bar reading: value, difference, "how many times" | new generator `bar-read` (`ask`) with a still chart and an animated solution | js/gen/data.js |
| Pie: missing slice, amount from percent, percent from amount | new generator `pie-pct` (`ask`) | js/gen/data.js |
| Line: percent change from the old value, biggest rise | new generator `line-change` (`ask: pct \| most`) | js/gen/data.js |
| Linear rule in context: substitute, solve | new generator `func-rule` (`ask: value \| solve`; candle, battery, tank, temperature) | js/gen/data.js |
| Quadratic: when is the ball at height H | new generator `quad-height` (`ask: first \| second`), full root-formula solution, chart solution with a guide line | js/gen/data.js |
| Assessment-style multi-part question: story and figure once, parts below | **extend** exercises: section `intro` and `figure`; `figure` may be a scene spec (drawn still) | js/exercises.js |
| Handwritten kettle graph | item `figure` as a `chart` spec | exercises.json |

## New code
- `js/scenes/chart.js`: one module; `chartFig(spec, step)` for exercise figures. Colors: the dataviz reference categorical slots 1–8 in fixed order (validated palette), light and dark, scoped to `.chart`. Hebrew text inside the LTR SVG is wrapped in an RTL embedding, so "חצי = 60" reads right.
- `js/gen/data.js`: merged into `GENERATORS` in `js/generators.js`.
- `js/exercises.js`: `figHtml()` (a string, or a scene spec drawn at its first step), and a section's `intro` and `figure`.

## Risks / checks
- No hover tooltips on the charts: they are teaching scenes that must also work as still frames and in print. The values the student needs are written on the chart.
- `axes` names its axes `x` and `y`; lesson 4 says in words that `x` is `t` and `y` is `L`. An axis-name option for `axes` belongs to its owner.
- The `axes` projection label sits below the plot; `y: [-1, 12]` leaves room for it.
- Leading "+" in an SVG label rendered as "200+", so labels say "עלייה של 200".
- Checks: dev/scenes.html (all courses, and `?course=hs3-data-functions`): "Scene check: ok". dev/solutions.html seeds 1 and 7: "Solutions: 11 ok", "Solutions: 13 ok". Older course: `powers` seed 1: "Solutions: 12 ok". Screenshots: every scene frame of the course, the exercises page (assessment section, kettle figure), lesson 4 at phone width.

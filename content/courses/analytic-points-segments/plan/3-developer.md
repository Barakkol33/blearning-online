# Developer: נקודות וקטעים במערכת צירים

| Item | Decision | Files |
|---|---|---|
| Coordinate plane in every lesson scene | **new** scene `axes`: grid, points by coordinates (with `A(1, 1)` labels), `lines`/`hot`/`dash`, `fill`, `marks`/`marks2`, `sides`, `legs` (right triangle under a segment, with labels), `proj` (to both axes), `right`; points slide between steps; `axesFig()` for still exercise figures | js/scenes/axes.js, js/scene.js (KNOWN), styles.css |
| Distance lesson: streets vs air, negative example | reuse `axes` (`legs`, `sides`, `label`) | lessons/01-distance.md |
| Midpoint as an average; endpoint as "the same step again" | reuse `axes` (`proj`, `legs` with `+3`/`−2`, `marks`) | lessons/02-midpoint.md |
| Triangle type, model proof (statement and reason) | reuse `axes` (`marks`, `right`, `fill`, `dash`); a Markdown table for the proof | lessons/03-shapes.md |
| Typed point answer `(x, y)` | **extend** the exercises page: `point: true` compares the two numbers in order; text keyboard and a `(x, y)` placeholder | js/exercises.js |
| Horizontal/vertical, slanted, `√n` lengths | new generator `seg-dist` (`ask`: axis, pyth, root) | js/gen/analytic.js |
| Midpoint, endpoint (choice with misconception distractors) | new generator `seg-mid` (`ask`: mid, end) | js/gen/analytic.js |
| Triangle type, perimeter | new generator `seg-use` (`ask`: type, perimeter) | js/gen/analytic.js |
| Animated solutions | every generated item has one, on `axes`: legs then Pythagoras; projections then the average; the step repeated; squared sides then the converse | js/gen/analytic.js |
| Proofs, bagrut question (א–ה), ⭐, "חושבים" | data, with hand-written `axes` solution scenes | exercises.json |

## New code
- `js/scenes/axes.js`: committed and pushed on its own first (b775dcc), so the parallel 3-unit chapter can reuse it. Documented in the README.
- `js/gen/analytic.js`: merged into `GENERATORS`. Every solution writes the formula, the substitution and the result.

## Risks / checks
- `seg-use` type draws triangles from vectors (`u`, `v` with `v = (b, a)`, `(−b, a)`, `(−2b, 2a)` or random) and re-classifies them from the squared sides, so the answer always matches the figure.
- Ranges always include the origin, so a far point makes a small grid (labels every 2 above 14 units). Point names near an edge flip to the other side; side labels are clamped inside.
- The `point` answer reads numbers with `.` decimals. A decimal comma, `(2,5, 3)`, would be misread.
- Checks: dev/scenes.html "Scene check: ok" (all courses); dev/solutions.html for this course, seeds 3 and 11; re-checked `powers` and `triangle-in-circle` (they share `js/generators.js` and `js/scene.js`). Screenshots of the solutions page (each generator) and lesson 3 (proof table).

# Developer: חזקות ושורש ריבועי

| Item | Decision | Files |
|---|---|---|
| Paper-fold doubling, lesson 1 | reuse `groups` (plates, `count`) | lessons/01-power.md |
| "Why squared" arrays, lessons 1 and 3 | reuse `groups` (`array`, `by: rows`) | lessons/01-power.md, 03-square-root.md |
| Alternating sign of `(-2)ⁿ`, `(-3)²` vs `-3²` | reuse `number-line` (marker, points, label) | lessons/02-negative-base.md |
| `√20` between 4 and 5 | reuse `number-line` (marker at 4.5) | lessons/03-square-root.md |
| `(-1)ⁿ` table, table of squares | Markdown tables (styled since negative-mul-div) | lessons/02-*.md, 03-*.md |
| Exponents | superscript digits in text (`2³`); a `sup(n)` helper in the generators | js/gen/powers.js |
| 📜 / 🛒 / 💡 boxes, mcq, truefalse | reuse | lessons/, questions/ |
| Positive powers, special cases, negative base | new generator `pow` (`ask`: pos, special, neg) | js/gen/powers.js |
| Missing base or exponent | new generator `pow-missing` | js/gen/powers.js |
| Sign without computing | new generator `pow-sign` (choice) | js/gen/powers.js |
| Square root, estimate between whole numbers | new generators `sqrt`, `sqrt-between` (choice) | js/gen/powers.js |
| Two steps | new generator `pow-mix` | js/gen/powers.js |
| Animated solutions | squares and roots: `groups` array; `aⁿ` small: plates built one power at a time; negative base: frog visits `(-b)¹…(-b)ⁿ`, or `bⁿ` then the opposite; between: number line | js/gen/powers.js |
| Handwritten "חושבים" | data | exercises.json |

## New code
- `js/gen/powers.js`: one module, merged into `GENERATORS` in `js/generators.js`. No new scene type.

## Risks / checks
- Plate scenes are only drawn when `aⁿ⁻¹ ≤ 27` (a plate of 27 dots is 6 rows); bigger powers get a written solution only. Root arrays up to 10 × 10.
- `pow-missing` asks the exponent in words ("2 בחזקת כמה…"), since there is no superscript "?".
- `pow-sign` "out" items (`-bⁿ`, n even) are always negative, by design: that is the trap.
- Checks: dev/scenes.html, dev/solutions.html for `powers` with 2 seeds, screenshots of a lesson and the solutions; re-check `negative-mul-div` (shares `js/generators.js`).

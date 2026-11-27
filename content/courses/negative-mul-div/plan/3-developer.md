# Developer: כפל וחילוק מספרים מכוונים

| Item | Decision | Files |
|---|---|---|
| Jumps of `-2` from 0, lessons 1–3 | reuse `number-line` (list of arrows, `hop` = jump size) | lessons/01-*.md, 02-*.md, 03-*.md |
| Pattern scene, lesson 2 | reuse `number-line` (marker moves +2 per step, `label` per row) | lessons/02-neg-neg.md |
| "Opposite" jump, lesson 2 | reuse `number-line` (arrow and marker from `-6` to `6`) | lessons/02-neg-neg.md |
| Sign table | Markdown table; extend CSS with a small `.lesson table` rule | styles.css |
| 📜 / 🛒 / 💡 boxes, mcq, truefalse | reuse | lessons/, questions/ |
| Product exercises (pos-neg, neg-neg, special) | new generator `int-mul` | js/gen/int-muldiv.js |
| Sign of several factors | new generator `int-sign` (choice) | js/gen/int-muldiv.js |
| Division, missing factor | new generators `int-div`, `int-missing` | js/gen/int-muldiv.js |
| Multi-step chain | new generator `int-chain` | js/gen/int-muldiv.js |
| Animated solutions | new helper `mulScene(x, y)`: equal jumps from 0; two negatives = jumps, then the opposite. Division and missing reuse it as the check `q × b` | js/gen/int-muldiv.js |
| Handwritten "חושבים" | data | exercises.json |

## New code
- `js/gen/int-muldiv.js`: one module, merged into `GENERATORS` in `js/generators.js`. Every number is built from its factors, so divisions are always exact. Negatives are wrapped by `p()`; scene labels use a real minus sign.
- `styles.css`: 3 lines for lesson tables (also improves the table already in triangle-in-circle).

## Risks / checks
- The number-line range grows with the product (up to ±55 for `7 × 7`); ticks get dense there, but labels stay every 10.
- `int-sign` has 3 fixed options; with `zero: 0.2` about one item in 5 has a 0 factor.
- Grammar: "קפיצה אחת" for one jump; "אין / אחד / N גורמים שליליים" for the count.
- Checks: dev/scenes.html, dev/solutions.html with 2 seeds, screenshots of a lesson and the exercise solutions. No older course uses the new module; the CSS change touches triangle-in-circle's table only.

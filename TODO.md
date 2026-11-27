# TODO

Grouped by area. Rough order inside each group = priority. See [docs/team/](docs/team/README.md) for the why.

## POC polish
- [ ] Test on a real phone (Android Chrome, iPhone Safari): feed swipe, scroll snap, swipe-to-answer
- [ ] Test dark mode across all pages
- [ ] Turn on GitHub Pages for the repo and check all paths work under `/blearning-online/`
- [ ] Favicon and social preview image
- [ ] Loading and error states for a missing lesson, a missing question file, or a bad scene YAML (show the line)
- [ ] Remember "static view" per viewer (localStorage, wrapped in try/catch)
- [ ] Keyboard: ←/→ to step through a scene in a lesson
- [ ] Clicking a feed card's scene replays the animation
- [ ] Show the 🤔 button on the feed's scene cards too, not only on wrong answers
- [ ] Accessibility: aria-live for quiz feedback, text alternatives for scenes (step texts), focus order in the dialog

## Structure: modular, so new things plug in (user request 2026-11-27)
Goal: adding a scene type, a generator, an exercise kind or a course means adding one file in a known place, not hand-building it from scratch.
- [ ] Scenes: one module per type (`js/scenes/number-line.js`, `circle.js`, …) plus a registry; shared SVG helpers (`js/scenes/svg.js`: points, segments, angle arcs, tick marks, labels)
- [ ] Generators: one module per topic (`js/generators/arithmetic.js`, `measure.js`, `circle.js`, …) with a registry; shared figure helpers
- [ ] Exercise kinds as plugins: `number`, `choice`, `proof` (and later `order`, `match`, `steps`), each one file with render plus check
- [ ] Solution scenes as reusable templates ("rule + compute", "given → rule → compute → check"), so a generator passes values and doesn't hand-write steps
- [ ] `tools/new-course.mjs`: scaffold a course folder (course.json, 3 lesson stubs, question stubs, exercises.json) and register it; move today's register script into the repo
- [ ] `tools/check.mjs`: validate every course (JSON shape, answers in range, scenes parse, generator types exist) with clear Hebrew errors; run it before every commit
- [ ] Lesson snippets: reusable blocks (📜 story, 🛒 everyday, "rule" box, summary) as Markdown conventions with their own styles
- [ ] One docs page, `docs/architecture.md`: where each kind of thing lives and how to add one

## Exercises
- [ ] Proof questions ("build the proof"): the student orders the statements and picks a reason for each from a list, then sees a detailed model proof with an animated scene, one statement per step. First one: in the next geometry course (user request 2026-11-27)
- [x] Exercises page per course (`#/c/<id>/ex`): generated plus handwritten, instant check, hint, show solution, shareable seed, printable worksheet
- [ ] Guided sub-steps for hard (high-school) problems: `steps: [{ q, answer, hint }]` that lead to the final answer
- [ ] Answer types: fractions (`3/4`), several answers (`x = 2, 3`), expressions (compare by evaluating at random points)
- [ ] Geometry generators, drawn from coordinates so the figure always matches: angles in parallel lines, Pythagoras, area and perimeter, similar triangles, circle angles
- [ ] Geometry proofs: "build the proof" (order steps and pick reasons from a list), with self-check against a model proof
- [ ] Mixed review page across courses (prerequisites plus current)
- [ ] Section titles on the exercises page: render `math` with `fmt` (today they are escaped plain text, so a title can't show `-1`)
- [ ] Typed-answer generators can't use misconception distractors; add a "choice" variant of `int-mul` / `int-div` whose wrong options are the sign-flip and the sum
- [ ] Teacher answer key page for a given seed
- [ ] Point answers: accept a decimal comma (`(2,5; 3)`); today `point: true` reads only `.` decimals
- [ ] Convert the bagrut-style question in `analytic-points-segments` (items א–ה) to `steps` once it exists

## Game mode
- [x] Three modes picked by the viewer: off / light / full (`js/game.js`, page `#/me`)
- [x] Achievements that reward persistence and asking for help, not just speed
- [ ] Mini-games show only in light/full? Decide (probably always available, but scored only in light/full)
- [ ] Full mode: optional sounds (off by default)
- [ ] Full mode: a mascot (the 🐸) that reacts to answers
- [ ] Per-course "mastery" badge: all lessons, perfect checks, plus 20 exercises

## Learning features (from docs/team/teacher.md and product.md)
- [ ] Concept links: `[[id|text]]` in lessons opens a short card (definition, tiny example, "לנושא המלא ←")
- [ ] `content/concepts/<id>.md`: short card text plus full explanation; a concept page view
- [ ] `requires` on topics in math-map.json; a "this lesson uses: …" line at the top of lessons
- [ ] Warm-up prerequisite check (3 questions) at the start of a course, as advice only
- [ ] End-of-course mix: a few questions from prerequisite topics
- [ ] Mini-game framework (a `game` block in lessons, like `scene`)
- [ ] First mini-games: "frog jump" (where does it land?), "build it" (rods and cubes), "make ten"
- [ ] Encouragement rules in feedback messages (strategy praise; after 2–3 misses, offer help instead)
- [ ] Narration (text-to-speech) for grade 1–3 lessons
- [ ] Retrofit existing courses (negative-numbers, numbers-to-20, add-sub-to-20, numbers-to-100): add a 📜 story, a 🛒 real-life box, misconception-based distractors, and one ⭐ stretch question each

## Math courses — say "next" to build the next one

One course per line, in order. **"next" (one chunk, about 10 minutes of work) = the first unchecked course in the high-school section** (current focus since 2026-11-27, starting with grade 10 at 4–5 units; grades 1–9 only on request): build it in `content/courses/<id>/`, through the team pipeline in [docs/team/](docs/team/README.md): manager → teacher → product → developer, each writing its file in `plan/`:
- 2–4 short lessons: hook, scene, worked example, summary plus "where this leads"
- at least one `> 📜 סיפור` (facts checked) and one `> 🛒 בחיים` box per course
- quizplay-format questions: easy first, one ⭐ stretch, distractors from real misconceptions
- `exercises.json`: a long checkable exercise page, with generated sections (add a generator to `js/generators.js` if needed) plus handwritten word problems with hint and solution
- the course added to `content/catalog.json`, the box ticked here, the scene check page clean

The ids match `content/math-map.json`, so a finished course lights up automatically on the map page (`#/math`).
Strands: 🔢 numbers · 🍕 fractions, decimals and percent · 🧮 algebra · 📈 functions and calculus · 📐 geometry · 📏 measurement · 🎲 statistics and probability

### כיתה א׳
- [x] `numbers-to-20` מספרים עד 20 🔢
- [x] `add-sub-to-20` חיבור וחיסור עד 20 🔢
- [x] `numbers-to-100` מספרים עד 100: עשרות ויחידות 🔢
- [x] `patterns` סדרות ודפוסים 🧮
- [x] `shapes-basic` צורות: משולש, ריבוע, עיגול 📐
- [x] `compare-measure` השוואה ומדידה: ארוך, קצר, כבד, קל 📏

### כיתה ב׳
- [x] `add-sub-to-100` חיבור וחיסור עד 100 🔢
- [x] `numbers-to-1000` מספרים עד 1,000 וערך המקום 🔢
- [x] `multiplication-intro` מה זה כפל? קבוצות שוות 🔢
- [ ] `division-intro` מה זה חילוק? חלוקה שווה 🔢
- [ ] `polygons` מצולעים: צלעות וקודקודים 📐
- [ ] `length-units` מדידת אורך: סנטימטר ומטר 📏
- [ ] `time-clock` שעון וזמן 📏
- [ ] `money` כסף: שקלים ואגורות 📏

### כיתה ג׳
- [ ] `multiplication-table` לוח הכפל 🔢
- [ ] `division-remainder` חילוק עם שארית 🔢
- [ ] `numbers-to-10000` מספרים עד 10,000 🔢
- [ ] `column-add-sub` חיבור וחיסור במאונך 🔢
- [ ] `order-of-operations-basic` סדר פעולות (בסיסי) 🔢
- [ ] `fractions-intro` שברים: חצי, רבע, שליש 🍕
- [ ] `triangle-types` סוגי משולשים 📐
- [ ] `perimeter` היקף 📏
- [ ] `bar-charts` טבלאות ודיאגרמות עמודות 🎲

### כיתה ד׳
- [ ] `large-numbers` מספרים גדולים: עד מיליון ויותר 🔢
- [ ] `long-multiplication` כפל במאונך 🔢
- [ ] `long-division` חילוק ארוך 🔢
- [ ] `divisibility` סימני התחלקות 🔢
- [ ] `fractions-equivalent` שברים שווים: צמצום והרחבה 🍕
- [ ] `mixed-numbers` מספרים מעורבים 🍕
- [ ] `fractions-compare` השוואת שברים 🍕
- [ ] `angles` זוויות: ישרה, חדה, קהה 📐
- [ ] `parallel-perpendicular` ישרים מקבילים ומאונכים 📐
- [ ] `quadrilaterals` מרובעים: מלבן, ריבוע, מקבילית, מעוין, טרפז 📐
- [ ] `area-rectangle` שטח מלבן וריבוע 📏

### כיתה ה׳
- [ ] `factors-primes` מחלקים, כפולות ומספרים ראשוניים 🔢
- [ ] `fractions-add-sub` חיבור וחיסור שברים 🍕
- [ ] `fractions-multiply` כפל שברים 🍕
- [ ] `decimals-intro` שברים עשרוניים 🍕
- [ ] `decimals-add-sub` חיבור וחיסור עשרוניים 🍕
- [ ] `area-triangle-parallelogram` שטח משולש ומקבילית 📏
- [ ] `area-trapezoid` שטח טרפז ומצולעים 📏
- [ ] `volume-box` נפח תיבה 📏
- [ ] `mean` ממוצע 🎲

### כיתה ו׳
- [ ] `fractions-divide` חילוק שברים 🍕
- [ ] `decimals-mul-div` כפל וחילוק עשרוניים 🍕
- [ ] `percent` אחוזים 🍕
- [ ] `ratio` יחס ופרופורציה 🍕
- [ ] `scale` קנה מידה 📏
- [ ] `circle` מעגל: היקף, שטח ו־π 📐
- [ ] `triangle-angle-sum` סכום הזוויות במשולש ובמצולע 📐
- [ ] `solids-volume` גופים: תיבה, מנסרה, גליל 📏
- [ ] `statistics-intro` ממוצע, שכיח, חציון ודיאגרמות 🎲
- [ ] `probability-intro` הסתברות: מושגים ראשונים 🎲

Grades 7–9 follow the Ministry of Education teaching order (פריסת הוראה) for the updated junior-high program, תשפ"ז (2026–27). The month in brackets is the Ministry's. Sources: [ז׳](https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativat-Beynayim/tashpaz/prisaAmat_7.pdf) · [ח׳](https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativat-Beynayim/tashpaz/prisaAmat_8.pdf) · [ט׳](https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativat-Beynayim/tashpaz/prisaAmat_9.pdf) (reordered 2026-11-27, user request).

### כיתה ז׳
- [x] `negative-numbers` מספרים שליליים: היכרות, נגדיים, חיבור וחיסור 🔢 (ספט׳–אוק׳)
- [x] `negative-mul-div` כפל וחילוק מספרים מכוונים 🔢 (נוב׳)
- [x] `powers` חזקות עם מעריך טבעי ושורש ריבועי חיובי 🔢 (דצמ׳)
- [ ] `coordinate-plane` מערכת צירים בארבעת הרביעים 📈 (ספט׳–נוב׳)
- [ ] `angles-lines` זוויות: מדידה, אומדן, זווית שטוחה, צמודות וקודקודיות 📐 (ספט׳–אוק׳)
- [ ] `triangle-angles` זוויות במשולש: סכום, שווה שוקיים, ישר זווית 📐 (נוב׳)
- [ ] `transformations` צורות חופפות במישור והעתקות: הזזה, שיקוף, סיבוב 📐 (נוב׳–דצמ׳)
- [ ] `algebraic-expressions` המשתנה, ביטויים אלגבריים והצבה 🧮 (דצמ׳–ינו׳)
- [ ] `areas` שטחים: מלבן, משולש, מקבילית, טרפז וצורות מורכבות 📏 (דצמ׳–ינו׳, אפר׳)
- [ ] `equivalent-expressions` שוויון בין ביטויים אלגבריים: זהות 🧮 (ינו׳)
- [ ] `solids-box` גופים במרחב: קובייה ותיבה, פריסה, שטח פנים ונפח 📏 (ינו׳–פבר׳)
- [ ] `data-frequency` איסוף, הצגה וקריאת מידע: שכיחות 🎲 (ינו׳–פבר׳)
- [ ] `distributive-law` כינוס איברים דומים וחוק הפילוג 🧮 (פבר׳–מרץ)
- [ ] `relative-frequency` שכיחות יחסית (עם אחוזים) והסתברות 🎲 (פבר׳)
- [ ] `linear-equations` משוואות ממעלה ראשונה 🧮 (מרץ–אפר׳)
- [ ] `pythagoras` משפט פיתגורס ושימושיו במערכת צירים, היקפים ומסלולים 📐 (מרץ; moved from ח׳ in the new program)
- [ ] `word-problems-equations` בעיות מילוליות עם משוואות, כולל בעיות תנועה 🧮 (מאי)
- [ ] `graph-points` נקודות על גרף ברביע הראשון: קריאת גרף של מצב 📈 (מאי)
- [ ] `prism` גופים במרחב: מנסרה משולשת 📏 (מאי)
- [ ] `order-of-operations` סדר פעולות עם חזקות וסוגריים 🔢 (not a separate Ministry topic: a short bridge, build when needed)

### כיתה ח׳
- [ ] `ratio-proportion` יחס, פרופורציה וקנה מידה 🍕 (ספט׳–אוק׳)
- [ ] `parallel-lines` זוויות בין ישרים מקבילים: מתאימות ומתחלפות 📐 (ספט׳)
- [ ] `percent-applications` אחוזים: הנחה, התייקרות ושינוי 🍕 (אוק׳; moved from ז׳)
- [ ] `circle-cylinder-cone` מעגל: היקף ושטח; גליל וחרוט 📏 (אוק׳–נוב׳)
- [ ] `function-concept` מבוא לפונקציות: גרף, טבלה, ביטוי; עלייה וירידה 📈 (נוב׳)
- [ ] `data-center` שכיחות, שכיחות יחסית, טווח ומדדי מרכז 🎲 (נוב׳–דצמ׳)
- [ ] `linear-function` קצב שינוי, שיפוע והפונקציה הקווית 📈 (דצמ׳)
- [ ] `word-problems-percent-motion` בעיות מילוליות: אחוזים ותנועה 🧮 (דצמ׳–ינו׳)
- [ ] `data-two-sources` שני מקורות מידע, אינטרפולציה ואקסטרפולציה 🎲 (ינו׳)
- [ ] `congruence` חפיפת משולשים 📐 (ינו׳–פבר׳)
- [ ] `triangle-sides` צלעות במשולש: אי־שוויון המשולש 📐 (פבר׳)
- [ ] `systems-equations` מערכת משוואות בשני נעלמים 🧮 (פבר׳–מאי)
- [ ] `isosceles-triangle` משולש שווה שוקיים, משפטים הפוכים וזווית חיצונית 📐 (מרץ)
- [ ] `probability-events` הסתברות 🎲 (מרץ)
- [ ] `similarity` דמיון משולשים 📐 (מרץ–אפר׳; moved from ט׳)
- [ ] `inequalities` אי־שוויונות 🧮 (אפר׳–מאי)
- [ ] `pythagoras-3d` משפט פיתגורס במרחב 📐 (מאי)

### כיתה ט׳
The grade 9 PDF was only partly readable. The order up to the line below is the Ministry's; the rest were not seen there (check before building).
- [ ] `short-multiplication` חוק הפילוג המורחב ונוסחאות הכפל המקוצר 🧮 (ספט׳)
- [ ] `quadrilateral-proofs` דלתון, טרפז, מקבילית ומעוין: תכונות והוכחות 📐 (ספט׳–מרץ)
- [ ] `factoring` פירוק לגורמים 🧮 (אוק׳)
- [ ] `algebraic-fractions` שברים אלגבריים ומשוואות עם נעלם במכנה 🧮 (אוק׳–דצמ׳)
- [ ] `quadratic-function` הפונקציה הריבועית: פרבולה 📈 (אוק׳–מרץ)
- [ ] `quadratic-equations` משוואות ריבועיות ונוסחת השורשים 🧮
- [ ] `word-problems-quadratic` בעיות מילוליות, כולל תנועה 🧮 (מאי)
- not seen in the Ministry grade 9 plan:
- [ ] `roots` שורשים 🔢
- [ ] `scientific-notation` חזקות עם מעריך שלילי וכתיב מדעי 🔢
- [ ] `trig-right-triangle` טריגונומטריה במשולש ישר זווית 📐
- [ ] `circle-angles` מעגל: מיתרים, זוויות מרכזיות והיקפיות 📐
- [ ] `solids-pyramid-cone` גופים: פירמידה, חרוט וכדור 📏
- [ ] `statistics-spread` סטטיסטיקה: פיזור ודיאגרמות 🎲

High school follows the Ministry's new program: from תשפ"ז every student sits only the new papers. Order and placement come from the 2026–27 teaching recommendations ([3](https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativa-Elyona/mafmar/3-points-tashpaz.pdf) · [4](https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativa-Elyona/mafmar/4-points-tashpaz.pdf) · [5](https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativa-Elyona/mafmar/5-points-tashpaz.pdf) יח״ל). The process, papers and timeline are in [docs/high-school.md](docs/high-school.md). Each course is a small bite; a course used by several levels is listed once, where it is first taught.

### כיתה י׳ · 4–5 יח״ל (the first topics are shared by 4 and 5 units; ⁵ = 5 units only in י׳)
- [x] `analytic-points-segments` נקודות וקטעים במערכת צירים: מרחק ואמצע קטע 📐
- [ ] `function-graph-reading` קריאת גרף של פונקציה: חיתוך, חיוביות ושליליות, עלייה וירידה, קיצון 📈
- [ ] `analytic-lines` משוואת הישר: שיפוע, ישרים מקבילים ומאונכים 📐
- [ ] `linear-quadratic-functions` פונקציה קווית וריבועית: ייצוג גרפי ואלגברי 📈
- [ ] `analytic-shapes` משולשים ומרובעים במערכת צירים 📐
- [ ] `power-functions` פונקציית חזקה; פונקציה זוגית ואי־זוגית 📈
- [ ] `midsegments` קטע אמצעים במשולש ובטרפז 📐
- [ ] `function-transformations` פעולות על פונקציות: הזזה, מתיחה, כיווץ, שיקוף; ערך מוחלט 📈
- [ ] `similarity-theorems` דמיון משולשים: שלושת משפטי הדמיון ויחס שטחים 📐
- [ ] `derivative-concept` מושג הנגזרת: שיפוע המשיק וקצב שינוי 📈
- [ ] `polynomial-derivative` נגזרת של פולינום ומשוואת משיק 📈
- [ ] `polynomial-investigation` חקירת פולינום: גרף הפונקציה וגרף הנגזרת 📈
- [ ] `trig-right-triangle-hs` טריגונומטריה במשולש ישר זווית; שיפוע כטנגנס 📐
- [ ] `product-chain-rule` נגזרת של מכפלה ושל פונקציה מורכבת 📈
- [ ] `optimization` בעיות קיצון עם פולינום 📈
- [ ] `triangle-special-lines` מפגש התיכונים, זווית חיצונית ומשפט הפוך 📐
- [ ] `root-function` פונקציית שורש: היכרות, נגזרת וקיצון 📈
- [ ] `rational-functions-intro` פונקציה רציונלית: תחום הגדרה, אסימפטוטות ונגזרת 📈
- [ ] `stats-variables-spread` סוגי משתנים, מדדי מרכז ופיזור, סטיית תקן 🎲 (4 יח״ל)
- [ ] `probability-tables-trees` הסתברות: טבלה דו־ממדית, דיאגרמת עץ ומאורעות תלויים 🎲 (4 in י׳, 5 in י״א)
- [ ] `polynomial-factors-inequalities` פולינום כמכפלת גורמים; אי־שוויונות בדרך גרפית 📈 (⁵)
- [ ] `thales` משפט תאלס, המשפט ההפוך וההרחבות 📐 (⁵)
- [x] `triangle-in-circle` משולש חסום במעגל: זווית מרכזית והיקפית 📐 (built early as a sample)
- [ ] `circle-theorems` מעגל: קשתות, מיתרים וזוויות; מרובע חסום וחוסם 📐 (⁵; 4 in י״א)
- [ ] `analytic-circle` משוואת המעגל 📐 (⁵; 4 in י״א)
- [ ] `unit-circle` הפונקציות הטריגונומטריות במעגל היחידה; זהויות בסיסיות 📈 (⁵)
- [ ] `law-of-sines-cosines` משפט הסינוסים והקוסינוסים; שטח משולש 📐 (⁵; 4 (sines only) in י״א)

### כיתה י״א · 4 יח״ל · שאלון 35471 (plus circle-theorems, analytic-circle, law-of-sines-cosines above)
- [ ] `rational-root-calculus` חשבון דיפרנציאלי של פונקציות רציונליות ושורש, כולל קיצון 📈
- [ ] `integrals` אינטגרל: פונקציה קדומה, אינטגרל מסוים ושטחים 📈
- [ ] `normal-distribution` התפלגות נורמלית וציון תקן 🎲
- [ ] `linear-regression` מתאם ורגרסיה לינארית 🎲

### כיתה י״ב · 4 יח״ל · שאלון 35472
- [ ] `exponential-function` פונקציה מעריכית: חוקי חזקות, משוואות ואי־שוויונות 📈
- [ ] `logarithms` לוגריתמים והפונקציה הלוגריתמית 📈
- [ ] `growth-decay` גדילה ודעיכה; זמן מחצית חיים 📈
- [ ] `exp-ln-calculus` נגזרות ואינטגרלים של eˣ ו־ln x 📈
- [ ] `solid-geometry` גופים במרחב: מנסרה, פירמידה, זוויות ונפחים 📐
- [ ] `vectors-geometric` וקטורים בגישה גאומטרית ומכפלה סקלרית 📐
- [ ] `vectors-algebraic` וקטורים בהצגה אלגברית ומערכת צירים במרחב 📐
- [ ] `arithmetic-sequences` סדרה חשבונית 🧮
- [ ] `geometric-sequences` סדרה הנדסית, כולל סכום אינסופי 🧮 (5: in י״א)

### כיתה י״א · 5 יח״ל · שאלון 35571 (plus probability-tables-trees, integrals, geometric-sequences above)
- [ ] `second-derivative` נגזרת שנייה, קעירות ונקודות פיתול 📈
- [ ] `advanced-investigation` חקירה מתקדמת: פונקציות רציונליות ושורש, אסימפטוטות ואי־רציפות 📈
- [ ] `trig-identities-equations` זהויות ומשוואות טריגונומטריות 📈
- [ ] `trig-functions` נגזרות וחקירה של פונקציות טריגונומטריות 📈
- [ ] `sequences-intro` מבוא לסדרות: סדרה כללית ורקורסיה 🧮
- [ ] `induction` אינדוקציה מתמטית 🧮
- [ ] `bernoulli` נוסחת ברנולי 🎲

### כיתה י״ב · 5 יח״ל · שאלון 35572 (plus exponential-function, logarithms, growth-decay, exp-ln-calculus, vectors above)
- [ ] `analytic-distance-division` חלוקת קטע ביחס ומרחק נקודה מישר 📐
- [ ] `loci` מקומות גאומטריים 📐
- [ ] `conics` פרבולה, אליפסה והיפרבולה 📐
- [ ] `complex-numbers` מספרים מרוכבים: הצגה אלגברית וקוטבית, דה־מואבר 🔢
- [ ] `vectors-space` וקטורים במרחב: ישרים ומישורים, מרחקים וזוויות 📐

### תיכון · 3 יח״ל (topics taught inside clusters: science and society, space and shape, finance and economics)
- [x] `hs3-data-functions` קריאת מידע מגרפים ודיאגרמות; פונקציה בייצוגים שונים (י׳) 🎲
- [ ] `hs3-statistics` טבלת שכיחויות ומדדי מרכז, כולל ממוצע משוקלל (י׳) 🎲
- [ ] `hs3-probability` הסתברות כשכיחות יחסית, מאורעות דו־שלביים (י׳) 🎲
- [ ] `hs3-perimeter-area` היקפים ושטחים של צורות מורכבות, פיתגורס (י׳) 📏
- [ ] `hs3-distance-speed` דרך, מהירות וזמן (י׳) 🧮
- [ ] `hs3-linear-models` מודל קווי: שיפוע כקצב שינוי, קנייה, מכירה ורווח (י׳) 📈
- [ ] `hs3-growth-decay` גדילה ודעיכה (י״א) 📈
- [ ] `hs3-spread` סטיית תקן ושילוב מדדי מרכז ופיזור (י״א) 🎲
- [ ] `hs3-probability-2` הסתברות של שני מאורעות, תלויים ובלתי תלויים (י״א) 🎲
- [ ] `hs3-ratio-scale` יחס, קנה מידה והמרת יחידות (י״א) 📏
- [ ] `hs3-geometry` דמיון, משולשים ומרובעים מיוחדים (י״א) 📐
- [ ] `hs3-trig` טריגונומטריה במשולש ישר זווית (י״א) 📐
- [ ] `hs3-normal` התפלגות נורמלית וציון תקן (י״ב) 🎲
- [ ] `hs3-quadratic-models` מודל ריבועי (י״ב) 📈
- [ ] `hs3-linear-programming` תכנון לינארי (י״ב) 📈
- [ ] `hs3-solids` גופים במרחב: נפח ושטח פנים (י״ב) 📏
- [ ] `hs3-analytic-line` הקו הישר במערכת צירים (י״ב) 📐

### Across all math courses
- [ ] Draft the prerequisite links between topics (`requires` in math-map.json)
- [ ] Review pass by a math teacher on every course
- [ ] Check grade placement against the Ministry curriculum

## Scenes and animation engine
- [ ] Split scene types into separate modules (`js/scenes/number-line.js`, …) with a registry
- [ ] Scene type: fraction bars and pizza
- [ ] Scene type: function graph (points, line, slope)
- [ ] Scene type: balance scale (equations)
- [x] Scene type: geometry in a circle (`circle`: points, chords, angles, marks, bisectors, sliding points)
- [x] Scene type: coordinate plane (`axes`: grid, points by coordinates, segments, legs, projections, sliding points)
- [ ] Scene type: free geometry (points anywhere, not only on a circle: triangles, parallels, similarity)
- [ ] Animated solutions for the older generators (sequence, triangle-angle, length)
- [ ] Scene type: array / variables / code trace (computers)
- [ ] Scene type: binary counter (computers)
- [ ] Scene type: motion on an axis and force vectors (physics)
- [ ] Scene type: sentence builder / timeline (English)
- [ ] Scene schema and validation with clear Hebrew error messages
- [ ] Build script: pre-render scene frames to SVG files for the raw GitHub view and for social previews
- [ ] Autoplay option ("▶ play all steps")
- [ ] Optional narration (text-to-speech of the step text)

## Feed mode
- [ ] Diagnostic feed: start at the target topic, walk down to prerequisites on wrong answers
- [ ] Mix cards from several courses ("daily mix")
- [ ] Spaced repetition across days (saved wrong answers come back tomorrow)
- [ ] Encouragement rules (see the research findings in docs/team/teacher.md): praise the strategy, say the next step, stop cheering after 2–3 misses and offer an explanation or a person
- [ ] Settings: daily goal size
- [ ] Measure: how often repeated questions are answered right the second time (local stats only)

## Explanations graph ("a clearer Wikipedia")
- [ ] Concept page format (`content/concepts/<id>.md` with `requires: [...]`)
- [ ] Concept page view: explanation, worked example, scene, mini-practice, "you need first" links
- [ ] Link lesson text to concepts (e.g. `[[fractions]]`)
- [ ] "Where am I missing something?" entry point
- [ ] Graph view of a subject

## Help and community
- [ ] Verify every program in `content/help.json` is active; add Mal"at and Ministry tutoring (people and tutoring only, no external course links)
- [ ] Help list filtered by subject, age and area
- [ ] Directory of private tutors and volunteers (static JSON, submitted through a form or PR)
- [ ] "My questions": export as a list to send to a teacher
- [ ] Explore a Q&A forum (giscus / GitHub Discussions vs. alternatives that don't need accounts for minors)
- [ ] Report-a-mistake button on every lesson (opens a pre-filled GitHub issue)

## Course authoring
- [ ] JSON schemas for `catalog.json`, `course.json` and questions (reuse quizplay's game schema)
- [ ] `validate` script (Node, no build needed for the site itself)
- [ ] CI: validate on every PR (GitHub Actions)
- [ ] CONTRIBUTING.md in Hebrew: how to write a lesson, a scene, questions
- [ ] Course template folder
- [ ] "Reviewed" vs "community" badge in the catalog
- [ ] In-app editor v1: form plus live preview, drafts in localStorage, download zip
- [ ] In-app editor v2: open a pre-filled GitHub PR
- [ ] In-app editor v3: direct commit (needs a small auth service, so the first non-static piece)

## Games
- [ ] Load quizplay games on the same question files (shared module or iframe)
- [ ] Number-line game: place numbers against a timer
- [ ] Fraction-matching game
- [ ] Equation-balancing game
- [ ] Leaderboard? Probably not (competition can hurt weaker students), so research first

## Teachers
- [ ] Teacher link: `?set=…&seed=…` gives a class the same exercises
- [ ] Printable worksheet from the question bank (with an answer key on a separate page)
- [ ] Students paste back a short result code; teacher page decodes it (no backend)
- [ ] Talk to 3–5 teachers; record what they need in docs/team/teacher.md

## Research
- [ ] Answer the open questions in docs/team/researcher.md
- [ ] Privacy review for minors (Israeli privacy law; no tracking, no third-party analytics)
- [ ] Decide on Arabic version timing
- [ ] Check the Ministry content-catalog (סל תוכן) requirements for later

## Tech and infra
- [ ] Self-host marked and js-yaml (vendor them) so the site works without CDNs and offline
- [ ] Offline support (service worker) for weak connections
- [ ] Hebrew font subset and loading performance
- [ ] Simple test page that renders every scene in every lesson (catch broken YAML)
- [ ] Automated screenshot check in CI (headless Chrome)
- [ ] Decide on the final product name and domain

## Other subjects (later)
- [ ] Computers: binary, algorithms, first program (maybe reuse quizplay Java)
- [ ] Physics: motion, forces, energy
- [ ] English: Present Simple, vocabulary feed

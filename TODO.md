# TODO

Grouped by area. Rough order inside each group = priority. See [docs/product.md](docs/product.md) for the why.

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

## Exercises
- [x] Exercises page per course (`#/c/<id>/ex`): generated plus handwritten, instant check, hint, show solution, shareable seed, printable worksheet
- [ ] Guided sub-steps for hard (high-school) problems: `steps: [{ q, answer, hint }]` that lead to the final answer
- [ ] Answer types: fractions (`3/4`), several answers (`x = 2, 3`), expressions (compare by evaluating at random points)
- [ ] Geometry generators, drawn from coordinates so the figure always matches: angles in parallel lines, Pythagoras, area and perimeter, similar triangles, circle angles
- [ ] Geometry proofs: "build the proof" (order steps and pick reasons from a list), with self-check against a model proof
- [ ] Mixed review page across courses (prerequisites plus current)
- [ ] Teacher answer key page for a given seed

## Learning features (from docs/education.md)
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

One course per line, in order. **"next" (one chunk, about 10 minutes of work) = the first unchecked course below**: build it in `content/courses/<id>/`, following [docs/education.md](docs/education.md):
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
- [ ] `patterns` סדרות ודפוסים 🧮
- [ ] `shapes-basic` צורות: משולש, ריבוע, עיגול 📐
- [ ] `compare-measure` השוואה ומדידה: ארוך, קצר, כבד, קל 📏

### כיתה ב׳
- [ ] `add-sub-to-100` חיבור וחיסור עד 100 🔢
- [ ] `numbers-to-1000` מספרים עד 1,000 וערך המקום 🔢
- [ ] `multiplication-intro` מה זה כפל? קבוצות שוות 🔢
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

### כיתה ז׳
- [x] `negative-numbers` מספרים שליליים 🔢
- [ ] `negative-mul-div` כפל וחילוק מספרים מכוונים 🔢
- [ ] `powers` חזקות 🔢
- [ ] `order-of-operations` סדר פעולות עם חזקות וסוגריים 🔢
- [ ] `percent-applications` אחוזים: הנחה, התייקרות ושינוי 🍕
- [ ] `algebraic-expressions` ביטויים אלגבריים והצבה 🧮
- [ ] `distributive-law` חוק הפילוג וכינוס איברים דומים 🧮
- [ ] `linear-equations` משוואות ממעלה ראשונה 🧮
- [ ] `word-problems-equations` בעיות מילוליות עם משוואות 🧮
- [ ] `coordinate-plane` מערכת צירים 📈
- [ ] `angles-lines` זוויות בין ישרים: קודקודיות, צמודות, מתאימות, מתחלפות 📐

### כיתה ח׳
- [ ] `scientific-notation` חזקות עם מעריך שלילי וכתיב מדעי 🔢
- [ ] `short-multiplication` נוסחאות הכפל המקוצר 🧮
- [ ] `factoring` פירוק לגורמים 🧮
- [ ] `inequalities` אי־שוויונות 🧮
- [ ] `systems-equations` מערכת משוואות בשני נעלמים 🧮
- [ ] `algebraic-fractions` שברים אלגבריים 🧮
- [ ] `function-concept` מהי פונקציה? 📈
- [ ] `linear-function` הפונקציה הקווית: שיפוע ונקודת חיתוך 📈
- [ ] `pythagoras` משפט פיתגורס 📐
- [ ] `congruence` חפיפת משולשים 📐
- [ ] `isosceles-triangle` משולש שווה שוקיים 📐
- [ ] `quadrilateral-proofs` תכונות מרובעים והוכחות 📐
- [ ] `probability-events` הסתברות: מאורעות ושכיחות יחסית 🎲

### כיתה ט׳
- [ ] `roots` שורשים 🔢
- [ ] `quadratic-equations` משוואות ריבועיות ונוסחת השורשים 🧮
- [ ] `word-problems-quadratic` בעיות מילוליות: משוואות ריבועיות 🧮
- [ ] `quadratic-function` הפונקציה הריבועית: פרבולה 📈
- [ ] `similarity` דמיון משולשים 📐
- [ ] `trig-right-triangle` טריגונומטריה במשולש ישר זווית 📐
- [ ] `circle-angles` מעגל: מיתרים, זוויות מרכזיות והיקפיות 📐
- [ ] `solids-pyramid-cone` גופים: פירמידה, חרוט וכדור 📏
- [ ] `statistics-spread` סטטיסטיקה: פיזור ודיאגרמות 🎲

### תיכון: בסיס משותף (3–5 יח״ל)
- [ ] `functions-properties` פונקציות: תחום, חיתוכים, עלייה וירידה 📈
- [ ] `lines-parabolas` ישרים ופרבולות במערכת צירים 📈
- [ ] `derivative-intro` נגזרת: קצב שינוי ושיפוע משיק 📈
- [ ] `function-investigation` חקירת פונקציה (פולינומים) 📈
- [ ] `optimization` בעיות קיצון 📈
- [ ] `growth-decay` גדילה ודעיכה 🍕
- [ ] `arithmetic-sequences` סדרה חשבונית 🧮
- [ ] `analytic-basics` גיאומטריה אנליטית: מרחק, אמצע, ישרים 📐
- [ ] `trig-plane` טריגונומטריה במישור 📐
- [ ] `probability-tree-table` הסתברות: דיאגרמת עץ וטבלה דו־ממדית 🎲
- [ ] `normal-distribution` סטיית תקן והתפלגות נורמלית 🎲

### תיכון: 4–5 יח״ל
- [ ] `word-problems-motion-work` בעיות תנועה והספק 🧮
- [ ] `geometric-sequences` סדרה הנדסית 🧮
- [ ] `conditional-probability` הסתברות מותנית 🎲
- [ ] `bernoulli` נוסחת ברנולי 🎲
- [ ] `law-of-sines-cosines` משפט הסינוסים ומשפט הקוסינוסים 📐
- [ ] `euclidean-proofs` גיאומטריה אוקלידית: הוכחות 📐
- [ ] `circle-theorems` משפטים במעגל 📐
- [ ] `analytic-circle` המעגל במערכת צירים 📐
- [ ] `rational-root-functions` פונקציות רציונליות ופונקציות שורש 📈
- [ ] `integrals` אינטגרלים ושטחים 📈
- [ ] `exponents-logs` חזקות, פונקציה מעריכית ולוגריתמים 📈
- [ ] `exp-ln-calculus` נגזרות ואינטגרלים של e^x ו־ln x 📈

### תיכון: 5 יח״ל
- [ ] `induction` אינדוקציה מתמטית 🧮
- [ ] `recursive-sequences` סדרות רקורסיביות 🧮
- [ ] `trig-functions` פונקציות טריגונומטריות וחקירתן 📈
- [ ] `volume-revolution` נפח גוף סיבוב 📈
- [ ] `complex-numbers` מספרים מרוכבים 🔢
- [ ] `vectors` וקטורים 📐
- [ ] `solid-geometry` הנדסת המרחב 📐
- [ ] `conics` פרבולה ואליפסה 📐
- [ ] `loci` מקומות גיאומטריים 📐

### Across all math courses
- [ ] Draft the prerequisite links between topics (`requires` in math-map.json)
- [ ] Review pass by a math teacher on every course
- [ ] Check grade placement against the Ministry curriculum

## Scenes and animation engine
- [ ] Split scene types into separate modules (`js/scenes/number-line.js`, …) with a registry
- [ ] Scene type: fraction bars and pizza
- [ ] Scene type: function graph (points, line, slope)
- [ ] Scene type: balance scale (equations)
- [ ] Scene type: geometry (points, segments, angles)
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
- [ ] Encouragement rules (see research.md): praise the strategy, say the next step, stop cheering after 2–3 misses and offer an explanation or a person
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
- [ ] Talk to 3–5 teachers; record what they need in docs/research.md

## Research
- [ ] Answer the open questions in docs/research.md
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

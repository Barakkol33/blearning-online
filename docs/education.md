# Education: how we make material learnable

Rules for writing courses. Every new course follows them, and [the checklist at the end](#checklist-for-every-lesson) is what "done" means. Background evidence is in [research.md](research.md).

The three goals, in order:
1. **Clear:** a student can follow it alone, without a teacher next to them.
2. **Repairable:** a student who missed something earlier, or learned it wrong, can find and fix it.
3. **Curious:** the student wants to know what comes next.

## 1. Lesson shape

Every lesson follows the same arc. A predictable shape lowers the effort of reading it.

| Part | What | In our files |
|---|---|---|
| Hook | A question, story or real problem that makes the topic worth learning | First paragraph, or a `> 💡` box |
| See it | The idea shown, not told: one animated scene | `scene` block |
| Worked example | One fully solved example, step by step | Prose and a scene |
| Try it | 2–3 easy questions with instant feedback | Questions file |
| Stretch | One harder question, marked ⭐, optional | Questions file |
| Wrap-up | 2–4 bullet summary plus "where this leads" | `## לסיכום` |

### Small bites

Math is best learned in small bites:
- A lesson is 5–10 minutes and teaches **one** idea.
- A course is a few such lessons, and covers one topic from the map.
- When a topic is big (most high-school topics are), split it into several courses, not longer lessons.

## 2. Clarity rules

- **One idea per step.** A scene step is one picture plus one sentence. If a sentence needs "and also", split it.
- **Concrete before abstract.** Cookies, then cubes, then numbers, then letters. `3 + 4` before `a + b`.
- **Same word, same meaning.** Pick one term and keep it ("עשרת", not sometimes "קבוצה של עשר"). Define a term before using it.
- **Short sentences.** Grade 1–3 texts are read aloud (narration is in TODO), so write them to be heard.
- **Math in backticks.** Then it displays left to right inside Hebrew, and `-3` never turns into `3-`.
- **Don't start a Hebrew line with math or English.** Put a Hebrew word first ("התרגיל `7 + 7`…") so the raw file also displays right on GitHub.
- **Show the why, not just the rule.** "Subtracting a negative moves right because subtraction is the opposite of addition" beats "minus minus is plus".
- **Predict, then see.** Before an animation step that shows a result, ask "where will the frog land?" in the text.

## 3. Catching up on gaps

Math builds on itself. A student stuck on equations is often missing negative numbers or fractions, and doesn't know it. Every course helps them find and fix that.

- **Prerequisites are explicit.** Each topic lists what it `requires` in `math-map.json`. A lesson starts with "this lesson uses: [[negative numbers]]".
- **Warm-up check.** An optional 3-question check of the prerequisites starts each course. If it goes badly: "worth reviewing [[topic]] first". This is advice, never a lock.
- **Concept links** (see §4) make any term one tap away from a short reminder.
- **Name the misconceptions.** For each topic, list the common wrong ideas and attack them directly. For example:
  - "`-6` is bigger than `-2` because 6 > 2"
  - "`34` and `43` are the same, same digits"
  - "multiplying always makes bigger"
- **Wrong answers come from misconceptions.** Every multiple-choice distractor should be what a student with a specific wrong idea would choose. The explanation then fixes *that* idea, not just "the answer is 5".
- **Come back later.** Wrong answers return in the feed (spaced repetition). Each course ends by mixing in a few questions from its prerequisites.
- **The stuck button is part of the lesson.** "🤔 עדיין לא הבנתי" saves the spot and points to a person (see product.md).

## 4. Concept links: a clearer Wikipedia

Any term in a lesson can link to its concept, the way Wikipedia does, but kinder:

- **Tap or hover:** a small card with a 1–2 sentence definition, a tiny example or picture, and a "לנושא המלא ←" link to the course.
- **The full page:** one page per concept, with explanation, worked example, scene and mini-practice, plus the "you need first" and "leads to" links.

Authoring (planned):

```md
המספרים `3` ו־`-3` הם [[opposite-numbers|מספרים נגדיים]].
```

`content/concepts/opposite-numbers.md` holds the short card text and the full explanation. One concept can be linked from many lessons, so a definition is written once and fixed once.

## 5. Mini-games

Here and there, never instead of learning.

- **The mechanic is the skill.** Place the number on the line, build the number from rods, balance the scale. No "answer to earn a turn" games.
- **Short:** 1–2 minutes, with a clear end.
- **After the idea is taught**, as practice, not as the first exposure.
- **No punishing timers for beginners.** A timer is an optional challenge mode.
- **Score against yourself** ("your best: 12"), not leaderboards. Competition discourages weaker students.

Ideas by topic:

| Topic | Game |
|---|---|
| Numbers to 20 / 100 | "Frog jump": tap where the frog lands. "Build it": make 47 from rods and cubes |
| Addition and subtraction | "Make ten": pop pairs that sum to 10 |
| Negative numbers | "Elevator": floors below zero; reach the target floor |
| Fractions | "Pizza cut": cut and share fairly; order fractions on a line |
| Equations | "Balance": keep the scale level while unwrapping x |
| Coordinates | "Treasure map": find the point |
| Probability | "Run the experiment": roll 100 dice and watch the bars settle |

## 6. Curiosity: stories and real life

Math is people solving hard problems for thousands of years, and it solves problems you meet every day. Each course should have at least one of each:

### `> 📜 סיפור`: a story from history

A short, true story connected to the topic. **Check every fact against a reliable source before publishing.** Candidates:
- **Zero:** how a symbol for "nothing" developed in India (Brahmagupta's rules for zero, 7th century) and changed arithmetic.
- **Negative numbers:** Chinese counting rods, red for positive and black for negative, in *The Nine Chapters on the Mathematical Art*. Many European mathematicians resisted negative numbers for centuries.
- **Our digits:** Hindu-Arabic numerals reached Europe partly through Fibonacci's *Liber Abaci* (1202), which replaced Roman numerals.
- **Al-Khwarizmi** (Baghdad, 9th century): his name gave us "algorithm", and his book title gave us "algebra".
- **Gauss as a schoolboy** adding 1 to 100 in seconds. A famous story, possibly embellished, so say so.
- **Eratosthenes** measured the size of the Earth with shadows and geometry.
- **Archimedes** trapped π between polygons.
- **Babylonian tablets** (Plimpton 322) show Pythagorean triples over 1,000 years before Pythagoras.
- **Euler and the seven bridges of Königsberg**: the birth of graph theory.
- **Fermat's Last Theorem:** a note in a margin, then 350 years until Andrew Wiles proved it.

### `> 🛒 בחיים`: a real problem

A situation the student actually meets:
- negatives: temperature on the Hermon, floors below ground, a bank balance;
- percent: a "30% off" sale, phone battery;
- fractions: sharing a pizza, doubling a recipe;
- ratio and scale: reading a map, mixing juice;
- linear functions: a taxi fare, a phone plan;
- statistics: whether "the average" tells the whole story;
- probability: whether a game is fair.

### Curiosity hooks

- **Open with a puzzle** the lesson will solve.
- **⭐ challenge questions**, optional and clearly harder.
- **"Why does this work?"** boxes for students who want more.
- **"Where this leads":** each wrap-up names the next topic and why it's cool.

## 7. Exercises

Math is learned by doing. Every course has a long exercises page (`exercises.json`):

- **Generated sections:** fresh exercises every visit, from a seed in the URL, so a teacher can share "the same 30 exercises". Good for skills you practise many times.
- **Handwritten sections:** word problems, real-life problems and ⭐ challenges. Every one has a `hint` (a nudge, not the answer) and a `solution` (the full reasoning).
- **Retrying is the default.** A wrong answer says "try again"; after 2 misses it points to the hint, and after 3 to "🤔 still don't get it".
- **High school:** hard problems get `hint` and `solution` now. Later, `steps`: sub-questions that lead to the answer, each with its own check.

### Geometry exercises

Geometry is the hard case: figures, many facts at once, and proofs. Approach, from easy to hard:

1. **Generated numeric problems** (angles, areas, Pythagoras, similarity): pick the numbers first, then *compute the figure from them* (coordinates), so the picture always matches the question. See the `triangle-angle` generator.
2. **Handwritten problems with a figure** (SVG in the file, or a `scene`): for multi-step bagrut-style problems; checked by the final numeric answer, with a hint and a solution.
   - **Animated solutions:** the solution can be a `scene`, one reasoning step per frame: what's given → which rule applies (highlight the shapes it talks about) → the computation. End with a check when one exists (e.g. move a point and show the angle doesn't change). The `circle-angle` generator builds its solution scene from the same numbers as the question. See the `triangle-in-circle` course.
3. **Proofs:** these can't be auto-checked as free text. Instead: "build the proof", where the student orders the given statements and picks the reason for each from a list (quizplay already has `order` and `match` types). Then a model proof to compare against.
4. **Sources:** teacher-written banks and our own adaptations. Check licensing before using any exam text. Drafts may be machine-assisted, but each one is reviewed and its math checked by a person.

## 8. Game mode: off, light, full

Each viewer picks how game-like the site feels (🏅 chip in the top bar, then "כמה משחק?"):

| Mode | What shows |
|---|---|
| 📖 off (בלי משחק) | Just learning: lessons, exercises and ✔ for finished lessons. No points, achievements, goals or streaks |
| 🏅 light (קצת משחק), the default | Progress bars, scores, daily goal, achievements |
| 🎮 full (הרבה משחק) | Also ⭐ points, levels, "+5 ⭐" pops and confetti on big moments |

Rules for the game layer (rewards can hurt motivation, see research.md):
- **Reward what helps learning:** persistence ("לא מוותרים": solved after two misses), asking for help ("שואלים זה חכם"), accuracy, practice. Never just speed.
- **Points are small and informative.** Nothing is locked behind points.
- **No leaderboards.**
- **Celebrate only real moments:** a perfect lesson check, a finished course.
- **Code:** add an achievement in `js/game.js`, and give UI that should hide in "off" the class `g-light` (or `g-full` for full only).

## 9. Feedback and encouragement

From research (praise and feedback studies):
- Praise the **strategy** ("you completed to ten, nice"), not the person ("genius").
- Every wrong-answer message says **what to do next**.
- Keep praise proportional; no fireworks for an easy question.
- After 2–3 misses in a row, stop cheering. Offer an easier step, the concept link, or a person.
- Points and streaks are small and informative, never the goal.

## Checklist for every lesson

- [ ] Hook: a question, story or real problem
- [ ] At least one scene; each step is one picture plus one sentence
- [ ] A worked example
- [ ] Terms defined before use; prerequisites linked
- [ ] Questions: easy ones first, one ⭐ stretch, distractors from real misconceptions, explanations that fix the misconception
- [ ] Summary, plus "where this leads"
- [ ] Per course: at least one `📜 סיפור` and one `🛒 בחיים`, facts checked
- [ ] Per course (when available): one mini-game
- [ ] Scene check page shows no broken scenes; math double-checked

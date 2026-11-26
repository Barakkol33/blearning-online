# Product: ideas and features

Status: ✅ in POC · 🟡 next · ⚪ later

## Core idea

**One topic = one folder of files.** The same files produce:
- the lesson (with animations);
- a static or print view;
- quizzes;
- the swipe feed;
- games (later).

## Features

### Courses and lessons
- ✅ Catalog with subject filter and progress per course.
- ✅ Course page: outcomes, lesson list, continue button.
- ✅ Lessons in Markdown, with inline `math` shown left to right inside Hebrew.
- ✅ Quiz at the end of each lesson (quizplay `mcq` / `truefalse` format).
- 🟡 More question types from quizplay: typein, order, match, cloze.

### Animated scenes
- ✅ `scene` blocks in Markdown: steps, each a full picture plus one sentence.
- ✅ Number line, with a hopping marker, unit arcs and labels.
- ✅ The same scene renders animated, as still frames (static or print), and one step per feed card.
- ✅ Respects reduced-motion settings.
- 🟡 Scene types: fraction bars, function graph, geometry, force vectors, array or code trace, binary, sentence builder.
- ⚪ Custom JS widget per lesson, which must ship a still fallback.
- ⚪ Build step that pre-renders frames to SVG, so even the raw GitHub view shows the pictures.

### Feed ("TikTok mode")
- ✅ Vertical swipe through a course: explanation cards from scene steps, mixed with question cards.
- ✅ Wrong answers come back about 4 cards later.
- ✅ Swipe right or left to answer true/false.
- ✅ Daily goal of 10 and a streak, as a natural place to stop.
- 🟡 A short diagnostic mode that finds the missing prerequisite.

### Stuck and help
- ✅ "🤔 still don't get it" on scenes, wrong answers and the whole lesson.
- ✅ Saves the exact spot to "my questions" on the home page, with "✔ got it" to clear.
- ✅ Ask now: WhatsApp share with a deep link, or copy the text.
- ✅ Help list from `content/help.json`: teacher, friend, Perach. People and tutoring only, no links to external courses.
- ⚪ Lists of private tutors and volunteers by subject and area, as a static directory.
- ⚪ Q&A forum, possibly GitHub Discussions via giscus. Minors can't easily have GitHub accounts, so this needs thought.

### Explanations as a graph ("a clearer Wikipedia")
- 🟡 Concept pages that link to their prerequisites ("to understand this, you need…").
- 🟡 Each concept: worked example, then animation, then practice.
- ⚪ Graph view of a subject.

### Encouragement
- 🟡 Message rules: praise the strategy, say the next step, no "genius".
- 🟡 After 2–3 wrong answers in a row: stop cheering and offer an easier step or a person.

### Progress
- ✅ localStorage only; export/import a progress code between devices.
- ⚪ Optional sync and teacher class view. This is the first backend piece; only when needed.

### Community courses
- Decision: no links to external courses for now. All courses live in this repo and come in by pull request.
- 🟡 Course schema and validator, as in quizplay `npm run validate`.
- ⚪ "Reviewed" and "community" tiers, plus a way to report a problem.
- ⚪ In-app editor: drafts in localStorage, then a zip download, a pre-filled GitHub PR, or (later) a direct commit.

### Games
- ⚪ Reuse quizplay games on the same question files.
- ⚪ Games where the mechanic is the skill (for example, place numbers on the line against a timer), not a quiz with a game stuck on top.

## Ideas parking lot

- Arabic version (biggest achievement gap).
- Teacher links: `?set=…&seed=…` to give a whole class the same exercise.
- Printable worksheet generated from the question bank.

# Goals

## Vision

A free, open, Hebrew learning site for Israeli students and teachers, like Udemy but built for school: **courses + material + animated explanations + games**, starting with math.

Many students and teachers should be able to use it with zero setup: no login, no install, no cost.

## Principles

1. **Files first.** All content is plain text files (Markdown, JSON, YAML). Every feature, whether lessons, feed, games, print view or a future editor, only reads or writes those files.
2. **Shown plainly too.** Every page works without animation: a static view, a print view and the raw file on GitHub.
3. **Static hosting.** GitHub Pages and localStorage. No backend until there is a proven need.
4. **Open.** Content under CC BY-SA, code under MIT, so schools and teachers can copy, fix and fork.
5. **Help, don't replace.** Point stuck students to people (teachers, volunteers, tutors) instead of competing with them.
6. **Encourage honestly.** Praise strategy and effort, not "you're smart". Don't overpraise. Have natural stopping points (see [research.md](research.md)).

## Audience and order

- Subjects: **math → computers → physics → English**.
- Levels: elementary and high school.
- Language: Hebrew first. Arabic is a strong second candidate because of the size of the achievement gap (see research). English later.

## Phases

| Phase | Goal | Done when |
|---|---|---|
| 0. POC | One course end to end: lesson, animated scene, quiz, feed, "stuck" flow | Feels right on a phone, and one teacher has seen it |
| 1. Math core | 7th–8th grade math, with the topics most often missing underneath: fractions, negative numbers, equations | About 10 courses; a teacher uses it in class |
| 2. Gaps | Short diagnostic quiz plus a concept graph with prerequisite links | A stuck student is routed to the missing topic automatically |
| 3. Community | Others add courses as text files, by pull request to this repo (no links to external courses for now) | First outside course merged |
| 4. Editor | In-app course editor that writes the same files | A teacher builds a course without touching Git |
| 5. More subjects | Computers, physics, English; maybe Arabic | — |

## Non-goals (for now)

- Accounts, grades or a teacher dashboard with a backend.
- Video production.
- AI tutoring. The Ministry is piloting it with Kaltura and YuviLab (see [market.md](market.md)).

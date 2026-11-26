# Market: what exists today

Surveyed November 2026. Re-check before relying on any detail.

## Summary

Nothing found is **free + open + Hebrew-first + K–12 + material and games together**. Existing players are either:
- locked to schools (Ofek, Kaltura);
- paid (GOOL, Matific);
- university level (Campus IL, Math-Wiki).

The gap is: open, no login, plain-file material that teachers can read, print and fix, with games built on the curriculum's own questions.

## Government and semi-government

| Name | What it is | Notes |
|---|---|---|
| [Campus IL](https://campus.gov.il/en/) | National free course site (edX based), run by Digital Israel and the Council for Higher Education | Has bagrut-prep courses; university-style video plus quiz; little for elementary |
| [Ofek, by CET (מט"ח)](https://myofek.cet.ac.il/he) | School learning system with interactive activities and games | About 2,300 schools (2018); behind school login; not open |
| [Ministry pedagogical portal](https://pop.education.gov.il/tchumey_daat/matmatika/chativa-elyona/teaching-mathematics/preparatory-courses-for-matriculation/) | Free bagrut-prep courses for 3–5 units of math, recorded lessons | Also free self-paced courses for grades 7–9 |
| Project 720 (Ministry AI program) | Kaltura AI tutors for grade 7–8 math and science (20-school pilot); YuviLab "Spark" for English (180 schools) | Announced November 2026 ([Kaltura](https://www.globenewswire.com/news-release/2026/11/03/3394178/0/en/kaltura-selected-by-israel-s-ministry-of-education-to-power-personalized-ai-learning-in-k-12-schools.html), [JNS](https://www.jns.org/feature/israels-ai-classroom-experiment-is-going-national)) |

## Commercial

| Name | What it is |
|---|---|
| [GOOL](https://bagrut.gool.co.il/) | Paid bagrut video courses; first chapter free |
| Matific, Mathika | Israeli math-games products sold to schools |
| [KedMathic](https://kedmathic.co.il/en/) | AI math practice in Hebrew |
| YuviLab | Kids build learning games; in the Ministry catalog |
| — | Tracxn counts 83 Israeli gamified-education startups |

## Open and community

| Name | Notes |
|---|---|
| [Math-Wiki](https://math-wiki.com/) | About 100 courses, university level |
| Khan Academy in Hebrew | Appears stalled: [hebkhan](https://github.com/hebkhan) repo last updated 2017 |
| [limud-app](https://github.com/jbrav-lab/limud-app) | Individual's grade-5 Hebrew math app |
| Duolingo Hebrew | Weak course, so English for Hebrew speakers is also a gap |

## Static course tooling (possible building blocks)

[oer-template](https://github.com/open-education-hub/oer-template), [vibe-learn](https://awesome.ecosyste.ms/projects/github.com%2Fjmilne22%2Fvibe-learn), [docsify course kit](https://github.com/hibbitts-design/docsify-open-course-starter-kit), [LibreLingo](https://szabgab.com/librelingo). None covers RTL plus scenes plus games, so we build our own small engine.

## Our related projects

- **blearning:** mostly static published material (Astro).
- **quizplay:** games from JSON question files. This site uses the same question format so the games can be shared.

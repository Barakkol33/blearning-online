# Research

Questions we're asking, what we found, and what it means for the product. Evidence strength is noted, because some popular ideas are weaker than they sound.

## Open questions

- [ ] Which prerequisite gaps are most common in grades 7–8 math? Ask teachers; check Meitzav topic breakdowns.
- [ ] What makes a teacher actually use a free site? Interview 3–5 teachers.
- [ ] Does a swipe feed lead to real learning or just scrolling? Measure retention on repeat questions.
- [ ] When should encouragement stop? Define rules and test them.
- [ ] Which Israeli help programs are still active? Verify the list in `content/help.json`.
- [ ] Privacy rules for a site used by minors, even with no accounts.
- [ ] Is an Arabic version worth doing early?

## Q: Why do students struggle, especially in math?

### 1. Hidden gaps they can't name: supported

- **Math builds on itself.** Early math skills strongly predict later achievement ([Duncan 2007](https://www.apa.org/news/press/releases/2007/11/school-readiness)). Fractions and division in 5th grade predict high-school algebra ([Siegler 2012](https://news.umich.edu/fractions-are-the-key-to-math-success-new-study-shows/)).
- **Mastery learning** (don't move on until the prerequisite is solid) has an effect of about 0.5 SD across studies ([Kulik 1990, via Slavin](https://www.gwern.net/doc/psychology/1987-slavin.pdf)). Bloom's "2 sigma" claim is not supported.
- **Worked examples** beat unguided problem solving for beginners. The advantage fades as students gain expertise, the "expertise reversal" effect ([Kalyuga 2010](https://link.springer.com/doi/10.1007/s10648-010-9134-7)).
- **Precedent:** Math Academy and ALEKS use prerequisite graphs plus diagnostics. Their effectiveness claims come from the vendors.
- **For us:**
  - Build a concept graph with prerequisite links.
  - Since students can't name their gap, add a **short diagnostic** that walks down the prerequisites. A graph to browse on its own isn't enough.
  - Each concept: worked example first, then fade to practice.
  - The deepest nodes: fractions, division, negative numbers.

### 2. "I can't do it": needs careful design

- **Math anxiety** has a reliable small-to-moderate negative link with achievement ([Barroso 2021](https://epic.tc.columbia.edu/research/academic-alert/blog-posts/the-relation-between-math-anxiety-and-math-achievement)).
- **Growth-mindset interventions** have small effects ([Sisk 2018](https://englelab.gatech.edu/articles/2018/Sisk,%20Burgoyne%20et%20al.%20(2018)%20-%20Mindset%20and%20Academic%20Achievement.pdf); [Macnamara 2023](https://www.gwern.net/doc/statistics/meta-analysis/2023-macnamara.pdf); still disputed). Don't build the site around mindset slogans.
- **Praise:** praising intelligence leads to choosing easier tasks ([Mueller & Dweck 1998](https://www.columbia.edu/cu/psychology/courses/3615/Readings/Mueller_Dweck.pdf)). Inflated praise backfires for children with low self-esteem ([Brummelman 2014](https://www.psychologicalscience.org/news/releases/when-being-called-incredibly-good-is-bad-for-children.html)).
- **Feedback** helps on average, but over a third of feedback interventions *lowered* performance, especially when feedback pointed at the self ([Kluger & DeNisi 1996](https://cris.huji.ac.il/en/publications/the-effects-of-feedback-interventions-on-performance-a-historical/)). Feedback about the task and process works best ([Hattie & Timperley 2007](https://www.uky.edu/~gmswan3/575/Hattie_Timperly_2007.pdf)).
- **Rewards:** tangible rewards tied to performance undermine intrinsic motivation ([Deci 1999](https://pubmed.ncbi.nlm.nih.gov/10589297/)). Gamification shows small positive effects ([Sailer & Homner 2020](https://opus.bibliothek.uni-augsburg.de/opus4/frontdoor/index/index/docId/109056)).
- **Rules for encouragement:**
  - Praise the strategy ("you checked the sign").
  - Always say what to do next.
  - Keep praise proportional to the result; no "genius".
  - Points and streaks are small and informative, never the goal.
  - After repeated wrong answers, stop cheering and **offer an explanation or a person**.

### 3. Human help: strongly supported

- **Tutoring** effect: 0.29 SD overall, 0.27 SD for math, across 89 randomized trials ([Nickow et al. 2024](https://nssa.stanford.edu/studies/promise-tutoring-prek-12-learning-systematic-review-and-metaanalysis-experimental-evidence)). Non-professional tutors help too, especially in disadvantaged communities ([Karsenty 2010](https://www.weizmann.ac.il/ScienceTeaching/Karsenty/sites/ScienceTeaching.Karsenty/files/uploads/Karsenty%202010%20in%20ESM.pdf)).
- **Israeli options:**
  - [Perach (פר"ח)](https://www.perach.org.il): about 22,000 student tutors.
  - Mal"at (מל"ת): free one-on-one math with volunteers, referred through welfare services.
  - Ministry free tutoring and courses.
  - Ani10 (free math videos).
  - Volunteer organizations such as Push (פוש) and Latet.
- No active free Hebrew homework forum was found. That is a possible community feature later.
- **For us:** the "🤔 still don't get it" flag leads to "ask someone now" or "keep it for later", with links to these options.

### 4. Math first: strongly supported

- **TIMSS 2023:** Israeli 8th-grade math fell 519 → 487, from 9th to 23rd place ([Globes](https://en.globes.co.il/en/article-israel-slumps-in-intl-maths-and-science-tests-1001496085)).
- **Latest PISA (September 2026):** Israeli math fell 458 → 433, below the 2006 level ([Calcalist](https://www.calcalistech.com/ctechnews/article/syh1111u6ogg)).
- **Hebrew–Arabic gap** of about 100 points in PISA 2022 math: 62% vs 23% at basic proficiency ([OECD](https://www.oecd.org/en/publications/pisa-2022-results-volume-i-and-ii-country-notes_ed6fbcc5-en/israel_056c6cf0-en.html)).
- **Correction:** the number of 5-unit math students *rose* about 80% after 2012 ([Taub](https://www.taubcenter.org.il/en/research/raising-the-bar-are-enough-israeli-students-taking-advanced-math-and-english/)), so don't claim it is declining.
- **Teacher shortage** is disputed ([Taub 2025](https://www.taubcenter.org.il/en/pr/snr-2025-education/)).

### Abroad

- **US NAEP math** is still below 2019, and chronic absenteeism doubled ([NPR](https://www.npr.org/2025/01/29/nx-s1-5270880/math-reading-covid-naep)).
- **Phones:** 65% of students are distracted by devices in math lessons ([OECD, PISA 2022](https://www.oecd.org/en/about/news/press-releases/2023/12/decline-in-educational-performance-only-partly-attributable-to-the-covid-19-pandemic.html)). So the feed mode must feel like practice, not scrolling.

### "Students have all the information, they're just lazy"

Partly true: access to information is no longer the bottleneck. What's missing is:
- a clear next step;
- fast feedback;
- small wins;
- a fair fight for attention against apps engineered to be easy.

The design answer is small, active steps with instant feedback, not more material.

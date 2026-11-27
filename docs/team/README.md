# The team: how a chapter gets made

Every chapter (course) goes through a chain of roles, **one after the other**. Each role reads the files of the roles before it, does only its own job, and hands off a file. Claude plays every role in order, in one session. At each step it reads that role's job description first and works by it.

```
manager ──► teacher ──► product ──► developer ──► teacher (coverage) ──► manager (review)
 scope      1-teacher.md 2-product.md 3-developer.md                       commit, report
                ▲
   researcher ──┘  (when the user asks, or every 3 chapters: challenge mode)
```

| Role | Job description | Decides | Writes |
|---|---|---|---|
| Manager | [manager.md](manager.md) | **Which** chapter, its scope, and whether it's done. Holds the vision, principles and phases | Scope at the top of `1-teacher.md`; `TODO.md`; the check-in log |
| Teacher | [teacher.md](teacher.md) | **What** is learned: sub-chapters, the points of each, the content. Holds the writing rules and the research findings | `plan/1-teacher.md` |
| Product | [product.md](product.md) | **What the student gets:** which features each sub-chapter uses. Holds the feature menu | `plan/2-product.md` |
| Developer | [developer.md](developer.md) | **How** it's built: reuse, extend or new; then builds and checks | `plan/3-developer.md` + the course |
| Researcher | [researcher.md](researcher.md) | **What's true** about learning. Challenges the teaching rules | The research findings section in `teacher.md` |

The `plan/` files go in the course folder, `content/courses/<id>/plan/`. The site doesn't load them. Each role's job description ends with its template.

## Rules for every role

- **Stay in your lane.** The teacher doesn't pick features. Product doesn't change what is taught. The developer doesn't change the content or the feature choice.
- **Disagree in writing; don't override.** If a role sees a problem in an earlier file, it adds a `## הערות לשלב הקודם` section ("notes for the previous step") to its own file and says what it would change. Then it works around the problem in its own lane. If the problem blocks the work, it stops and asks the user.
- **Hand off complete.** The next role must be able to work from your file alone.
- **Short.** A handoff file fits on one or two screens.
- **Hebrew for content, English for code.**

## Order of work in a "next" chunk

1. **Manager:** pick the next chapter (grade 7 and up) and write the scope.
2. **Teacher:** write `plan/1-teacher.md`.
3. **Product:** write `plan/2-product.md`.
4. **Developer:** write `plan/3-developer.md`, build, and run the checks.
5. **Teacher, coverage check:** tick every point against the built lessons and exercises. Fix gaps.
6. **Manager, review:** check against the goals, then commit, push and report each role's decisions in a few lines. Add 1 to the research counter. At 3, run the researcher in challenge mode.

The user can stop the chain after any step ("stop after teacher") to review a file first.

## Why not parallel subagents

The roles depend on each other: product needs the teacher's points, and the developer needs both. Running them in parallel would mean guessing. Separate subagents would also each start cold and re-read the whole project. One session that switches roles keeps the context and leaves a written handoff at each step.

Other docs: [market.md](../market.md), set aside for now.

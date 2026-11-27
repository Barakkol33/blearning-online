# The team: how a chapter gets made

Every chapter (course) goes through a chain of roles, **one after the other**. Each role reads the files of the roles before it, does only its own job, and hands off a file. Claude plays every role in order, in one session. At each step it reads that role's job description first and works by it.

**The user says "next" → the manager is activated.** It checks the next task, decides whether the researcher is needed first, and then makes the rest of the team work on the task (see [manager.md](manager.md#next-the-user-activates-you)).

```
"next" ─► manager ─(research needed?)─► researcher ─┐
            │ no                                     │ updates teacher.md
            ▼                                        ▼
          teacher ──► product ──► developer ──► teacher (coverage) ──► manager (review)
          1-teacher.md 2-product.md 3-developer.md                       commit, report
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

1. **Manager** (activated by "next"): pick the next chapter (high school, from grade 10), decide whether research is needed (counter at 3, a new stage, or a relevant open question), run the researcher if so, and write the scope.
2. **Teacher:** write `plan/1-teacher.md`.
3. **Product:** write `plan/2-product.md`.
4. **Developer:** write `plan/3-developer.md`, build, and run the checks.
5. **Teacher, coverage check:** tick every point against the built lessons and exercises. Fix gaps.
6. **Manager, review:** check against the goals, then commit, push and report each role's decisions in a few lines. Add 1 to the research counter. At 3, run the researcher in challenge mode.

The user can stop the chain after any step ("stop after teacher") to review a file first.

## Running it: one subagent per chapter

To save the main session's context, each "next" runs the chapter in **one subagent** (general-purpose). The main session acts only as the thin manager loop.

1. **Main session (manager):**
   - Read `TODO.md` and the check-in counter in [manager.md](manager.md).
   - Pick the chapter and decide on research.
   - Spawn one subagent with the prompt below.
2. **The subagent:** runs the whole chain for that one chapter (researcher if asked → teacher → product → developer → coverage → review), commits and pushes. It returns a report of at most 15 lines:
   - the chapter, and its commit hash;
   - what each role decided, in one line each;
   - the check results;
   - what is still weak.
3. **Main session:** relays the report to the user. Nothing else from the chapter enters its context.

Prompt for the subagent:

> Build the next blearning-online chapter: `<course-id>` (repo c:\projects\blearning-online). Follow docs/team/README.md: read each role's job description before playing it, and write `content/courses/<id>/plan/1-teacher.md`, `2-product.md` and `3-developer.md`. Research first: `<no | question mode: … | challenge mode>`. Run the developer checks, using small cropped screenshots. Commit and push (approved), and update the counter and log in manager.md. Reply with a report of at most 15 lines: chapter, commit, one line per role, checks, what is weak.

**Why one subagent per chapter, not per role:** the roles depend on each other, so they run in order inside one agent that keeps its context between roles. One agent per role would start cold at every step. One agent per chapter starts cold only once, and that's cheap because everything it needs is in these files.

**Looping:** the user can type `/loop next`. The main session then runs one chapter subagent after another, and the research check-in comes up by itself every 3 chapters. Each round is reported, committed and pushed separately.

Other docs: [market.md](../market.md), set aside for now.

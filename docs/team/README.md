# The team: how a chapter gets made

Every chapter (course) goes through three roles, **one after the other**. Each role reads the files of the roles before it, does only its own job, and hands off a file. Claude plays all three roles in order, in one session. At each step it reads that role's job description first and works by it.

```
teacher  ──►  product  ──►  developer  ──►  done
1-teacher.md  2-product.md  3-developer.md  + the course files
```

| # | Role | Job description | Decides | Writes |
|---|---|---|---|---|
| 1 | Teacher | [teacher.md](teacher.md) | **What** is learned: sub-chapters, the points of each, the content | `plan/1-teacher.md` |
| 2 | Product | [product.md](product.md) | **What the student gets:** which features each sub-chapter uses | `plan/2-product.md` |
| 3 | Developer | [developer.md](developer.md) | **How** it's built: reuse or new code, files, checks | `plan/3-developer.md`, then the course itself |

All three files go in the course folder, `content/courses/<id>/plan/`. The site doesn't load them. Each file uses the template in its role's job description.

## Rules for every role

- **Stay in your lane.** The teacher doesn't pick features. Product doesn't change what is taught. The developer doesn't change the content or the feature choice.
- **Disagree in writing; don't override.** If a role sees a problem in an earlier file, it adds a `## הערות לשלב הקודם` section ("notes for the previous step") to its own file and says what it would change. Then it works around the problem in its own lane. If the problem blocks the work, it stops and asks the user.
- **Hand off complete.** The next role must be able to work from your file alone, without guessing.
- **Short.** A handoff file fits on one or two screens. Use lists, not essays.
- **Hebrew for content, English for code.** Teacher and product files are in Hebrew. The developer file may be in English.

## Order of work in a "next" chunk

1. **Teacher:** read [teacher.md](teacher.md) and [education.md](../education.md). Write `plan/1-teacher.md`.
2. **Product:** read [product.md](product.md) and `1-teacher.md`. Write `plan/2-product.md`.
3. **Developer:** read [developer.md](developer.md) and both files. Write `plan/3-developer.md`, then build: lessons, questions, exercises, code. Then run the checks.
4. **Coverage check (teacher again, short).** Tick every point in `1-teacher.md` against the built lessons and exercises. Missing points get fixed before commit.
5. Commit and push. Report to the user what each role decided, in a few lines each.

The user can stop the chain after any step ("stop after teacher") to review a file before the next role starts.

## Why not parallel subagents

The roles depend on each other: product needs the teacher's points, and the developer needs both. Running them in parallel would mean guessing. Separate subagents would also each start cold and re-read the whole project. One session that switches roles keeps the context and leaves a written handoff at each step. That's what makes the work reviewable.

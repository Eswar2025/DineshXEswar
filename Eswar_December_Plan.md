# Eswar's December Plan (2026)

December is my month to become a disciplined version of myself. The two big goals:

1. **DSA:** stop being afraid of **trees and graphs**. Learn the patterns properly and solve about 80 problems.
2. **Development:** finish the frontend handbook, the Scrimba course, and the frontend practice projects (two planned, two stretch), all written with my own hands.

The full-stack project (Split Expenses) is **not** part of December. It would be too much on top of this plan, so it starts later. Dinesh builds it in December.

---

## 1. Time I actually have

| Item | Days |
|---|---|
| Study window: 5 Dec to 30 Dec (home evening of 4 Dec, return train on 31 Dec) | 26 |
| Family buffer days (enjoy time with family, books optional) | 5 |
| **Study days** (26 minus 5) | **21** |

Daily budget on a study day:

| Block | Hours | 21 days |
|---|---|---|
| DSA | about 4 | about 84 h |
| Development | 3 to 4 | about 63 to 84 h |

Contests: **6 in December** (4 weekly on the Sundays 6, 13, 20, 27 Dec, plus 2 biweekly on Saturdays). A contest day uses the DSA block for the contest and the upsolve. The biweekly Saturdays can be picked from the LeetCode contest page, so those two rows in the calendar just say "or biweekly contest".

---

## 2. DSA plan: trees and graphs

### The numbers

| Topic | Target |
|---|---|
| Graphs (from my star sheet, the top ones) | 30 to 35 |
| Trees (from my star sheet) | 20 to 25 |
| Normal days (about 15 days x 4 questions) | about 60 |
| Contest problems and upsolves (6 contests) | about 20 |
| **Total** | **about 80** |

If I get confident in both topics, I can add another topic in the last week. It depends on how the coding goes.

### Order: trees first, then graphs

Trees train recursion. Graphs are trees with cycles, so the tree habits carry over.

**Trees (about 6 days):** traversals (pre/in/post/level), height and depth, diameter and path sum, BFS by levels, BST problems, lowest common ancestor, and building or serializing a tree.

**Graphs (about 9 days):** adjacency list and the BFS/DFS templates, connected components, grid problems (islands, flood fill), shortest path on unweighted graphs and multi-source BFS, cycle detection (undirected and directed), topological sort, union-find (DSU), Dijkstra, and bipartite checks.

Everything goes in C++. Notes and solutions use the repo folders `DSA/10_Trees_and_BST/` and `DSA/16_Graphs/` (one `Qn/notes.md` per problem, with my approach, TC/SC and Dinesh's analysis).

### Daily DSA routine (4 problems, about 4 hours)

For every problem:

1. **Try alone first.** Draw the tree or graph on paper, then think and code.
2. **If stuck,** read one hint only, then try again.
3. **After that,** read the solution, then close it and **retype from memory**.
4. **Write the notes:** approach in my own words, TC/SC, and what confused me.
5. **Rate it:** how much did I hesitate (1 = smooth, 5 = lost)? Anything rated 4 or 5 is redone 2 days later.

### Rules to beat the fear

- Before coding, say in one sentence what the function returns: "`dfs(node)` returns the height of that subtree."
- Dry-run on the smallest example (3 nodes) before running anything.
- Write the BFS and DFS templates from memory every day for the first week.
- Read the problem twice. Name the pattern before touching the keyboard.
- A problem that I could not solve is not a failure. It goes on the redo list.

### Contest days

Take the contest, then upsolve the problems I missed. Write down in the notes what pattern I did not see in time.

---

## 3. Development plan

### Order

1. **Frontend handbook** (`DEV/Frontend/Frontend_Handbook.html`): 4 days, finish it completely and type out the examples.
2. **Scrimba course:** watch and code along (curriculum below).
3. **Practice projects** (`DEV/Frontend/Practice/Practice_Guide.html`): Quiz room, Task planner, Expense tracker, Study shop.

### Scrimba curriculum

| Module | Lessons | Duration | Planned hours* | Status |
| :--- | :---: | :---: | :---: | :---: |
| Introduction | 7 | 0.4 hrs | 0.5 | [ ] |
| HTML and CSS Fundamentals | 77 | 5.6 hrs | 5 | [ ] |
| JavaScript Fundamentals | 131 | 8.5 hrs | 7.5 | [ ] |
| Tools of the Trade | 16 | 2.2 hrs | 2 | [ ] |
| Essential CSS | 50 | 4.4 hrs | 4 | [ ] |
| Essential JavaScript | 121 | 10.5 hrs | 9 | [ ] |
| Responsive Design | 54 | 4.6 hrs | 4 | [ ] |
| APIs and Async JavaScript | 96 | 7.6 hrs | 7 | [ ] |
| **Total** | **552** | **43.8 hrs** | **about 39** | |

\*Planned hours assume watching at 1.5x speed and pausing to code along. At normal speed the course alone is 43.8 hours plus coding time, which would not fit.

### Does it all fit? A reality check

| Item | Hours |
|---|---|
| Handbook (4 days) | about 14 |
| Scrimba | about 39 |
| Four practice projects (repo estimate 25 to 35 h) | 25 to 35 |
| **Total** | **78 to 88** |
| Development time available (21 days x 3 to 4 h) | 63 to 84 |

It is very tight. So the calendar below plans the handbook, all of Scrimba, and **practice projects 01 and 02**. Practice 03 and 04 are the **stretch** goals, and the first things to slip if a day is lost.

Levers if I want more project time:
- I already know part of Scrimba's HTML/CSS and JavaScript Fundamentals from the handbook and the DOM practice. Watch those at 2x and code along only where something is new. That frees about 5 to 8 hours, which is most of another project.
- Move the Dec 28 and Dec 30 DSA flex slots to a shorter block.
- Use a family day for a short project session if I feel like it. Not required.

### Rules for development

- Every line of code is typed by me. No AI-written code.
- AI is only for understanding a concept, checking syntax, or a small hint when I am stuck.
- I follow the practice guides: attempt, hint if needed, test against the manual checklist, then explain the result to Dinesh.
- Projects start from an empty `solution/` folder.

---

## 4. Day-by-day calendar

Dec 5 is a Saturday. DSA = 4 problems unless the row says contest. Dev hours are 3 to 4 (3 on contest days).

| # | Date | Day | DSA | Development |
|---|---|---|---|---|
| 1 | Dec 5 | Sat | Trees: traversals, recursion template | Handbook: HTML + CSS |
| 2 | Dec 6 | Sun | **Weekly contest** + upsolve | Handbook: JavaScript |
| 3 | Dec 7 | Mon | Trees: height, depth, diameter | Handbook: DOM + React |
| 4 | Dec 8 | Tue | Trees: level order (BFS) | Handbook: TSX + Next.js, review |
| - | Dec 9 | Wed | **Family day** | |
| 5 | Dec 10 | Thu | Trees: BST | Scrimba: Intro + HTML & CSS |
| 6 | Dec 11 | Fri | Trees: LCA and path problems | Scrimba: HTML & CSS, start JS Fundamentals |
| 7 | Dec 12 | Sat | Trees: mixed + redo (or **biweekly contest**) | Scrimba: JS Fundamentals |
| 8 | Dec 13 | Sun | **Weekly contest** + upsolve | Scrimba: finish JS Fundamentals |
| - | Dec 14 | Mon | **Family day** | |
| 9 | Dec 15 | Tue | Graphs: adjacency list, BFS, DFS, components | Scrimba: Tools of the Trade + start Essential CSS |
| 10 | Dec 16 | Wed | Graphs: grid problems | Scrimba: finish Essential CSS + start Responsive |
| 11 | Dec 17 | Thu | Graphs: shortest path, multi-source BFS | Scrimba: Responsive Design |
| 12 | Dec 18 | Fri | Graphs: cycle detection | Scrimba: Essential JavaScript (part 1) |
| - | Dec 19 | Sat | **Family day** | |
| 13 | Dec 20 | Sun | **Weekly contest** + upsolve | Scrimba: Essential JavaScript (part 2) |
| 14 | Dec 21 | Mon | Graphs: topological sort | Scrimba: Essential JavaScript (part 3) |
| 15 | Dec 22 | Tue | Graphs: union-find (DSU) | Scrimba: APIs & Async (part 1) |
| 16 | Dec 23 | Wed | Graphs: Dijkstra | Scrimba: APIs & Async (part 2, finish) |
| - | Dec 24 | Thu | **Family day** | |
| 17 | Dec 25 | Fri | Graphs: bipartite + mixed | Practice 01: Quiz room |
| 18 | Dec 26 | Sat | Graphs: mixed + redo (or **biweekly contest**) | Practice 01 finish, start Practice 02 |
| 19 | Dec 27 | Sun | **Weekly contest** + upsolve | Practice 02: Task planner |
| 20 | Dec 28 | Mon | Redo list: the ones I rated 4 or 5 | Practice 02 finish, review |
| - | Dec 29 | Tue | **Family day** | |
| 21 | Dec 30 | Wed | Final redo, what to do next | Practice 03 (stretch) + month review |
| - | Dec 31 | Thu | Travel | |

The five family days (Dec 9, 14, 19, 24, 29) are fixed, about one every fifth day so the routine does not break.

---

## 5. Daily and weekly habits

**A normal day**
- Morning or afternoon: the DSA block (4 problems).
- Evening: the development block.
- Last 10 minutes: tick the tracker below and write tomorrow's first task.

**Every Sunday (contest day)**
- Contest, upsolve, and a 15-minute review: problems done this week, hesitation scores, what to redo.

**What counts as done**
- DSA: solved, retyped from memory, and notes written.
- Scrimba: the module's exercises coded along, not only watched.
- Project: passes my manual test checklist and I can explain it to Dinesh.

---

## 6. Tracker

**DSA**
- [ ] Trees: 20 to 25 problems done
- [ ] Graphs: 30 to 35 problems done
- [ ] Redo list cleared
- [ ] Contests: [ ] [ ] [ ] [ ] [ ] [ ] (6)

**Development**
- [ ] Frontend handbook finished
- [ ] Scrimba: all 8 modules (status column above)
- [ ] Practice 01: Quiz room
- [ ] Practice 02: Task planner
- [ ] Practice 03: Expense tracker (stretch)
- [ ] Practice 04: Study shop (stretch)

**Family**
- [ ] 5 family days enjoyed

---

## 7. Decisions already made

- **Split Expenses** (full-stack project) is postponed for me. It takes roughly 80 to 120 hours and would be overwhelming beside this plan. I start it after December; the date is still to be decided. Dinesh builds it in December.
- **Family days** are fixed: Dec 9, 14, 19, 24, 29.
- **Biweekly contests** are not a problem. They are picked from the LeetCode schedule.
- **Scrimba speed:** check after Dec 11. If the 1.5x pace is running late, switch the fundamentals modules to 2x.

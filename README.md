# DineshXEswar

A shared practice repo for **Dinesh** and **Eswar**. Everything we practice, solve, or build goes here, so we can both see each other's work and track our progress.

## Structure

```
DineshXEswar/
├── DSA/    # Data Structures & Algorithms
├── DBMS/   # Databases
├── DEV/    # Development projects
└── README.md
```

## What to do in each folder

### DSA
Practice problems and notes on data structures and algorithms.
- Solve problems (LeetCode, GFG, Codeforces, etc.) and save the solution as a file.
- Organize by topic: `DSA/<topic>/<problem-name>.<ext>` (e.g. `DSA/dp/coin-change.cpp`, `DSA/graphs/dijkstra.py`).
- Add a short note at the top of each solution: problem link, approach, time and space complexity.
- Keep topic revision notes (e.g. `DSA/dp/notes.md`) for patterns and mistakes worth remembering.
- Topics to cover: arrays, strings, linked lists, stacks/queues, trees, graphs, DP, tries, heaps, greedy, backtracking, binary search.

### DBMS
Database concepts and hands-on SQL.
- Write SQL queries and practice problems (joins, group by, subqueries, window functions) in `DBMS/sql/`.
- Keep concept notes in `DBMS/notes/`: normalization, ACID, transactions, indexing, concurrency control, ER diagrams.
- Do small schema design exercises (e.g. library system, e-commerce) with the `.sql` files and an ER diagram.
- Optionally build small projects against MySQL, PostgreSQL, or MongoDB.

### DEV
Real projects and development practice.
- One folder per project: `DEV/<project-name>/`, each with its own short README (what it is, how to run it, tech used).
- Build small and complete things: clones, REST APIs, full-stack apps, tools.
- Split the work by who is doing what, and keep commits small.

## Working together

- Each of us adds new questions or projects to every section regularly.
- Prefix the folder or file name with your name when solving the same problem separately (e.g. `two-sum-dinesh.py`, `two-sum-eswar.py`) so we can compare approaches.
- `git pull` before you start and `git push` when you finish, to avoid conflicts.
- Use clear commit messages, e.g. `DSA: add coin change (DP)`.
- Do not commit secrets, `.env` files, `node_modules`, or large binaries.

# DineshXEswar: project context for Claude

## What this repo is
A shared **collaborative learning** repo for two friends, **Dinesh** and **Eswar**. It is still being built; folders and files are added as they learn.

The friend's name is **Eswar**. The README and the GitHub account (`Eswar2025`) use that spelling. Never use any other spelling or name.

## How we use it
1. Each person learns or already knows some topics and writes notes, questions, or solutions for them in this repo.
2. They join a **Google Meet** and teach each other: one explains while the other follows along or types, then they swap.
3. Often both solve the same problem separately and compare approaches (files prefixed `Dinesh_` / `Eswar_`).
4. Dinesh usually brings doubts to Claude and asks for clarification that works for both of them.

So content here is written to be **explained out loud to a peer**: simple language, the big picture first, short examples, no walls of jargon.

## Layout
```
DSA/<NN_Topic>/{Notes,Questions,Solutions}   # numbered topics; solutions are C++ (Dinesh_*, Eswar_*)
DBMS/                                        # SQL practice (e.g. "SQL Practice/L6_.../Dinesh_Answers.sql")
DEV/Frontend/                                # HTML/CSS/JS/DOM notes + Practice_N / bonus_N mini projects
DEV/Backend/Python/                          # Python Notes, Syntax, Practice
DEV/Web_Development_Roadmap.md               # big-picture HTML -> Next.js overview
DEV/Frontend/Frontend_Handbook.html          # offline handbook: HTML -> CSS -> JS -> DOM -> React -> TSX -> Next.js
DEV/Backend/Backend_Handbook.html            # offline handbook: HTTP -> Node/Express -> DBs -> auth -> deploy -> Next.js backend
Accenture/                                   # Accenture assessment/internship prep: MCQs, coding questions
                                             # (DOM, SQL, Python), Project/StudySync_Prep.html
```

## Current goals
- **DSA:** FAANG placement prep in **C++**. Learn all the famous patterns first, then mass practice, then Codeforces for speed. No fixed per-month plan.
- **Development:** learn full-stack, frontend first (HTML, CSS, JS, DOM), then backend, then databases.
- **Accenture:** Dinesh has an internship/Elite-role track. Focus subjects are DBMS, development, DSA. OS and other core subjects come later.

## Handbooks and codebase guides (visual style)
When Dinesh asks for a **handbook** or a **detailed explanation of a codebase**, build it as a single offline HTML file and follow `design.md` in the repo root for the color scheme, typography, and components. In short: near-black `#0a0a0a` background, cream `#fffaf0` text, Inter, 12px soft corners, hairline borders, a roadmap.sh-style node graph for sequence. Use `DEV/Frontend/Frontend_Handbook.html` as the reference implementation and copy its CSS tokens.

## Conventions
- Notes are Markdown; larger self-contained guides are single offline HTML files styled per `design.md`.
- Practice folders hold `Question.md`, `Hints.md`, and the code files together.
- Keep explanations beginner-friendly. When asked for "notes", give general understanding and the map of the topic, not exhaustive tutorials.
- Do not commit secrets, `.env`, `node_modules`, or large binaries (see `.gitignore`).
- Do not commit or push unless asked. Commit messages are short and topic-prefixed, e.g. `DSA: add coin change (DP)`.

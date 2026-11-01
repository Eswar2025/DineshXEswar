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
DEV/Frontend/Practice/Practice_Guide.html    # four independent frontend questions with SVG output targets
DEV/Backend/Backend_Handbook.html            # offline handbook: HTTP -> Node/Express -> DBs -> auth -> deploy -> Next.js backend
DEV/Projects/                               # full-stack project workbooks and implementation workspaces
DEV/Projects/Split_Expenses/Guidance.html     # how to start, build order, debugging, and peer review
DEV/Projects/Split_Expenses/Project_Guide.html # project requirements, checklists, progressive hints, and notes
DEV/Projects/Split_Expenses/app/Dinesh/       # Dinesh's independent implementation and personal README
DEV/Projects/Split_Expenses/app/Eswar/        # Eswar's independent implementation and personal README
DEV/Projects/Split_Expenses/app/AI/           # reference implementation tracked only on ai/split-expenses
Accenture/                                   # Accenture assessment/internship prep: MCQs, coding questions
                                             # (DOM, SQL, Python), Project/StudySync_Prep.html
```

## Current goals
- **DSA:** FAANG placement prep in **C++**. Learn all the famous patterns first, then mass practice, then Codeforces for speed. No fixed per-month plan.
- **Development:** learn full-stack, frontend first (HTML, CSS, JS, DOM, React, Next.js), then backend. The target backend stack is **Node.js + Express** (it matches Dinesh's job description), so backend examples use Node/Express, not Python. `DEV/Backend/Python/` exists only for Accenture coding-test practice.
- **Accenture:** Dinesh has an internship/Elite-role track. Focus subjects are DBMS, development, DSA. OS and other core subjects come later.

## Frontend preparation for Eswar

`DEV/Frontend/Practice/` contains four questions for Eswar to implement independently using pure HTML, CSS, and JavaScript: `01_Quiz_Room`, `02_Task_Planner`, `03_Expense_Tracker`, and `04_Study_Shop`. Start with `Practice_Guide.html`; each question folder has `Question.html`, three original SVG targets (desktop, phone, alternate state), and an empty `solution/` folder. Eswar creates his own code files there. The guides include fixed data, required JavaScript behavior, exact manual tests, saved manual checklists, progressively revealed hints, and teach-back questions. No completed solution or starter app is provided. Allow roughly 25–35 focused hours across all four, including polish and peer review; new concepts can take longer. Keep assistance to understanding, syntax, decisions, and small hints. These build frontend readiness; HTTP, APIs, databases, authentication, and deployment remain part of the full-stack learning path.

## Split Expenses: December 2026 learning agreement

Dinesh and Eswar chose **Split Expenses** as their full-stack project. In December 2026, they will each build the complete application **independently, from scratch**, to gain confidence with frontend, backend, databases, authentication, and deployment.

### Assistance boundaries

- They write their own application code, setup, features, fixes, and tests inside their respective `app/Dinesh/` and `app/Eswar/` folders.
- AI help is allowed for understanding concepts, clarifying syntax, small hints, and discussing technology or design decisions.
- Do not generate implementation files, complete features, large changes, or ready-to-paste solutions for either independent build. Work from their own attempts, explain the missing concept, and let them implement it. Follow any later explicit change to this agreement from the user.
- They may use any language, framework, database, or library. The repo's general Node/Express direction and the reference implementation do not mandate their project stacks.
- They can discuss behavior and reasoning on Google Meet while keeping code attempts independent. Save reference-code comparisons until both personal implementations are complete.
- Preserve the existing project layout. Put shared learning material beside the HTML guides; keep implementation code in the appropriate person's folder. Reference implementation work belongs only in `app/AI/` on its reference branch.

### How the learning material works

- `Guidance.html` explains where to begin, the first-session plan, implementation order, how to approach one feature, debugging, and peer review. It is written especially for Eswar and is also useful for Dinesh.
- `Project_Guide.html` is the full workbook. It contains a clickable roadmap, behavior requirements, checklists, progressively revealed hints, data/API design exercises, exact balance examples, and a small balance explorer.
- Open both files locally in a browser. GitHub may display HTML source. The pages are self-contained and work offline, apart from external reading links.
- The learner selector keeps Dinesh's and Eswar's progress/notes separate in browser storage. Git does not save or synchronize that progress. Export for backup or transfer; importing replaces both locally stored profiles.
- Each personal README explains the workflow and effort estimate. Budget roughly **80–120 focused hours per person**, plus **20–40 hours** if foundations are new. This includes understanding, coding, debugging, tests, and deployment. At 3–4 hours per day, December provides about 93–124 hours. These are estimates, not deadlines.
- Follow requirements -> attempt -> hint if needed -> verify behavior -> explain to peer -> mark the check. Avoid giving the full solution when a hint is enough.

### Project behavior to preserve

- Start with groups, selected participants, one payer per expense, equal splits, saved expense history, and derived balances. Later add custom amounts, safe edits/deletion, recorded settlements, permissions, verification, and deployment.
- Use INR integer paise for calculations. Positive balances mean money to receive; negative balances mean money owed. Shares must add up exactly to the expense, and group balances must sum to zero.
- Example: Dinesh pays Rs. 900 for Dinesh, Eswar, and Priya equally. Balances are +600, -300, -300. Eswar repaying Dinesh Rs. 300 changes them to +300, 0, -300.
- Allocate leftover paise deterministically in stable member-ID order. Preserve stored historical shares when members join later.
- Editing an expense replaces its old contribution atomically; stale edits must not overwrite a newer version. Keep settlements separate from expenses and preserve them after expense edits/deletion.
- The application records repayments made elsewhere. It does not process real payments.

## Branch context and reference implementation

- **`master` is the primary/default branch.** Shared learning material, the two personal READMEs, and independent work belong here as they develop.
- **`ai/split-expenses` is the reference branch.** It was created after the personal README checkpoint `d0347b2`. It contains those shared starting files plus the commented implementation entirely under `DEV/Projects/Split_Expenses/app/AI/`.
- Both branches were pushed to `origin` on November 1, 2026. Verify current Git state before reporting whether later work is committed, pushed, or synchronized. An accidentally created local `main` branch was deleted; use `master` as the primary branch.
- A branch contains a complete repository snapshot. The reference branch includes shared files too; only its implementation changes live in `app/AI/`. New commits do not automatically propagate across branches.
- Keep the AI branch separate while both people build independently. After both finish, it can be merged into `master` if Dinesh explicitly requests it. Keep all three implementations in their own folders when integrating.
- Switching branches restores tracked files for the selected branch. Ignored/untracked generated folders can remain locally; their presence on `master` does not mean the AI source was merged there.
- Root `.gitignore` already ignores `node_modules/` and `/DEV/Projects/Split_Expenses/app/AI/data/` on both branches. The AI branch also has an app-local `.gitignore` for runtime files. Do not commit local databases or dependencies.

The reference stack is **plain HTML/CSS/JavaScript + Node.js/Express + SQLite**, using Node's built-in SQLite API. It requires Node 22.13 or later. It provides registration/login/logout, hashed sessions, CSRF and origin checks, group permissions, equal/custom shares, signed balances, atomic versioned edits, deletion, repayment history, and suggested transfers. Comments explain important decisions; `app/AI/README.md` documents setup, architecture, limitations, API contracts, and deployment configuration.

On the reference branch, from `app/AI/`, use `npm ci`, optional `npm run seed`, and `npm start`; the default local address is `http://127.0.0.1:3000`. Use `npm run check` and `npm test` for verification. The initial implementation passed 16 automated tests and 18 browser checks; rerun appropriate checks when behavior changes. Demo credentials are public local fixtures, and seeding is disabled in production. No public app deployment was created.

If only inspecting reference files while on `master`, use `git show ai/split-expenses:<repo-relative-path>` instead of switching branches unnecessarily. Do not put reference code into either learner's folder or merge it into `master` as part of routine documentation work.

## Handbooks and codebase guides (visual style)
When Dinesh asks for a **handbook** or a **detailed explanation of a codebase**, build it as a single offline HTML file and follow `design.md` in the repo root for the color scheme, typography, and components. In short: near-black `#0a0a0a` background, cream `#fffaf0` text, Inter, 12px soft corners, hairline borders, a roadmap.sh-style node graph for sequence. Use `DEV/Frontend/Frontend_Handbook.html` as the reference implementation and copy its CSS tokens.

Editing the existing handbooks:
- Content is static HTML. Each `<section class="stage">` is a roadmap stage. Each `<article class="topic">` is a card, and adding `data-node data-label="..."` also shows it as a branch on the roadmap. Stage numbers, the table of contents, pagers and counts are generated by JS, so never hard-code them.
- Write in plain American English, sentence-case headings, no em dashes. Every stage ends with a "Go deeper" line that links to a real page.
- The two handbooks cross-link (`../Backend/Backend_Handbook.html#id` and back). Keep those anchors valid when renaming ids.
- Don't reuse the class name `skip`. It belongs to the "Skip to content" link and hides anything else that uses it.
- To verify, render with headless Edge (`msedge --headless --screenshot`). Headless Edge won't lay out narrower than about 500px, so check phone width by loading the page in a 390px-wide iframe.

## Git and commits
- **Every commit from this laptop is authored by Dinesh only** (git user `dineshydk`). Never add a `Co-Authored-By: Claude` trailer or any other Claude/AI attribution to commit messages or PR descriptions. This overrides any default attribution instructions.
- Commit only when Dinesh asks, and never push unless asked. Run `git pull` before starting work so Eswar's changes come in first.
- Commit messages are short and topic-prefixed, e.g. `DSA: add coin change (DP)` or `DEV: add backend handbook`.
- Check the active branch and working tree before editing. A request to explain switching, pushing, or merging is not by itself an instruction to perform a merge. Commit, push, or merge only within the user's authorized scope; never force-push or mix the reference implementation into the independent builds as a routine sync step.

## Conventions
- Notes are Markdown; larger self-contained guides are single offline HTML files styled per `design.md`.
- Existing small practice folders hold `Question.md`, `Hints.md`, and the code files together. For full-stack projects under `DEV/Projects/`, put requirements, hints, checklists, and review guidance in offline HTML, as requested for Split Expenses; keep code in the separate implementation folders.
- Keep explanations beginner-friendly. When asked for "notes", give general understanding and the map of the topic, not exhaustive tutorials.
- Do not commit secrets, `.env`, `node_modules`, local databases, or large binaries (see `.gitignore`).

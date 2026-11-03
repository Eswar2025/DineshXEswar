# DineshXEswar

A shared learning repo for **Dinesh** and **Eswar**. We practice, write notes, build projects, and explain what we learn to each other on Google Meet. Sometimes we solve the same problem independently and compare approaches afterward.

Our focus is **C++ DSA for placements, DBMS/SQL, full-stack development, and Accenture preparation**. The development roadmap goes from frontend fundamentals to backend work, with Node.js + Express as the general backend learning direction.

## Structure

```text
DineshXEswar/
├── DSA/                         # Numbered topics, notes, questions, and C++ solutions
├── DBMS/                        # Database concepts and SQL Practice/
├── DEV/
│   ├── Frontend/                # Frontend practice and offline handbook
│   │   └── Practice/            # Four independent HTML/CSS/JS projects with SVG targets
│   ├── Backend/                 # Backend handbook and Python assessment practice
│   ├── Projects/
│   │   └── Split_Expenses/
│   │       ├── Guidance.html    # How to start and proceed
│   │       ├── Project_Guide.html
│   │       └── app/
│   │           ├── Dinesh/      # Dinesh's independent implementation
│   │           ├── Eswar/       # Eswar's independent implementation
│   │           └── AI/          # Reference code on ai/split-expenses only
│   └── Web_Development_Roadmap.md
├── Accenture/                   # Assessment and internship preparation
├── Eswar_December_Plan.md       # Eswar's 5-30 Dec 2026 study plan
├── design.md                    # Visual rules for HTML learning guides
├── CLAUDE.md                    # Context and working instructions for assistants
└── README.md
```

The tree shows the intended workspaces across both branches. The tracked AI implementation is available only on `ai/split-expenses`; its generated local folders may remain after switching to `master`.

## Learning areas

- **DSA:** use `DSA/<NN_Topic>/{Notes,Questions,Solutions}`. Solutions are in C++; use the existing `Dinesh_` / `Eswar_` naming pattern for independent attempts. Explain the approach and time/space complexity.
- **DBMS:** practice SQL under `DBMS/SQL Practice/` and connect database concepts to real schema design.
- **Frontend:** learn HTML, CSS, JavaScript, the DOM, React, and Next.js through notes and small projects.
- **Backend:** learn HTTP, Node/Express, databases, authentication, and deployment. `DEV/Backend/Python/` is for assessment coding practice.
- **Accenture:** keep assessment, coding, and internship preparation under `Accenture/`.

Useful starting points:

- [Web development roadmap](DEV/Web_Development_Roadmap.md)
- [Frontend handbook](DEV/Frontend/Frontend_Handbook.html)
- [Independent frontend practice](DEV/Frontend/Practice/Practice_Guide.html): Quiz room, Task planner, Expense tracker, and Study shop. Each question has desktop/phone/alternate SVG targets, required JavaScript behavior, hints, and an empty solution folder. Allow roughly 25–35 hours across the set, including polish and review.
- [Backend handbook](DEV/Backend/Backend_Handbook.html)
- [Eswar's December plan](Eswar_December_Plan.md): 21 study days, trees and graphs DSA, handbook, Scrimba, and frontend practice projects

## Split Expenses: full-stack project

We will each build an expense-sharing application **independently, from scratch**. The goal is to become confident enough to explain and implement the complete frontend, backend, database, authentication, and deployment flow.

**Timing:** Dinesh builds it in December 2026. Eswar's December is DSA (trees and graphs) plus frontend foundations, so his build starts afterward (date to be decided). See [Eswar's December plan](Eswar_December_Plan.md).

The project begins with groups of friends splitting expenses equally. Later stages add exact custom shares, balances, safe edits/deletion, and recorded settlements. It records repayments made elsewhere; it does not transfer money.

### Start here

1. Open [Guidance.html](DEV/Projects/Split_Expenses/Guidance.html) to understand the approach and first-session plan.
2. Open [Project_Guide.html](DEV/Projects/Split_Expenses/Project_Guide.html) for the build roadmap, requirements, checklists, progressive hints, examples, and notes.
3. Select your own learner profile in the workbook.
4. Follow your personal instructions: [Dinesh's README](DEV/Projects/Split_Expenses/app/Dinesh/README.md) or [Eswar's README](DEV/Projects/Split_Expenses/app/Eswar/README.md).
5. Write your implementation entirely inside your own folder under `app/`.

Pull or download the repository and open the HTML files locally in a browser. GitHub may show their source instead of the interactive page. The guides work offline; external reading links need internet access.

Workbook checks and notes are stored in the browser, separately for Dinesh and Eswar. They are not saved by a Git commit or automatically synchronized. Export progress for backups or moving computers. Importing a backup replaces both locally saved profiles, so export your current progress first.

### Independent-build agreement

- Each person writes their own application code, features, fixes, and tests.
- AI may help with understanding, syntax questions, small hints, and technology/design decisions.
- AI must not generate the implementation, complete features, large changes, or ready-to-paste solutions for these independent builds.
- Use official documentation, the HTML hints, small experiments, and discussions with each other.
- Each person may choose any stack. The reference implementation's tools are not required for either personal build.
- Compare behavior and explain decisions during Google Meet. Keep implementation attempts independent and save reference-code comparisons until both personal builds are complete.

Budget approximately **80–120 focused hours per person**, including learning, coding, debugging, tests, and deployment. Allow an additional **20–40 hours** if the foundations are new. At 3 hours a day, a 31-day month provides about 93 hours; at 4 hours a day, about 124 hours. These are planning estimates, not deadlines. The personal READMEs contain the detailed breakdown.

## Branches and reference implementation

| Branch | Purpose |
|---|---|
| `master` | Shared notes, guides, personal READMEs, and the independent Dinesh/Eswar builds as they develop. |
| `ai/split-expenses` | The shared starting files plus the commented reference implementation under `DEV/Projects/Split_Expenses/app/AI/`. |

Both branches have been published to GitHub. A branch is a complete version of the repository, so the reference branch includes the shared starting files too. New commits on either branch do not automatically appear in the other.

The reference uses **plain HTML/CSS/JavaScript, Node.js + Express, and SQLite**. It includes authentication, group permissions, equal/custom splits, exact paise calculations, safe edits, and settlement history. Its [README on the reference branch](https://github.com/Eswar2025/DineshXEswar/blob/ai/split-expenses/DEV/Projects/Split_Expenses/app/AI/README.md) contains setup commands, local demo accounts, a code-reading order, and tests.

The reference was checked with 16 automated tests and 18 browser checks when implemented. It is a learning reference with its scope and limitations documented in its own README.

### Switch between branches

From the repository root:

```bash
git branch
git switch master
git switch ai/split-expenses
```

Run the switch command for the branch you want. Git updates tracked files to match that branch; the other branch's committed work remains saved. Untracked or ignored files, such as `node_modules/` and local database files, may remain on disk. Save or commit your own work before switching if it would conflict.

`node_modules/` is ignored by the root `.gitignore`. The reference app's `DEV/Projects/Split_Expenses/app/AI/data/` is also ignored on both branches. Leave those generated folders local; they do not belong in commits.

### Push and merge are separate actions

**Pushing** publishes a branch's commits to GitHub. **Merging** incorporates another branch's changes into the current branch.

Keep the AI reference separate during the independent builds. Once both implementations are complete, review and merge it into `master` if we decide to keep all three implementations together. It belongs in `app/AI/`, alongside the Dinesh and Eswar folders.

A later merge, when explicitly chosen, would be:

```bash
git switch master
git pull --ff-only
git merge ai/split-expenses
# Review the result and resolve any conflicts before publishing.
git push origin master
```

## Working together

- Pull before starting work, coordinate overlapping edits, and keep commits small.
- Keep separate attempts clearly named. For Split Expenses, use your own implementation folder.
- Use short topic-prefixed commit messages, such as `DSA: add coin change` or `DEV: add expense form`.
- Review changes before committing. Keep secrets, `.env` files, `node_modules`, local databases, and large binaries out of Git.
- Explain the big picture first, use simple language, and bring a concrete example or failing case when discussing a doubt.
- Larger learning guides are self-contained offline HTML files following [design.md](design.md).

Assistant-specific context and Git rules are in [CLAUDE.md](CLAUDE.md). Assistants should commit, push, or merge only within the actions explicitly requested by Dinesh.
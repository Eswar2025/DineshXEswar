# Independent frontend practice

Open [Practice_Guide.html](Practice_Guide.html) locally in a browser. It explains the sequence, effort, and readiness review.

| Order | Question                                            | Main skills                                     |
| ----- | --------------------------------------------------- | ----------------------------------------------- |
| 1     | [Quiz room](01_Quiz_Room/Question.html)             | Events, remembered answers, navigation, scoring |
| 2     | [Task planner](02_Task_Planner/Question.html)       | Forms, CRUD, search/filter, saved state         |
| 3     | [Expense tracker](03_Expense_Tracker/Question.html) | Validation, integer money, derived summaries    |
| 4     | [Study shop](04_Study_Shop/Question.html)           | Cart state, quantities, coupons, demo checkout  |

Every question folder contains `Question.html`, `target-desktop.svg`, `target-mobile.svg`, `target-state.svg`, and an empty `solution/` folder. The HTML includes the fixed dataset, behavior checklist, exact manual tests, progressively revealed hints, and peer-review questions. SVGs illustrate output only; implement the interface with real HTML, CSS, and JavaScript.

Eswar creates his own `index.html`, `style.css`, and `script.js` under each `solution/`. No completed application or starter implementation is provided. Use only pure HTML/CSS/JavaScript; AI may help with concepts, syntax, decisions, or a small hint, but Eswar writes the code and fixes himself.

Allow roughly **25–35 focused hours** across all four, including polish and review; new concepts may take longer. Guide checks/notes are local to each guide and browser. Export/import them for backup. Each solution should have its own separate storage key. For apps using persistence, prefer a local development server over relying on file-URL storage behavior.

Finish the core behavior cases, show desktop/phone/alternate states, and explain one live change to Dinesh. These exercises strengthen frontend readiness; the [full-stack project](../../Projects/Split_Expenses/Guidance.html) also requires backend APIs, databases, authentication, and deployment.

# Hints – Practice 5

Notes: `../Notes_Claude.md` sections 5 to 7.

## HTML
- ids are case sensitive: `addbtn` and `addBtn` are different.
- Read the comment again: how many attributes does the input need?

## CSS
- The class goes on the `<li>`, but the text is inside it. Write `li.done .task-text` or style the `<li>` itself.
- Line through = `text-decoration: line-through`.
- Hidden bug: look at the `.delete-btn` rule. Can you see the X buttons?

## JS
- Add a task: `document.createElement("li")`, `document.createElement("span")`, `document.createElement("button")`, set classes and text, then `appendChild`.
- Read the input with `.value`, clean it with `.trim()`.
- **Event delegation:** put ONE click listener on `#taskList`. Inside it check `event.target`:
  - `event.target.classList.contains("delete-btn")` -> `event.target.parentElement.remove()`
  - `event.target.classList.contains("task-text")` -> `event.target.parentElement.classList.toggle("done")`
  This way new items work without adding listeners again.
- Count not-done: `document.querySelectorAll("#taskList li:not(.done)").length`.
- Write one small function `updateRemaining()` and call it at the end of every action (and once at load).
- Singular/plural: `count === 1 ? "task" : "tasks"`.

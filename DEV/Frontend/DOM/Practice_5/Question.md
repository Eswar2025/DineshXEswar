# Practice 5 – To-Do List

Difficulty: ★★☆ (creating and removing elements)

A to-do list page is given. Tasks are in the comments of `index.html`, `style.css` and `script.js`.

## Test cases

| Actions | Expected |
|---|---|
| page load | 2 items, `2 tasks left` |
| type `Buy milk`, click Add | 3 items, `3 tasks left`, input empty |
| type `   Walk   `, click Add | new item text is `Walk` (no spaces) |
| click Add with an empty input | nothing is added |
| click the text of item 1 | item 1 gets `done`, remaining count drops by 1 |
| click the same text again | `done` removed, count back |
| click X on any item | item removed, count correct |
| mark the only remaining item done | `0 tasks left` |
| leave one not-done task | `1 task left` (singular) |
| toggle / delete on a **newly added** item | must work too |

## Rules

- No inline `onclick`.
- Do not use `innerHTML` with the user's text (use `textContent`).
- There is **1 more bug** in the CSS that is not mentioned in the comments. Hint: something on each task row is invisible.

## Bonus
Pressing the Enter key inside the input should add the task too.

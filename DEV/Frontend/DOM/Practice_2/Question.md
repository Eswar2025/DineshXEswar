# Practice 2 – Interactive Two-Input Swap Widget (Accenture OA style)

Reference: `image.png`.

You are given a half-working widget (`index.html`, `style.css`, `script.js`): two text inputs with a button between them.
The target is the widget in the image. Open `index.html` and compare. The page has **bugs** you must find and fix.

## Tasks

1. **HTML:** Add the HTML attribute `id="swapBtn"` to the swap button and make sure it is a plain (non-submitting) button.
2. **CSS:** The swap button must be a **perfect circle** (`border-radius: 50%`).
3. **JS:** When the swap button is clicked, the **values** of Input A and Input B must be swapped.

## Expected behaviour (test cases)

| Input A | Input B | After 1 click (A / B) | After 2 clicks (A / B) |
|---|---|---|---|
| `100` | `200` | `200` / `100` | `100` / `200` |
| `Hello` | `World` | `World` / `Hello` | `Hello` / `World` |
| `SQL` | `DSA` | `DSA` / `SQL` | `SQL` / `DSA` |
| *(empty)* | `abc` | `abc` / *(empty)* | *(empty)* / `abc` |

Swapping must also work **after the user edits the inputs by typing**, not only for the initial values.

## Rules (as in the real OA)

- Do **not** rename the ids of the inputs (`inputA`, `inputB`).
- Write the logic only in `script.js` for task 3. No inline `onclick` in the HTML.
- Hidden test cases check the DOM using ids and the final input values, so the exact ids matter.

## Bonus: find the hidden issues

There are **2 more small bugs** planted in the starter code (one in `index.html`, one in `style.css`) that are not in the task list.
Find them and fix them. Hint: one is invisible when you look at the page but visible when you hover or click, and one breaks a click target.

Stuck? `Hints.md`.

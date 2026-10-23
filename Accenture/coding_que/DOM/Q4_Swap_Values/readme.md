# Swap Values

You are given a page with two text boxes and a counter. The page is not complete.
Finish the three tasks, one in each file, so the widget works as described.

Suggested time: 10 minutes.

## Files

| File | What to do |
|---|---|
| `index.html` | Task 1 |
| `style.css` | Task 2 |
| `script.js` | Task 3 |

Open `index.html` in the browser to run the page. Do not change the ids of elements that already exist.

## Tasks

1. **HTML** – Create a `<button>` with `id="swapBtn"` and the text `Swap`.
2. **CSS** – Make the two text boxes appear side by side in one line, with a `12px` gap between them (complete the `.row` rule).
3. **JavaScript** – When **Swap** is clicked, exchange the values of the two boxes and update the `Swaps done` counter (see `script.js`).

## Expected behaviour

| Action | First box | Second box | Counter text |
|---|---|---|---|
| page load | empty | empty | `Swaps done: 0` |
| type `apple` and `mango`, click Swap | `mango` | `apple` | `Swaps done: 1` |
| click Swap again | `apple` | `mango` | `Swaps done: 2` |
| both boxes empty, click Swap | empty | empty | unchanged |
| only the first box has `hi`, click Swap | empty | `hi` | counted |

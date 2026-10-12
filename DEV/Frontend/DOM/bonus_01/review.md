# Review: bonus_01 (Tweet Box / character counter)

Reviewed by Claude, requested by Dinesh. Reviewed Eswar's solution to `bonus_01`.
The code was read and traced by hand, not run in a browser.

## Summary

Mostly right. The main flow works and the hidden HTML bug was found. Three things need fixing: a stuck red state in the JS, a CSS typo, and a missed HTML attribute.

## Score: 6.5 / 9

| Part | Result | Marks |
|---|---|---|
| HTML | Ids and placeholder are fixed, including the hidden `class` -> `id` bug and the `clearbtn` spelling. But the Post button has no `disabled` attribute, which the task asked for. | 1.5 / 2 |
| CSS | `.warning` is correct. `.danger` has `font-family: bold`, which is invalid, so the number never becomes bold. It should be `font-weight: bold`. | 1 / 2 |
| JS | Counter, warning at <= 10, danger at <= 0, Post disabled for empty / spaces-only / over 50, and Clear all work. One edge case breaks (below). | 3 / 4 |
| Hidden bug | Found and fixed. | 1 / 1 |

Time taken was not measured, so it is not scored.

## The real bug: `danger` can get stuck

The `else` branch in the input handler only removes `warning`:

```js
else {
  remaininglengthEle.classList.remove("warning");   // "danger" is never removed here
}
```

How to trigger it:

1. Type 55 characters, so the counter shows -5 in red.
2. Select everything and delete, or cut it.
3. The counter shows `50` but stays **red**.

Why: the jump goes straight from the danger zone to the normal zone, and no branch clears `danger`.

Fix: at the start of the handler, remove both classes and then add the right one. That is the pattern in `Hints.md`.

## Smaller points

1. **Post button:** the HTML needs `disabled` on the button. The JS sets it at load, which works, but the HTML should carry it as the task said.
2. **Spaces-only check:** `50 - value.replace(/\s/g, "").length == 50` works but is hard to read. `textEle.value.trim() === ""` says the same thing, and it is what the question suggested.
3. **Repeated logic:** the Clear handler re-does the reset by hand. A single `update()` function, called on typing and on Clear, would avoid the stuck-class bug and cut the duplication.
4. **`let` vs `const`:** `remaininglengthEle` is never re-assigned, so it should be `const`.
5. **`==` vs `===`:** `==` is used in two places. Use `===`.
6. **Naming:** `spaceremlengthEle` ends in "Ele" but holds a number. A name like `lettersLeft` would be clearer.

## What Eswar did well

- Did the whole task on his own.
- The code handles the boundaries, including a count of exactly 10 (warning) and exactly 0 (danger and still enabled).
- Found the planted bug where `class="remaining"` was used instead of the required id.

## Next step

Fix the stuck-`danger` case and the `font-weight`, then re-test with 55 characters followed by select-all and delete.

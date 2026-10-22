# Hints – Practice 3

Notes: `../Notes_Claude.md` sections 4 to 7.

## HTML
- Compare each id in the comment with the actual id, letter by letter.
- One element has no id at all.

## CSS
- A class selector starts with a dot. Where should `.high` be, relative to `.count-value`? (Same element, so think about which rule wins.)
- Click each button. If one of them does nothing, look for a CSS property that blocks clicks.

## JS
- The display is a `<span>`, so use `textContent`, not `value`.
- Keep the number in a `let` variable and update the page from it every time.
- A `Math.max(0, ...)` or an `if` stops the number going below 0.
- `classList.add` / `classList.remove`, or `classList.toggle("high", condition)`.
- Remember: reading `textContent` gives a **string**. `"9" + 1` is `"91"`.

## Hidden issue (1)
- One button cannot be clicked even when the JS is right (CSS).

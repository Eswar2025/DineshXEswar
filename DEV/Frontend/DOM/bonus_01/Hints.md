# Hints – Bonus 01

## HTML
- `disabled` is a boolean attribute: write just the word in the opening tag.
- Compare every id in the comment with the actual id, letter by letter (ids are case sensitive).
- One element uses `class` where the comment says `id`.

## CSS
- `.warning { color: #ea580c; }` and `.danger { color: #dc2626; font-weight: bold; }`

## JS
- Select: textarea, `#remaining`, post button, clear button.
- `textarea.addEventListener("input", ...)` runs on every change.
- Write ONE function, for example `update()`:
  1. `const length = textarea.value.length`
  2. `const left = 50 - length`
  3. `remaining.textContent = left`
  4. remove both classes, then add the right one:
     `left <= 0` -> `danger`, `left <= 10` -> `warning` (check `danger` first)
  5. `postBtn.disabled = textarea.value.trim() === "" || length > 50`
- Call `update()` from the `input` handler **and** once at page start (so the Post button starts disabled).
- Clear: `textarea.value = ""` and then call `update()` again. Setting `.value` from JS does not fire the `input` event.

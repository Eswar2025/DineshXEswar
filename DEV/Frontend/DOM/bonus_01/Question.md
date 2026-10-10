# Bonus 01 – Tweet Box (character counter)

Difficulty: ★★ to ★★★. **Time limit: 13 minutes.** Start a timer, then open `index.html`.

Tasks are in the comments of `index.html`, `style.css` and `script.js`.

## Test cases

| Textarea content | `#remaining` | Class on `#remaining` | Post button |
|---|---|---|---|
| (empty, page load) | 50 | none | disabled |
| `Hi` | 48 | none | enabled |
| `   ` (3 spaces) | 47 | none | **disabled** (spaces only) |
| 40 characters | 10 | `warning` | enabled |
| 45 characters | 5 | `warning` | enabled |
| 50 characters | 0 | `danger` | enabled |
| 55 characters | -5 | `danger` | **disabled** |
| press Clear | 50 | none | disabled, textarea empty |

## Rules

- Use the `input` event on the textarea (not `click`, not `keyup`).
- Use `.length` for the count and `.trim()` for the "spaces only" check.
- Use the `disabled` **property** of the button (`btn.disabled = true / false`).
- No inline `onclick`.
- Besides the explicit tasks, there is **1 more bug** in the HTML that would break your JS.

## Self-check after the timer

- Did every row of the test table pass?
- Did you test the boundaries: 10, 11, 49, 50, 51 characters?

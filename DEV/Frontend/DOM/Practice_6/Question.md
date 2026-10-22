# Practice 6 – Signup Form Validation

Difficulty: ★★☆ (forms, `submit` event, `preventDefault`)

Tasks are in the comments of `index.html`, `style.css` and `script.js`.

## Test cases

| username | email | password | Expected |
|---|---|---|---|
| `Di` | `a@b.com` | `123456` | username error shown, others green, no success |
| `Dinesh` | `dinesh` | `123456` | email error shown |
| `Dinesh` | `a@b` | `123456` | email error ("." must come after "@") |
| `Dinesh` | `a@b.com` | `123` | password error shown |
| `   ab   ` | `a@b.com` | `123456` | username error (spaces ignored, only 2 chars) |
| `Dinesh` | `d@x.com` | `secret1` | no errors, `Welcome, Dinesh!`, inputs cleared |
| (all empty) | | | all three errors |
| fix an invalid field and submit again | | | its error disappears, border turns green |

## Rules

- Listen to the form's `submit` event (not the button's click).
- Use `event.preventDefault()`.
- No inline `onclick`.
- In `index.html` the Task 1 comment lists three fixes (`novalidate`, the submit button, the labels). Make sure you find **all** of them. Do not stop at the first one.

# Hints – Practice 6

## HTML
- `novalidate` is a boolean attribute: just write the word in the opening `<form>` tag.
- Inside a form, a button with `type="button"` does **not** submit. Which type does?
- A label's `for` must equal the input's `id`. Check all three pairs, one by one.

## CSS
- Combine selectors: `.error.show` (no space) means "has both classes".
- Make sure your `.show` rule comes **after** `.error { display: none }`, or is more specific.

## JS
- `form.addEventListener("submit", function (event) { event.preventDefault(); ... })`
- Write ONE helper, for example `showError(input, errorSpan, message)` and `showValid(input, errorSpan)`, and call it for each field. Do not copy-paste three times.
- Email rule: `const at = email.indexOf("@")`, then `email.indexOf(".", at)` must not be `-1` (and `at` must not be `-1` or 0).
- Keep a boolean `isFormValid = true` and set it to `false` whenever a check fails.
- Clearing the form: `form.reset()`, then remove the `valid` class from inputs.
- Always `.trim()` before measuring length.

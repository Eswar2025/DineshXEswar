# Leap Year Checker

You are given a page with a year box, a **Check** button and a message area.
The page is not complete. Finish the three tasks, one in each file, so the widget works as described.

Suggested time: 10 minutes.

## Files

| File | What to do |
|---|---|
| `index.html` | Task 1 |
| `style.css` | Task 2 |
| `script.js` | Task 3 |

Open `index.html` in the browser to run the page. Do not change the ids of elements that already exist.

## Tasks

1. **HTML** – Create an `<input>` with `type="number"`, `id="yearInput"` and the placeholder `Enter a year`.
2. **CSS** – Add two rules for the message: class `leap` has text colour `#16a34a`, class `not-leap` has text colour `#dc2626`.
3. **JavaScript** – When **Check** is clicked, read the year and show in `#result` whether it is a leap year (see the rules in `script.js`).

## Expected behaviour

| Input | Message shown | Colour |
|---|---|---|
| (empty) | `Please enter a year` | grey |
| `2024` | `2024 is a leap year` | green |
| `1900` | `1900 is not a leap year` | red |
| `2000` | `2000 is a leap year` | green |
| `2023` | `2023 is not a leap year` | red |

A new click replaces the old message and colour.

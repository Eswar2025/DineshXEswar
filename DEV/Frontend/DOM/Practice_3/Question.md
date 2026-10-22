# Practice 3 – Counter

Difficulty: ★☆☆ (warm-up, OA style)

Open `index.html`. A counter page is given, but it is not working. The three tasks are written as comments in `index.html`, `style.css` and `script.js`.

## Test cases

| Actions | Expected number | Has class `high`? |
|---|---|---|
| (page load) | 0 | No |
| click `+` 3 times | 3 | No |
| click `-` once more | 2 | No |
| click `-` 5 times from 0 | 0 (never negative) | No |
| click `+` 10 times | 10 | **Yes**, number is green |
| then click `-` once | 9 | No (class removed) |
| click `Reset` at any time | 0 | No |

## Rules

- Do not rename ids that already match the comments.
- No inline `onclick` in the HTML.
- Find and fix **every** issue, including 1 that the comments do not mention.

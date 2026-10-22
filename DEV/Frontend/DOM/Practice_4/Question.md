# Practice 4 – Theme Switcher

Difficulty: ★☆☆

A light/dark theme page is given but the dark theme never appears. Tasks are in the comments of `index.html`, `style.css` and `script.js`.

## Test cases

| Action | `<body>` class | Button text | `aria-pressed` | Look |
|---|---|---|---|---|
| (page load) | none | Dark Mode | false | light |
| click once | `dark` | Light Mode | true | dark page, dark card |
| click twice | none | Dark Mode | false | light again |
| click 5 times | `dark` | Light Mode | true | dark |

## Rules

- Use `classList` for the theme. Do not set `style.backgroundColor` in JS.
- Use `setAttribute` for `aria-pressed`.
- No inline `onclick`.
- There is **1 more bug** in the CSS that the comments do not mention (hint: it does not stop the page working, but a feature is missing).

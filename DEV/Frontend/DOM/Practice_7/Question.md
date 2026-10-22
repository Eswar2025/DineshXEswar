# Practice 7 – Tabs

Difficulty: ★★☆ (data attributes, many elements, loops)

Tasks are in the comments of `index.html`, `style.css` and `script.js`.

## Test cases

| Action | Active tab | Visible panel | `#status` |
|---|---|---|---|
| page load | HTML | panel1 | Currently viewing: HTML |
| click CSS | CSS | panel2 | Currently viewing: CSS |
| click JavaScript | JavaScript | panel3 | Currently viewing: JavaScript |
| click JavaScript again | JavaScript | panel3 (no change) | same |
| click HTML | HTML | panel1 | Currently viewing: HTML |

At any time exactly **one** tab and **one** panel have the class `active`.

## Rules

- Use `data-target`, do not hard-code panel ids in JS.
- Use `dataset` or `getAttribute` to read the attribute.
- No inline `onclick`.
- There is **1 more bug** in the HTML that the comments do not mention (hint: one panel will never be found by its `data-target`, even after you add the attribute to its tab).

# Practice 8 – Grocery Search + Filter

Difficulty: ★★★ (two conditions together, state, many elements). Still the same OA style, no API calls.

Tasks are in the comments of `index.html`, `style.css` and `script.js`.

## Test cases

| Search text | Active category | Items shown | `#countText` | `#noResults` |
|---|---|---|---|---|
| (empty) | All | Apple, Banana, Carrot, Spinach, Milk, Cheese | Showing 6 items | hidden |
| (empty) | Fruit | Apple, Banana | Showing 2 items | hidden |
| (empty) | Veg | Carrot, Spinach | Showing 2 items | hidden |
| (empty) | Dairy | Milk, Cheese | Showing 2 items | hidden |
| `a` | All | Apple, Banana, Carrot, Spinach | Showing 4 items | hidden |
| `A` (capital) | All | same as above (case-insensitive) | Showing 4 items | hidden |
| `ch` | Dairy | Cheese | Showing 1 item | hidden |
| `ch` | Fruit | none | Showing 0 items | **visible** |
| `zzz` | All | none | Showing 0 items | **visible** |
| clear the search again | Veg | Carrot, Spinach | Showing 2 items | hidden |

## Rules

- No inline `onclick`.
- Do not delete and re-create the `<li>` elements. Only add or remove the class `hidden`.
- Use the `input` event for the search box.
- Besides the data-category issues mentioned in the HTML comment, there is **1 more bug** in the CSS: a message that should appear is invisible even when the class `hidden` is removed.

# Hints – Practice 8

## HTML
- Compare the `data-category` value of every `<li>` with the button values (fruit / veg / dairy). Spell each one exactly.
- One `<li>` has no `data-category` at all.

## CSS
- `.hidden { display: none; }`
- `.filter-btn.active` (no space) for the active button.
- Hidden bug: look at the colour of `#noResults`. What is the background of the card?

## JS
- Keep two variables at the top: `let activeCategory = "all"` and read the search text fresh each time.
- Write ONE function, for example `applyFilters()`, that does everything:
  1. read `searchBox.value.toLowerCase().trim()`
  2. loop all `li` items
  3. `matchesText = item.textContent.toLowerCase().includes(search)`
  4. `matchesCategory = activeCategory === "all" || item.dataset.category === activeCategory`
  5. `item.classList.toggle("hidden", !(matchesText && matchesCategory))`
  6. count the shown items, update `#countText`, toggle `#noResults`
- Call `applyFilters()` from both the button click handler and the `input` event handler. Do not write the filtering twice.
- Button click: remove `active` from all buttons, add to the clicked one, set `activeCategory = button.dataset.category`, then `applyFilters()`.
- Singular/plural: `count === 1 ? "item" : "items"`.

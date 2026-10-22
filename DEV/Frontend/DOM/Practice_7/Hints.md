# Hints – Practice 7

## HTML
- A `data-*` attribute is written like `data-target="panel3"`.
- Read the three panel ids carefully, one letter at a time.
- "Active at the start" means the class must already be in the HTML for Tab 1 and Panel 1.

## CSS
- `.panel .active` = an `.active` element **inside** a panel. You need `.panel.active` (no space), the same element with both classes.
- `.tab.active` for the tab style, `border-bottom: 3px solid #4f46e5`.

## JS
- `const tabs = document.querySelectorAll(".tab")` and `const panels = document.querySelectorAll(".panel")`.
- Loop tabs with `forEach`; inside the click handler:
  1. loop all tabs: remove `active`
  2. loop all panels: remove `active`
  3. add `active` to the clicked tab
  4. find the panel: `document.getElementById(tab.dataset.target)` and add `active`
  5. update `#status` with `tab.textContent`
- Use `this` or the `tab` variable of the loop to know which tab was clicked.

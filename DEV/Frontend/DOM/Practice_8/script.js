/*
  TASK 3 (JS):
  The list can be filtered in two ways at the same time:
    (a) by the text typed in #searchBox (case-insensitive, matches anywhere in the name)
    (b) by the category button that is "active"

  1. Clicking a filter button makes it the only "active" button
     and filters the list by its data-category ("all" shows every category).
  2. Typing in the search box filters the list on every keystroke.
  3. An item is shown only if it matches BOTH the search text and the active category.
     Hide an item by giving it the class "hidden", show it by removing "hidden".
  4. #countText always shows "Showing N items" (use "item" if N is 1).
  5. When N is 0, the paragraph #noResults is visible; otherwise it is hidden
     (use the class "hidden" on it as well).
*/

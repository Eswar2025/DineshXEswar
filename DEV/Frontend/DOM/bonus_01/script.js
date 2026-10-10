/*
  TASK 3 (JS):
  The maximum length of a post is 50 characters.

  1. Every time the user types, #remaining shows 50 minus the number of characters typed.
  2. #remaining has the class "danger" when 0 or fewer characters are left
     (typing past 50 is allowed).
     Else it has the class "warning" when 10 or fewer characters are left.
     Otherwise it has neither class.
  3. The Post button is disabled when the text is empty (spaces only counts as empty)
     OR when the text is longer than 50 characters. Otherwise it is enabled.
  4. Clicking Clear empties the textarea, and everything goes back to the starting state:
     remaining = 50, no classes, Post button disabled.
*/

/*
  TASK 3 (JS):
  When the form is submitted:
  1. The page must NOT reload.
  2. Validate the three fields:
       username -> at least 3 characters (spaces around are ignored)
                   error: "Username must be at least 3 characters"
       email    -> must contain "@" and a "." after the "@"
                   error: "Enter a valid email"
       password -> at least 6 characters
                   error: "Password must be at least 6 characters"
  3. For an invalid field:
       - put the error text in its error <span> and give the span the class "show"
       - give the input the class "invalid"
  4. For a valid field:
       - clear the error text and remove the class "show"
       - give the input the class "valid" (and remove "invalid")
  5. If ALL fields are valid:
       - #successMsg text becomes: "Welcome, <username>!"
       - the form fields are cleared and all "valid" classes are removed
     If any field is invalid, #successMsg must be empty.
*/

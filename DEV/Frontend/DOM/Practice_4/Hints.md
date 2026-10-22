# Hints – Practice 4

## HTML
- Add both attributes inside the opening tag of the button, separated by spaces.

## CSS
- The class `dark` is on `<body>` itself. Read the selector `body .dark .card` out loud. It means "a `.dark` **inside** body", which is not the same as "body that **has** class dark".
- Same element, same class: `body.dark` (no space).
- Compare `.dark` against the `body` rule. Which one is more specific?
- Hidden bug: check the spelling of every property name.

## JS
- `document.body.classList.toggle("dark")` flips the class and returns `true` if the class is now on.
- You can store that return value in a variable and use it to decide the button text.
- `button.textContent = ...` and `button.setAttribute("aria-pressed", "true")`. The attribute value is a **string**.

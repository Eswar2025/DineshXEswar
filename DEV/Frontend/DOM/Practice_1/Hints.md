# Hints

Try each task yourself first. Open only the hint you need.
Everything here is in your notes (`../Notes_Claude.md`): sections 4, 5, 6 and 7.

## Before you start

Every task follows the same recipe: **Select → Listen → Change**.

## Task 1 & 2 – Change the text

- **Select:** the heading and the button both have an `id`. Which method finds an element by id?
  `document.getElementById("...")`
- The paragraph has a **class**, not an id. Use `document.querySelector(".description")`.
- **Listen:** `buttonVariable.addEventListener("click", function () { ... })`
- **Change:** which property changes the text of an element? (`textContent`)
- Both changes can go inside the **same** click function of `#textBtn`.

Shape of the answer (fill in the blanks):
```js
const title = document.getElementById("____");
const btn = document.getElementById("____");

btn.addEventListener("click", function () {
  title.____ = "____";
});
```

## Task 3 – Change the heading colour

- Same pattern as above, but with the other button (`styleBtn`).
- Colour is a **style**: `element.style.color = "..."`

## Task 4 – Add a class

- Select the box with id `card`.
- Adding a class: `element.classList.add("class-name")`
- Do not write a dot before the name here (`"highlight"`, not `".highlight"`).

## Bonus 5 – Switch on and off

- Replace `classList.add(...)` with `classList.toggle(...)`.
  It adds the class if it is missing and removes it if it is there.

## Still nothing happening?

- Open F12 → **Console**. Red errors tell you the line number.
- `Cannot read properties of null` means your selector did not find the element. Check the id/class spelling.
- Use `console.log(title)` after selecting to check that you actually got the element.
- Is `<script>` at the bottom of `<body>`? (It already is in this project.)

## Check your answer

Each task works when you click and see the page change **without reloading**.
Then open F12 → Elements and watch the heading's `style="color: tomato;"` and the card's `class="highlight"` appear. That is the DOM being updated.

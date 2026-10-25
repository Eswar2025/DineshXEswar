# DOM (Document Object Model) – Notes

## 1. What is the DOM?

When a browser loads an HTML file, it does **not** work with the text directly. It reads the HTML and builds a **live, in-memory tree of objects** that represents the page. That tree is the **DOM**.

- **Document** – the web page.
- **Object** – every tag, attribute and piece of text becomes a JavaScript object.
- **Model** – a structured representation (a tree) you can inspect and change.

> The DOM is **not** your HTML file. The HTML file is just the starting blueprint. The DOM is the living copy in the browser's memory, and JavaScript can change it while the page is open.

It is also **not part of JavaScript itself**. It is a **Web API** provided by the browser, which JS can use through the global `document` object.

```
HTML file  --(browser parses)-->  DOM tree  --(browser paints)-->  What you see
                                     ^
                                     |  JavaScript reads / changes this
```

## 2. The DOM tree

```html
<html>
  <body>
    <h1 id="message">Hello</h1>
    <button class="btn">Click</button>
  </body>
</html>
```

becomes:

```
document
└── html
    ├── head
    └── body
        ├── h1#message
        │   └── "Hello"        (text node)
        └── button.btn
            └── "Click"        (text node)
```

Terms:
- **Node** – any item in the tree.
- **Element node** – an HTML tag (`<h1>`, `<button>`).
- **Text node** – the text inside a tag.
- **Attribute** – extra info on a tag (`id`, `class`, `data-color`).
- **Parent / Child / Sibling** – relationships between nodes (`body` is the parent of `h1`; `h1` and `button` are siblings).
- **Root** – `document` is the top of everything.

## 3. Why does the DOM matter?

HTML + CSS alone are static. The DOM is the bridge that lets JavaScript make the page **dynamic**:
- change text, styles, classes and attributes
- add or remove elements
- react to user actions (click, type, scroll, submit)

Every interactive site (menus, dark mode, to-do lists, form validation) works this way. React, Vue and similar frameworks are tools built on top of DOM manipulation.

## 4. The 3-step pattern (remember this!)

Almost all DOM code follows the same recipe:

1. **Select** an element
2. **Listen** for an event
3. **Change** something in the DOM

## 5. Selecting elements

| Method | Returns | Example |
|---|---|---|
| `document.getElementById("id")` | one element | `document.getElementById("message")` |
| `document.querySelector("css")` | first match | `document.querySelector(".btn")` |
| `document.querySelectorAll("css")` | **NodeList** of all matches | `document.querySelectorAll(".btn")` |
| `document.getElementsByClassName("c")` | live HTMLCollection | older style |
| `document.getElementsByTagName("p")` | live HTMLCollection | older style |

`querySelector` / `querySelectorAll` take any CSS selector, so they are the most flexible and commonly used.

If nothing matches, `querySelector` returns `null`, and using it causes the famous error *"Cannot read properties of null"*.

## 6. Changing elements

**Text / HTML**
```js
el.textContent = "New text";     // safe, plain text
el.innerHTML = "<b>Bold</b>";    // parses HTML (avoid with user input: XSS risk)
```

**Style (inline)**
```js
el.style.color = "red";
el.style.backgroundColor = "yellow";   // CSS background-color -> camelCase
```

**Classes (preferred way to change looks)**
```js
el.classList.add("active");
el.classList.remove("active");
el.classList.toggle("active");
el.classList.contains("active");
```

**Attributes**
```js
el.getAttribute("href");
el.setAttribute("href", "https://example.com");
el.dataset.color;          // reads data-color="..." from HTML
```

**Creating / removing elements**
```js
const li = document.createElement("li");
li.textContent = "New item";
list.appendChild(li);      // add to the page
li.remove();               // delete from the page
```

**Navigating the tree**
```js
el.parentElement
el.children
el.firstElementChild
el.nextElementSibling
```

## 7. Events

An **event** is something that happens: a click, key press, mouse move, form submit, page load.

```js
element.addEventListener("click", function (event) {
  // runs every time the element is clicked
});
```

- `event.target` is the element that was actually clicked.
- Common events: `click`, `input`, `change`, `submit`, `keydown`, `mouseover`, `DOMContentLoaded`.

## 8. When does the JS run? (script placement)

JS can only find elements that **already exist** in the DOM. If the `<script>` runs before the `<h1>` is parsed, `getElementById` returns `null`. Fixes:
- put `<script src="script.js"></script>` at the **end of `<body>`** (used in our example), or
- use `<script defer src="script.js"></script>` in the `<head>`, or
- wrap code in `document.addEventListener("DOMContentLoaded", ...)`.

## 9. `textContent` vs `innerHTML` vs `innerText`

| Property | Behavior |
|---|---|
| `textContent` | Raw text, ignores HTML tags, fastest, safe |
| `innerText` | Text as visible on screen (respects CSS like `display:none`) |
| `innerHTML` | Reads/writes HTML markup, can be unsafe with user input |

## 10. Inline style vs classList

- `el.style.x = ...` writes directly on the element and beats most CSS rules. Good for quick or computed values (like our colour).
- `classList` keeps the styling in the CSS file and JS only switches names. Cleaner for real projects.

## 11. DOM vs BOM

- **DOM** – the page content (`document`).
- **BOM** (Browser Object Model) – the browser itself: `window`, `location`, `history`, `navigator`, `alert()`, `setTimeout()`.

`document` is actually a property of `window` (`window.document`).

## 12. Handy debugging tips

- Press **F12 → Elements tab**: this shows the **live DOM**, not your original file. Watch it change as you click.
- Press **F12 → Console**: type `document.body` or `document.getElementById("message")` to explore.
- `console.log(element)` prints the element; `console.dir(element)` shows it as an object with all properties.

## 13. The Example Lesson (in `Example/`)

Files: `Example/index.html`, `Example/style.css`, `Example/script.js`

**What it does:** shows `You pressed ______ color button` in an `<h1>` and 7 VIBGYOR buttons. Clicking a button changes the heading text, heading colour, page background, and highlights the clicked button.

**How it maps to the DOM concepts:**

| What happens | DOM concept used | Code |
|---|---|---|
| Find the heading | Select by id | `document.getElementById("message")` |
| Find all 7 buttons | Select many (NodeList) | `document.querySelectorAll(".color-btn")` |
| Loop over buttons | NodeList `forEach` | `buttons.forEach(...)` |
| React to a click | Event listener | `button.addEventListener("click", ...)` |
| Know which colour | Read data attribute | `button.dataset.color` |
| Change heading text | Update text node | `message.textContent = ...` |
| Change heading colour | Inline style | `message.style.color = color` |
| Change page background | Inline style on `<body>` | `document.body.style.backgroundColor = color` |
| Highlight clicked button | Class manipulation | `classList.remove("active")` / `classList.add("active")` |

**Try this after reading the code:**
1. Open `index.html` in the browser and open F12 → Elements. Click buttons and watch the `<h1>` `style="..."` and the `class="color-btn active"` change live. That is the DOM being updated.
2. Open the Console and type `document.getElementById("message").textContent = "Hi"`. The page changes without any button.
3. Remove the line that changes the background and see the difference.
4. Move the `<script>` tag into `<head>` (without `defer`) and see the error in the console. This shows why timing matters.
5. Challenge: add an 8th button (pink), or make a "Reset" button that restores the original text and colours.

## 14. Quick summary

- The DOM is a tree of objects the browser builds from your HTML.
- `document` is the entry point.
- JS **selects** nodes, **listens** to events, and **changes** the tree.
- The browser automatically re-paints the page whenever the DOM changes.

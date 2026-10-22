# Interactive Shape Switcher

You are given a page with three buttons: **Triangle**, **Circle** and **Square**, and an empty canvas area below them.
When the user clicks a button, the matching shape must be displayed in the canvas.

The code is almost complete, but there is **one problem in each file** (HTML, CSS and JavaScript). Read the comments in each file, find the problem and fix it so the page works as described.

## Files

| File | What to do |
|---|---|
| `index.html` | Find and fix 1 problem |
| `style.css` | Find and fix 1 problem |
| `script.js` | Complete the unfinished code |

Open `index.html` in the browser to run the page. Do not rename existing ids or class names.

## Expected behaviour

| Action | Canvas shows |
|---|---|
| page load | nothing (empty canvas) |
| click **Square** | a square |
| click **Circle** | a circle (the square is gone) |
| click **Triangle** | a triangle (the circle is gone) |
| click the same button twice | the same shape stays |

Only **one** shape is visible at a time.

## Notes

- Each button stores the name of its shape in the `data-shape` attribute.
- The CSS has one class per shape. The class name must match the shape name.
- The canvas shape is the element with `id="shape"`.

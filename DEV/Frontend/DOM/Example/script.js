// ---------- STEP 1: SELECT elements (find nodes in the DOM tree) ----------
const message = document.getElementById("message");        // the <h1>
const buttons = document.querySelectorAll(".color-btn");   // all 7 buttons (NodeList)

// ---------- STEP 2: LISTEN for events on each button ----------
buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    // Read the colour from the HTML attribute data-color="..."
    const color = button.dataset.color;

    // ---------- STEP 3: CHANGE the DOM ----------

    // (a) Change TEXT content of the <h1>
    message.textContent = "You pressed " + color + " color button";

    // (b) Change STYLE of the <h1> (inline style)
    message.style.color = color;

    // (c) Change STYLE of <body> (page background, softened with opacity-like tint)
    document.body.style.backgroundColor = color;

    // (d) Change CLASSES: remove "active" from all buttons, add to the clicked one
    buttons.forEach(function (b) {
      b.classList.remove("active");
    });
    button.classList.add("active");

    // Peek into the DOM from the browser console (F12) to see what changed
    console.log("Clicked:", button, "-> h1 text is now:", message.textContent);
  });
});

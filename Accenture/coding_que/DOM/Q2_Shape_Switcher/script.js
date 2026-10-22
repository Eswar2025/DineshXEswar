const shape = document.getElementById("shape");
const buttons = document.querySelectorAll(".shape-btn");

/*
  PROBLEM (JavaScript):
  The code below is not finished.
  1. showShape(name) must make the #shape element have the class "shape"
     AND the class with the given name, replacing any shape shown before.
  2. Each button, when clicked, must call showShape() with the shape name
     stored in its own data-shape attribute.
  Complete the two unfinished lines.
*/
function showShape(name) {
  shape.className = "shape " + ;
}

buttons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    showShape();
  });
});

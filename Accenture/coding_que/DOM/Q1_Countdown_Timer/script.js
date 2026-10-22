const startBtn = document.getElementById("startBtn");
const timerEl = document.getElementById("timer10");

// Given: shows the browser pop-up. Do not change this function.
function showPopup() {
  alert("Countdown finished!");
}

/*
  TASK 3 (JavaScript):
  When the Start button is clicked:
    1. Start an interval that runs every 1 second.
    2. Each second, decrease the number in the timer10 span by 1.
    3. When the number reaches 1, clear the interval and call showPopup().
    4. Clicking Start while the timer is running must not start a second timer.
    5. After it has finished, clicking Start again must start from 10 again.
*/

/*
  HELP: timer syntax for beginners

  1. setInterval: runs a function again and again, every X milliseconds
       const id = setInterval(function () {
         // this code runs every 1000 ms (1 second)
       }, 1000);

  2. clearInterval: stops that repeating timer (you need the id from above)
       clearInterval(id);

  3. A loop (for / while) can NOT wait 1 second between steps.
     Use setInterval instead of a loop.

  4. Keep the number in a variable so you don't have to read it from the page:
       let count = 10;
       count = count - 1;              // go down by 1
       timerEl.innerText = count;      // show it on the page

  5. Remember if a timer is running by storing its id outside the click function:
       let timerId = null;                 // null = no timer running
       if (timerId !== null) { return; }   // already running, so do nothing
       timerId = null;                     // set back to null after clearInterval

  Hints:
    - JavaScript has no int(). To convert text to a number use
      parseInt("10") or Number("10").
    - Declare variables with let or const.
*/

// let timerId = null;   // <- variables that must survive between clicks go here

startBtn.addEventListener("click", function () {
  // write your code here
  timerEl.innerText = "10";
  let i;
  // timerEl.innerText = "Heyy"
  for (i = 10; i > 1; i--) {
    setTimeout(() => {
    timerEl.innerText = i;
    // Do nothing
    }, 1000);
  }
});

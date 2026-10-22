/*
  TASK 3 (JS):
  1. Clicking "+" increases the number by 1.
  2. Clicking "-" decreases the number by 1, but it must never go below 0.
  3. Clicking "Reset" sets the number back to 0.
  4. While the number is 10 or more, the number element has the class "high". Otherwise the class must not be there.
*/

const plusEle = document.getElementById("incBtn");
const minusEle = document.getElementById("decBtn");
const resetEle = document.getElementById("resetBtn");
const countEle = document.getElementById("count");

plusEle.addEventListener("click", function (plus) {
  const temp = Number(countEle.textContent);
  countEle.textContent = temp + 1;

  if (temp == 9) {
    countEle.classList.add("high");
  }
});

minusEle.addEventListener("click", function (minus) {
  let temp = Number(countEle.textContent);
  if (temp !== 0) {
    // '0' == 0 gives true
    // '0' === 0 gives false
    if (temp == 10) {
      countEle.classList.remove("high");
    }
    countEle.textContent = temp - 1;
  }
});

resetEle.addEventListener("click", function (re) {
  let temp = Number(countEle.textContent);

  if (temp >= 10) {
    countEle.classList.remove("high");
  }
  countEle.textContent = 0;
});

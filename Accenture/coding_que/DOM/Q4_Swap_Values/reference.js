// Reference answer for Q4 (script.js). Try the question yourself before opening this.
let count = 0;

swapBtn.addEventListener("click", function () {
  if (firstInput.value === "" && secondInput.value === "") {
    return;
  }

  const temp = firstInput.value;
  firstInput.value = secondInput.value;
  secondInput.value = temp;

  count = count + 1;
  swapCount.textContent = "Swaps done: " + count;
});

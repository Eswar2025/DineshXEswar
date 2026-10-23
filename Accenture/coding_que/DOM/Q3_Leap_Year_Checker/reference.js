// Reference answer for Q3 (script.js). Try the question yourself before opening this.
checkBtn.addEventListener("click", function () {
  const value = yearInput.value;

  if (value === "") {
    result.textContent = "Please enter a year";
    result.className = "error";
    return;
  }

  const year = Number(value);
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  if (isLeap) {
    result.textContent = year + " is a leap year";
    result.className = "leap";
  } else {
    result.textContent = year + " is not a leap year";
    result.className = "not-leap";
  }
});

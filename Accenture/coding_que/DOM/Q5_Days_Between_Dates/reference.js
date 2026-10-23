// Reference answer for Q5 (script.js). Try the question yourself before opening this.
calcBtn.addEventListener("click", function () {
  if (startDate.value === "" || endDate.value === "") {
    result.textContent = "Please select both dates";
    return;
  }

  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  if (end < start) {
    result.textContent = "End date must be after start date";
    return;
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.round((end - start) / msPerDay);

  result.textContent = days + (days === 1 ? " day" : " days");
});

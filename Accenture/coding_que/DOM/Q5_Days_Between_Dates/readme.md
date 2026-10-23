# Days Between Dates

You are given a page with a **Calculate** button and a result area. The page is not complete.
Finish the three tasks, one in each file, so the widget works as described.

Suggested time: 10 minutes.

## Files

| File | What to do |
|---|---|
| `index.html` | Task 1 |
| `style.css` | Task 2 |
| `script.js` | Task 3 |

Open `index.html` in the browser to run the page. Do not change the ids of elements that already exist.

## Tasks

1. **HTML** – Create two date inputs (`type="date"`) with `id="startDate"` and `id="endDate"`, each with a label (`Start date`, `End date`).
2. **CSS** – The result text must be bold with the text colour `#A100FF`.
3. **JavaScript** – When **Calculate** is clicked, show the number of days between the two dates (see the rules in `script.js`).

## Expected behaviour

| Start date | End date | Message shown |
|---|---|---|
| (empty) | any | `Please select both dates` |
| `2026-01-01` | `2026-01-31` | `30 days` |
| `2026-03-10` | `2026-03-11` | `1 day` |
| `2026-05-05` | `2026-05-05` | `0 days` |
| `2026-02-01` | `2026-01-01` | `End date must be after start date` |

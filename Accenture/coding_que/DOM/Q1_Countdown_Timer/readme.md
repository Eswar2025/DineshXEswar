# Countdown Timer Widget

You are given a page with a **Start** button and a countdown timer. The page is not complete.
Finish the three tasks, one in each file, so the widget works as described.

## Files

| File | What to do |
|---|---|
| `index.html` | Task 1 |
| `style.css` | Task 2 |
| `script.js` | Task 3 |

Open `index.html` in the browser to run the page. Do not change the ids of elements that already exist.

## Tasks

1. **HTML** – Create a `<span>` element with `id="timer10"` and `value="10"`. It must show the text `10`. This span holds the countdown number.
2. **CSS** – Apply the text colour `#A100FF` to the timer display (the `timer10` span).
3. **JavaScript** – When the **Start** button is clicked:
   - start a timer that runs **every 1 second**
   - each second the number in `timer10` decreases by 1 (`10`, `9`, `8`, ... `1`)
   - when the number reaches `1`, stop the interval (clear it) and show the pop-up with the given `showPopup()` function

## Expected behaviour

| Moment | Number shown | Pop-up |
|---|---|---|
| page load | 10 | no |
| click Start, after 1 second | 9 | no |
| after 5 seconds | 5 | no |
| after 9 seconds | 1 | **yes**, and the number stays 1 |
| 5 seconds after the pop-up | still 1 (the interval is stopped) | only one pop-up in total |

Also:
- Clicking Start **while the timer is already running** must not start a second timer (the number must not drop faster).
- After the countdown has finished, clicking Start again starts again from `10`.

## Notes

- The pop-up code is already written for you in `showPopup()`. Call it, do not rewrite it.
- Use `setInterval` and `clearInterval`.
- Read and write the number with `textContent`. Remember it is a string.

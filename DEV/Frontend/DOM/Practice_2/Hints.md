# Hints – Practice 2

Try on your own first. Notes: `../Notes_Claude.md` sections 4 to 7.

## Task 1 – Add the attribute

- Attributes go inside the opening tag: `<button class="swap-btn" ...>`.
- You need an `id`. Also think about what `type` a button has by default inside a `<form>` (not needed here, but OA tests like `type="button"`).

## Task 2 – Circle

- A circle needs **equal width and height**, then `border-radius: 50%`.
- Look at the current `width` and `height` of `.swap-btn`. Are they equal?

## Task 3 – Swap logic

Recipe: **Select → Listen → Change**.

- Select three things by id: the two inputs and the button.
- The text of an `<input>` is **not** in `textContent`. Which property holds what is typed? (`value`)
- Swapping two variables needs a **temporary** variable (or array destructuring).

Shape of the answer:
```js
btn.addEventListener("click", function () {
  const temp = inputA.____;
  inputA.____ = inputB.____;
  inputB.____ = temp;
});
```

- Read `.value` **inside** the click function, so you get the latest typed text. If you store `.value` in a variable outside the function, you only get the old value.

## Bonus bugs

1. **HTML:** A `<label>` is connected to its input by `for="..."` matching the input's `id`. Compare the two labels with their inputs. Click each label: does the input get focus?
2. **CSS:** Hover over the button. Is the pointer a hand? Check every CSS property name for spelling mistakes (the browser silently ignores unknown ones).

## Debug checklist

- Console (F12) errors: `Cannot read properties of null` = wrong id or script ran too early.
- `console.log(inputA.value, inputB.value)` before and after the swap.
- Elements tab: after clicking, check the `value` property in the Console, not only the attribute in the Elements tab (the attribute does not update when you type).

# Last-minute notes: SQL + DOM, in the order we learnt them

Read top to bottom. Each part goes from the basics to the harder topics.
Blocks marked **IMPORTANT** are the places where students lose marks in online assessments (OAs).
Topics marked **(new)** were not in the lessons, they came up in the practice questions, so read them twice.

SQL examples use an online-shop schema (`customer`, `customer_order`, `order_item`, `product`, `category`, `payment`).

---

# PART A: SQL

## 1. SELECT, FROM and aliases

```sql
SELECT * FROM product;                              -- all columns
SELECT NAME, UNIT_PRICE FROM product;               -- chosen columns
SELECT NAME AS product_name FROM product;           -- alias: renames the column header
SELECT DISTINCT building_name FROM buildings;       -- remove duplicate rows
SELECT UNIT_PRICE * 2 AS double_price FROM product; -- expressions are allowed
```

> **IMPORTANT: output column names.** The exam says exactly which columns and which names to show, in which order. Use `AS` to match them (`AS username`). Wrong name or wrong order can fail a correct query.

## 2. Filtering rows with WHERE

```sql
SELECT * FROM product WHERE UNIT_PRICE > 50 AND CODE LIKE 'P%';
SELECT * FROM product WHERE UNIT_PRICE BETWEEN 10 AND 100;   -- both ends included
SELECT * FROM product WHERE CODE IN ('P1', 'P2');
SELECT * FROM product WHERE NOT (UNIT_PRICE = 10 OR UNIT_PRICE = 50);
```

| Operator | Meaning |
|---|---|
| `=  <>  >  >=  <  <=` | compare (`<>` is "not equal") |
| `AND  OR  NOT` | combine conditions, use brackets when mixing |
| `LIKE 'A%'`, `'%a'`, `'%a%'` | starts with / ends with / contains (`_` is one character) |
| `IN (...)`, `BETWEEN a AND b` | list / range |

> **IMPORTANT:** read `>` vs `>=`, "at least" vs "more than", and "not" carefully in the question.

## 3. Sorting and limiting

```sql
SELECT * FROM product ORDER BY UNIT_PRICE DESC, NAME ASC;   -- first key, then tie-breaker
SELECT * FROM product ORDER BY UNIT_PRICE DESC LIMIT 3;     -- top 3
```

> **IMPORTANT:** when the question gives two sort rules ("by total descending, then by name ascending"), write both. The default direction is `ASC`.

## 4. NULL (lesson 8)

NULL means "no value". It is never equal to anything, not even to another NULL.

```sql
WHERE building IS NULL          -- correct
WHERE building IS NOT NULL      -- correct
WHERE building = NULL           -- WRONG: returns nothing
```

`COALESCE(x, 0)` gives `x`, or `0` if `x` is NULL:

```sql
SELECT COALESCE(SUM(QUANTITY), 0) FROM order_item;
```

> **IMPORTANT:** never write `= NULL`. Aggregates ignore NULLs, and `SUM` of no rows is NULL, not 0.

## 5. INNER JOIN (lesson 6)

A join glues rows of two tables where the `ON` condition is true. Rows without a match are dropped.

```sql
SELECT c.USERNAME, o.ORDER_ID
FROM customer c
INNER JOIN customer_order o ON o.CUSTOMER_ID = c.CUSTOMER_ID;
```

- Give tables short aliases (`customer c`) and write `c.USERNAME`. This is required when two tables have a column with the same name (`USERNAME` exists in both `customer` and `customer_order`).
- Join three or more tables by chaining: `FROM a JOIN b ON ... JOIN c ON ...`.
- Foreign key = the column that points to another table's primary key. Follow these arrows in the schema picture to know what to join.

> **IMPORTANT: use only the tables you need.** The schema picture is big on purpose. Most answers use 1 to 3 tables.

> **IMPORTANT: duplicates after a join.** One customer with three orders becomes three rows. Use `DISTINCT` or `GROUP BY` when you need one row per customer.

## 6. OUTER (LEFT) JOIN (lesson 7)

`LEFT JOIN` keeps **every** row of the left table. If the right table has no match, its columns are NULL.

```sql
SELECT c.USERNAME, o.ORDER_ID
FROM customer c
LEFT JOIN customer_order o ON o.CUSTOMER_ID = c.CUSTOMER_ID;
```

"Who has no ...": LEFT JOIN, then keep the NULL rows.

```sql
SELECT c.USERNAME
FROM customer c
LEFT JOIN customer_order o ON o.CUSTOMER_ID = c.CUSTOMER_ID
WHERE o.CUSTOMER_ID IS NULL;      -- test a column of the RIGHT table
```

> **IMPORTANT:** `LEFT JOIN` is for "include the ones without a match". If you then filter on a right-table column with `WHERE e.salary > m.salary`, the NULL rows disappear and it behaves like an inner join. Then write `JOIN`.

> **IMPORTANT:** test the right column for NULL. For "buildings with no employees", check `e.building IS NULL` (the employee side), not a building column.

## 7. Aggregates, GROUP BY and HAVING

| Function | Returns |
|---|---|
| `COUNT(*)` | number of rows |
| `COUNT(col)` | rows where `col` is NOT NULL |
| `COUNT(DISTINCT col)` | number of different values |
| `SUM(col)`, `AVG(col)`, `MAX(col)`, `MIN(col)` | total, average, biggest, smallest (NULLs ignored) |

```sql
-- one row per group
SELECT CUSTOMER_ID, COUNT(*) AS orders
FROM customer_order
GROUP BY CUSTOMER_ID;

-- filter the groups with HAVING
SELECT CUSTOMER_ID, COUNT(*) AS orders
FROM customer_order
GROUP BY CUSTOMER_ID
HAVING COUNT(*) >= 2;

-- math inside an aggregate, over a join
SELECT o.CUSTOMER_ID, SUM(oi.QUANTITY * p.UNIT_PRICE) AS total_spent
FROM customer_order o
JOIN order_item oi ON oi.ORDER_ID = o.ORDER_ID
JOIN product p     ON p.PRODUCT_ID = oi.PRODUCT_ID
GROUP BY o.CUSTOMER_ID;
```

Order the query runs in: `FROM / JOIN` -> `WHERE` -> `GROUP BY` -> `HAVING` -> `SELECT` -> `ORDER BY` -> `LIMIT`.

> **IMPORTANT: WHERE vs HAVING.** `WHERE` filters rows before grouping (cannot use `SUM`). `HAVING` filters groups after grouping (can use `SUM`, `COUNT`).

> **IMPORTANT: GROUP BY columns.** Every selected column that is not inside an aggregate must be in `GROUP BY`. Write `GROUP BY c.CATEGORY_ID, c.NAME`, not only the id. It runs on SQLite / MySQL either way, but Oracle and SQL Server reject the short form.

> **IMPORTANT: "including zero".** To list every category even when nothing was sold, start from the category table with `LEFT JOIN` and use `COALESCE(SUM(...), 0)`:

```sql
SELECT c.NAME AS category_name, COALESCE(SUM(oi.QUANTITY), 0) AS units_sold
FROM category c
LEFT JOIN product_category pc ON pc.CATEGORY_ID = c.CATEGORY_ID
LEFT JOIN order_item oi       ON oi.PRODUCT_ID = pc.PRODUCT_ID
GROUP BY c.CATEGORY_ID, c.NAME
ORDER BY units_sold DESC, category_name ASC;
```

> **IMPORTANT:** `COUNT(col)` skips NULLs, so after a `LEFT JOIN` count a column that is never NULL for a real row (like `Name`), not `COUNT(*)`, if you want empty groups to show 0.

## 8. Filtering on a related table (status, type)

"Only paid orders", "only confirmed bookings": add the condition on the table that holds the status.

```sql
SELECT c.USERNAME, SUM(oi.QUANTITY * p.UNIT_PRICE) AS total_spent
FROM customer c
JOIN customer_order o ON o.CUSTOMER_ID = c.CUSTOMER_ID
JOIN payment pay      ON pay.ORDER_ID = o.ORDER_ID AND pay.STATUS = 'PAID'
JOIN order_item oi    ON oi.ORDER_ID = o.ORDER_ID
JOIN product p        ON p.PRODUCT_ID = oi.PRODUCT_ID
GROUP BY c.CUSTOMER_ID, c.USERNAME;
```

> **IMPORTANT:** read which rows count. "Paid only" means pending / failed rows must not be summed. Customers with no qualifying row must not appear (an inner join does this).

## 9. Subqueries (new)

A query inside brackets. "Above average":

```sql
SELECT NAME, UNIT_PRICE
FROM product
WHERE UNIT_PRICE > (SELECT AVG(UNIT_PRICE) FROM product);   -- inner query returns ONE value
```

Other forms:

```sql
WHERE CUSTOMER_ID IN (SELECT CUSTOMER_ID FROM customer_order)         -- list of values
WHERE CUSTOMER_ID NOT IN (SELECT CUSTOMER_ID FROM customer_order)     -- "no order", another way
WHERE NOT EXISTS (SELECT 1 FROM customer_order o WHERE o.CUSTOMER_ID = c.CUSTOMER_ID)
```

> **IMPORTANT:** `NOT IN` returns nothing if the inner list contains a NULL. `LEFT JOIN ... IS NULL` and `NOT EXISTS` are safer.

## 10. CASE WHEN (new)

If / else inside a query:

```sql
SELECT USERNAME,
       CASE WHEN total_spent >= 500 THEN 'GOLD' ELSE 'SILVER' END AS tier
FROM spend;
```

You can chain several `WHEN` lines. The first true one wins. Always finish with `END` and give it an alias.

## 11. WITH / CTE (new)

Give a sub-result a name, then use it like a table:

```sql
WITH spend AS (
  SELECT o.CUSTOMER_ID, SUM(oi.QUANTITY * p.UNIT_PRICE) AS total_spent
  FROM customer_order o
  JOIN order_item oi ON oi.ORDER_ID = o.ORDER_ID
  JOIN product p     ON p.PRODUCT_ID = oi.PRODUCT_ID
  GROUP BY o.CUSTOMER_ID
)
SELECT * FROM spend WHERE total_spent > (SELECT AVG(total_spent) FROM spend);
```

> **IMPORTANT: "above the average of the groups".** You cannot nest `AVG(SUM(...))`. First build the per-customer totals (a CTE or a subquery), then compare with the average of those totals.

## 12. Self join and joining text (new)

Join a table to itself with two aliases. Example: employee and their manager (`MANAGER_ID` points to `EMP_ID` of the same table).

```sql
-- schema: hr
SELECT e.FIRST_NAME || ' ' || e.LAST_NAME AS employee_name,    -- || joins text (SQLite / Oracle)
       m.FIRST_NAME || ' ' || m.LAST_NAME AS manager_name,
       e.SALARY - m.SALARY AS salary_difference
FROM employee e
JOIN employee m ON m.EMP_ID = e.MANAGER_ID                       -- e = employee, m = their manager
WHERE e.SALARY > m.SALARY
ORDER BY salary_difference DESC, employee_name ASC;
```

MySQL writes the text join as `CONCAT(e.FIRST_NAME, ' ', e.LAST_NAME)`.

> **IMPORTANT:** the top boss has `MANAGER_ID = NULL`, so the join drops them. That is usually what the question wants.

## 13. Window function RANK (new)

"Top per group, show ties":

```sql
WITH spend AS (
  SELECT f.AIRLINE_ID, b.PASSENGER_ID, SUM(b.FARE_PAID) AS total_fare
  FROM booking b
  JOIN flight f ON f.FLIGHT_ID = b.FLIGHT_ID
  WHERE b.STATUS = 'CONFIRMED'
  GROUP BY f.AIRLINE_ID, b.PASSENGER_ID
),
ranked AS (
  SELECT *, RANK() OVER (PARTITION BY AIRLINE_ID ORDER BY total_fare DESC) AS rnk
  FROM spend
)
SELECT * FROM ranked WHERE rnk = 1;       -- RANK gives tied rows the same rank, so all ties stay
```

- `PARTITION BY` restarts the ranking for each group. `ORDER BY` decides the rank.
- You cannot write `WHERE rnk = 1` in the same query that creates `rnk`. Wrap it in a CTE or subquery first.
- `LIMIT 1` would drop tied rows, so use `RANK()` when the question says "include ties".

## 14. Quick guide: sentence in the question -> tool

| The question says | Use |
|---|---|
| "who has not / never / no ..." | `LEFT JOIN ... WHERE right_col IS NULL` |
| "including those with zero" | `LEFT JOIN` + `COALESCE(..., 0)` |
| "for each / per ..." | `GROUP BY` |
| "at least N" / "more than N" | `GROUP BY` + `HAVING` |
| "above / below average" | `WHERE col > (SELECT AVG(col) ...)` |
| "total spent / revenue" | `SUM(quantity * price)` |
| "only paid / only confirmed" | status filter in `WHERE` or the join `ON` |
| "label / tier / grade" | `CASE WHEN` |
| "earns more than their manager" | self join |
| "highest per group, include ties" | `RANK() OVER (PARTITION BY ...)` |
| "top 3" | `ORDER BY ... LIMIT 3` |

## 15. SQL: mistakes that cost marks in OAs

1. Wrong output column names or column order.
2. Missing the second sort key, or the wrong direction.
3. `= NULL` instead of `IS NULL`.
4. `WHERE` used where `HAVING` is needed (or the other way round).
5. `INNER JOIN` where the question wants the rows with no match (customers with no orders disappear).
6. Counting rows that should not count (unpaid, cancelled, pending).
7. Duplicate rows after a join, and double counting in sums.
8. Selected columns missing from `GROUP BY`.
9. `>` vs `>=`, and forgetting tied rows.
10. Using many tables just because the picture has many.

**Exam routine:** read the question, find the 1 to 3 tables, write the query, press **Run Query** and compare with the expected columns, then press **Check Query**. Submit exactly one query.

---

# PART B: DOM (HTML + CSS + JavaScript)

## 1. What the DOM is

The browser reads the HTML and builds a live tree of objects. JavaScript can read and change that tree while the page is open. The entry point is the global `document`.

```
document -> html -> body -> h1#message, button.btn ...
```

Page changes happen through the 3-step recipe, used in every task:

1. **Select** the element
2. **Listen** for an event
3. **Change** something

```js
const btn = document.getElementById("btn");        // 1. select
btn.addEventListener("click", function () {        // 2. listen
  message.textContent = "Done";                    // 3. change
});
```

> **IMPORTANT: script placement.** Keep `<script src="script.js"></script>` at the end of `<body>`. If the script runs before the elements exist, `getElementById` returns `null` and nothing works.

## 2. Selecting elements

| Code | Gives |
|---|---|
| `document.getElementById("id")` | one element (no `#`) |
| `document.querySelector(".class")`, `("#id")`, `("tag")` | the first match, or `null` |
| `document.querySelectorAll(".class")` | all matches (loop with `.forEach`) |

> **IMPORTANT:** *"Cannot read properties of null"* means nothing matched. Check the id spelling and the `.` (class) or `#` (id) in the selector. `getElementById("btn")` has no `#`, `querySelector("#btn")` has.

## 3. Events

```js
el.addEventListener("click", function () { ... });
input.addEventListener("input", function () { ... });          // runs on every keystroke
form.addEventListener("submit", function (event) {
  event.preventDefault();                                      // stop the page reload
  ...
});
```

- `event.target` is the exact element that was clicked (useful for delete buttons inside a list).
- Common events: `click`, `input`, `change`, `submit`, `keydown`.

Same behaviour on many elements:

```js
buttons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    showShape(btn.dataset.shape);
  });
});
```

The `onclick` way does the same job. You may see it in exam code:

```js
btn.onclick = function () { ... };          // property style: only ONE handler per element
```

```html
<button onclick="sayHi()">Hi</button>       <!-- inline in HTML: calls a function from script.js -->
```

`addEventListener` is preferred: you can attach several handlers to one element, and the JavaScript stays out of the HTML. With `onclick="sayHi()"` the brackets are needed (it is code in a string), with `btn.onclick = sayHi` they are not.

> **IMPORTANT:** pass a function to `addEventListener`. Writing `addEventListener("click", showShape())` runs it immediately instead of on click.

## 4. Changing text, style and classes

| Goal | Code |
|---|---|
| change text | `el.textContent = "Hi"` or `el.innerText = "Hi"` |
| inline style | `el.style.color = "red"`, `el.style.backgroundColor = "#fff"` (camelCase) |
| add / remove a class | `el.classList.add("on")`, `el.classList.remove("on")` |
| switch a class on / off | `el.classList.toggle("on")` or `el.classList.toggle("hidden", condition)` |
| has the class? | `el.classList.contains("done")` |
| replace all classes | `el.className = "shape circle"` |
| disable a button | `btn.disabled = true` |

- `textContent` = raw text, `innerText` = what is visible, `innerHTML` = parses HTML (avoid with user input).
- Prefer a CSS class + `classList` over many `style.x` lines.

> **IMPORTANT:** no dot in `classList.add("highlight")` (the dot is only for selectors and CSS). `className = ...` replaces every class, `classList.add` keeps the others.

## 5. Data attributes

HTML: `<button data-shape="circle">`. JavaScript:

```js
btn.dataset.shape        // "circle"   (data-shape -> dataset.shape)
el.getAttribute("href"); el.setAttribute("href", "x");
```

> **IMPORTANT:** use the data attribute the question gives instead of the button's visible text. Labels can change, the attribute is meant for code. The value must match the CSS class exactly (`circle`, not `Circle`).

## 6. Inputs and forms

```js
input.value              // what the user typed: ALWAYS a string
input.value = "";        // change / clear
form.reset();            // clear a whole form
```

```js
const n = Number(input.value);        // text -> number
if (input.value.trim() === "") { ... } // empty check (trim removes spaces)
```

> **IMPORTANT: `.value` is text.** `"5" + "3"` is `"53"`. Convert with `Number()` or `parseInt()` before maths. There is no `int()` in JavaScript.

> **IMPORTANT: handle the empty input.** Questions almost always ask for a message like "Please enter a value". Check it first.

## 7. Creating and removing elements

```js
const li = document.createElement("li");
li.textContent = "New task";
list.appendChild(li);                    // add to the page
li.remove();                             // delete
event.target.parentElement.remove();     // delete the row of the clicked button
```

## 8. Text, number and maths helpers

```js
value.trim()                 // remove spaces at both ends
value.toLowerCase()          // also toUpperCase()
value.length                 // number of characters
text.includes("ab")          // true / false
email.indexOf("@")           // position, -1 when missing
Math.round(x)   Math.floor(x)   Math.max(a, b)
year % 4 === 0               // % = remainder
a === b                      // compare with === (not ==)
```

Swap two values with a temp variable:

```js
const temp = first.value;
first.value = second.value;
second.value = temp;
```

Leap year: `(year % 4 === 0 && year % 100 !== 0) || year % 400 === 0`.

> **IMPORTANT:** keep counters and flags (`let count = 0;`) **outside** the click function. A variable declared inside is reset on every click.

## 9. Timers, pop-ups and dates

```js
const id = setInterval(function () { ... }, 1000);   // repeat every 1000 ms (1 second)
clearInterval(id);                                   // stop it
setTimeout(function () { ... }, 1000);               // run ONCE after 1 second
alert("Finished!");                                  // browser pop-up
```

Do not start two timers on a double click, and let Start work again after the end:

```js
let timerId = null;                       // null = no timer running
button.addEventListener("click", function () {
  if (timerId !== null) { return; }       // already running, ignore
  let count = 10;
  timerId = setInterval(function () {
    count = count - 1;
    display.textContent = count;
    if (count === 1) {
      clearInterval(timerId);
      timerId = null;                     // allow a new start
      alert("Countdown finished!");
    }
  }, 1000);
});
```

Dates:

```js
const start = new Date("2026-01-01");
const end = new Date("2026-01-31");
const days = Math.round((end - start) / (1000 * 60 * 60 * 24));   // milliseconds -> days
```

> **IMPORTANT:** a `for` / `while` loop cannot wait 1 second between steps, and `setTimeout` does not pause the code. Use `setInterval` for a countdown and always `clearInterval` at the end.

## 10. CSS you will be asked for

```css
color: #A100FF;        background-color: #f1f5f9;     font-weight: bold;
font-size: 1.2rem;     border-radius: 8px;            padding: 10px 20px;

.hidden { display: none; }                  /* JS then toggles the "hidden" class */

/* two boxes side by side with a gap */
.row { display: flex; gap: 12px; justify-content: center; }
```

- A class selector starts with `.`, an id selector with `#`: `.leap { ... }`, `#result { ... }`.
- Hex colours: copy the exact value from the question (`#A100FF`).
- If something is invisible, check for `display: none`, a missing width / height, or a class name that does not match.

## 11. DOM: mistakes that cost marks in OAs

1. Selector typos: wrong id, missing `.` or `#`, or the script placed before the elements.
2. Forgetting that `input.value` is a string.
3. Not handling the empty input, and missing edge cases (same date, both boxes empty).
4. Message text that is not exactly what the question says (spaces, capital letters, "1 day" vs "2 days").
5. Variables declared inside the click handler, so counters reset every click.
6. Starting a timer twice, or not clearing it at the end.
7. Class name in JS different from the CSS class (`"Circle"` vs `.circle`).
8. Renaming or removing existing ids and classes.

**Exam routine:** do the HTML, CSS and JavaScript tasks in that order (each file has a comment saying what is missing), open `index.html`, press **F12** then **Console** to see errors, and test the normal case plus the empty case.

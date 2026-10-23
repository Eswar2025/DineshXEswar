# Last-minute notes (SQL + DOM)

Based on the solutions in `SQL_Questions/` and `DOM/Q2_Shape_Switcher`.

## Status

| Question | Result |
|---|---|
| SQL Q1, Q2, Q3, Q6 | pass all checker tests |
| SQL Q4, Q5, Q7 | not attempted yet (`GROUP BY` + `HAVING`, `CASE WHEN`, `RANK()` / max per group) |

## SQL

1. **Match the exact output column names.** The exam shows headers like `username`, so write `as username`. Q1 and Q2 return `USERNAME`, `NAME`, `UNIT_PRICE`; the local checker ignores case, the real one might not.
2. **Use `JOIN` when the `WHERE` throws away unmatched rows.** In Q6, `LEFT JOIN ... WHERE e1.salary > e2.salary` behaves like an inner join. `LEFT JOIN` only matters when you want the rows with no match (Q1).
3. **Put every selected non-aggregated column in `GROUP BY`.** Q3 groups only by `c.CATEGORY_ID` but selects `c.NAME`. That works in SQLite and MySQL, but fails on Oracle / SQL Server. Use `GROUP BY c.CATEGORY_ID, c.NAME`.
4. **Read the sort order in the question.** Write both parts: `ORDER BY total DESC, name ASC`.
5. **Usual traps:** orders with the wrong payment status, customers with no orders, ties, `>` vs `>=`.
6. **Do Q4, Q5 and Q7 before the exam.**

## DOM

1. **Q2:** the task says to use each button's `data-shape` attribute, but the solution reads `btn.innerText`. That breaks if a label changes. Use `btn.dataset.shape` and remove the leftover `console.log`.
2. Use `.value` for inputs and convert with `Number()` / `parseInt()`.
3. Use `textContent` or `innerText` for output.
4. Keep counters in a variable outside the click handler.
5. Clear the interval at the end (`clearInterval`), as in Q1.

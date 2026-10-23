/*
  Q5 - Customer tiers above average spend   [MEDIUM]
  Schema: see ../schema.svg

  For every customer who has placed at least one order (any payment status),
  let total_spent = sum of QUANTITY * UNIT_PRICE over all items of all of
  their orders.

  Write an SQL query to display the customers whose total_spent is strictly
  greater than the AVERAGE total_spent of all customers who have placed an
  order, together with a tier:
      'GOLD'   if total_spent >= 500
      'SILVER' otherwise

  Your output should contain 3 columns in the below-mentioned order:
      username, total_spent, tier

  Sort by total_spent in descending order, then by username in ascending order.

  Run:  python check.py Q5   (from the SQL_Questions folder)
*/

-- write your query here


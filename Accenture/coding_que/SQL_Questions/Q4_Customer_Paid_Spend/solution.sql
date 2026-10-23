/*
  Q4 - Customer spend on paid orders   [MEDIUM]
  Schema: see ../schema.svg

  Write an SQL query to display, for every customer who has at least one
  order with payment STATUS = 'PAID':
    - the customer's username
    - the total spent: sum of QUANTITY * UNIT_PRICE over all items of that
      customer's PAID orders

  Orders whose payment is not 'PAID' must not be counted.
  Customers with no paid order must not appear.

  Your output should contain 2 columns in the below-mentioned order:
      username, total_spent

  Sort by total_spent in descending order, then by username in ascending order.

  Run:  python check.py Q4   (from the SQL_Questions folder)
*/

-- write your query here


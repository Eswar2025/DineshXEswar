/*
  Q3 - Units sold per category   [EASY-MEDIUM]
  Schema: see ../schema.svg

  Write an SQL query to display, for EVERY category, its name and the total
  number of units sold: the sum of QUANTITY of all order items whose product
  belongs to that category (count every order, whatever its payment status).

  A category with no sold units (or no products) must still appear, with 0.

  Your output should contain 2 columns in the below-mentioned order:
      category_name, units_sold

  Sort by units_sold in descending order, then by category_name in ascending order.

  Run:  python check.py Q3   (from the SQL_Questions folder)
*/

-- write your query here


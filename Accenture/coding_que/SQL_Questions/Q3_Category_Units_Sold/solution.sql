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

select c.NAME AS category_name, COALESCE(SUM(o.QUANTITY), 0) AS units_sold from category c
left join product_category p on p.CATEGORY_ID = c.CATEGORY_ID
left join order_item o on o.PRODUCT_ID = p.PRODUCT_ID
group by c.CATEGORY_ID 
order by units_sold desc, category_name asc ;
WITH spend AS (
  SELECT c.CUSTOMER_ID,
         c.USERNAME,
         SUM(oi.QUANTITY * p.UNIT_PRICE) AS total_spent
  FROM customer c
  JOIN customer_order o ON o.CUSTOMER_ID = c.CUSTOMER_ID
  JOIN order_item oi    ON oi.ORDER_ID = o.ORDER_ID
  JOIN product p        ON p.PRODUCT_ID = oi.PRODUCT_ID
  GROUP BY c.CUSTOMER_ID, c.USERNAME
)
SELECT USERNAME AS username,
       total_spent,
       CASE WHEN total_spent >= 500 THEN 'GOLD' ELSE 'SILVER' END AS tier
FROM spend
WHERE total_spent > (SELECT AVG(total_spent) FROM spend)
ORDER BY total_spent DESC, username ASC;

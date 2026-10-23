SELECT c.USERNAME AS username,
       SUM(oi.QUANTITY * p.UNIT_PRICE) AS total_spent
FROM customer c
JOIN customer_order o ON o.CUSTOMER_ID = c.CUSTOMER_ID
JOIN payment pay      ON pay.ORDER_ID = o.ORDER_ID AND pay.STATUS = 'PAID'
JOIN order_item oi    ON oi.ORDER_ID = o.ORDER_ID
JOIN product p        ON p.PRODUCT_ID = oi.PRODUCT_ID
GROUP BY c.CUSTOMER_ID, c.USERNAME
ORDER BY total_spent DESC, username ASC;

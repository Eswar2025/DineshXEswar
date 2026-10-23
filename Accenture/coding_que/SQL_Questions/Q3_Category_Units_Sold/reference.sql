SELECT c.NAME AS category_name,
       COALESCE(SUM(oi.QUANTITY), 0) AS units_sold
FROM category c
LEFT JOIN product_category pc ON pc.CATEGORY_ID = c.CATEGORY_ID
LEFT JOIN order_item oi       ON oi.PRODUCT_ID = pc.PRODUCT_ID
GROUP BY c.CATEGORY_ID, c.NAME
ORDER BY units_sold DESC, category_name ASC;

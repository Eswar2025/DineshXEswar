-- SQL Bolt Lesson 6: Multi-table queries with JOINs

-- Exercise 1: Find the domestic and international sales for each movie
SELECT title, domestic_sales, international_sales
FROM movies
INNER JOIN boxoffice
    ON movies.id = boxoffice.movie_id;

-- Exercise 2: Show the sales numbers for each movie that did better internationally than domestically
SELECT title, domestic_sales, international_sales
FROM movies m
INNER JOIN boxoffice b
    ON m.id = b.movie_id
WHERE b.international_sales > b.domestic_sales;

-- Exercise 3: List all the movies by their ratings in descending order
SELECT title FROM movies m
INNER JOIN boxoffice b
    ON m.id = b.movie_id
ORDER BY b.rating DESC;

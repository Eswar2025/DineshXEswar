-- SQL Bolt Lesson 7: OUTER JOINs
-- Tables: Buildings(Building_name, Capacity), Employees(Role, Name, Building, Years_employed)
-- Only LEFT JOIN is supported in the SQL Bolt exercise.

-- To understand the joins properly, test out this command first.
-- LEFT JOIN keeps EVERY row of the left table (buildings), even when no employee matches.
-- For such buildings the employee columns come back as NULL (empty spaces).
SELECT *
FROM buildings
LEFT JOIN employees
    ON buildings.building_name = employees.building;

-- You will be able to see the empty spaces (NULLs) and understand everything in detail.


-- Q1: Find the list of all buildings that have employees
-- LEFT JOIN returns every building, so the WHERE filter removes the ones with no employee (NULL).
-- DISTINCT is needed because a building with many employees appears once per employee.
SELECT DISTINCT building_name
FROM Buildings
LEFT JOIN Employees e
    ON e.building = building_name
WHERE e.building IS NOT NULL;

-- Better approach: since we only want buildings that have a match, an INNER JOIN says it more directly.
-- SELECT DISTINCT building_name
-- FROM buildings
-- INNER JOIN employees
--     ON building_name = building;


-- Q2: Find the list of all buildings and their capacity
-- No join needed: all buildings are already in the Buildings table, empty ones included.
SELECT *
FROM buildings;

    -- Extra practice: if asked "Find the total number of employees in each building, including empty buildings".
    -- LEFT JOIN keeps empty buildings, and COUNT(column) ignores NULLs, so empty buildings give 0.
    SELECT building_name, COUNT(Years_employed)
    FROM buildings
    LEFT JOIN Employees
        ON building_name = Building
    GROUP BY building_name;
    -- Better approach: count a column that can never be NULL for a real employee, such as Name.
    -- COUNT(Years_employed) would undercount any employee whose Years_employed is NULL.
    -- SELECT building_name, COUNT(Name) ...


-- Q3: List all buildings and the distinct employee roles in each building (including empty buildings)
-- LEFT JOIN keeps empty buildings (their role is NULL).
-- DISTINCT gives each building/role pair only once.
SELECT DISTINCT building_name, role
FROM buildings
LEFT JOIN employees
    ON buildings.building_name = employees.building;
-- WHERE role IS NOT NULL; (add this if asked to "exclude empty buildings")

-- SQL Bolt Lesson 8: A short note on NULLs
-- Tables: Buildings(Building_name, Capacity), Employees(Role, Name, Building, Years_employed)
-- Remember: NULL means "no value", so it is checked with IS NULL / IS NOT NULL, never with = NULL.


-- Q1: Find the name and role of all employees who have not been assigned to a building
-- LEFT JOIN keeps every employee. If the employee has no building, no Buildings row matches,
-- so b.capacity comes back as NULL and the WHERE keeps only those employees.
SELECT name, role FROM Employees e
LEFT JOIN Buildings b
    ON b.building_name = e.building
WHERE b.capacity IS NULL;
-- Better approach: check the column that is actually missing, e.building. It also needs no join at all:
-- SELECT name, role FROM Employees WHERE building IS NULL;


-- Q2: Find the names of the buildings that hold no employees
-- LEFT JOIN keeps every building. A building with no employees has no matching Employees row,
-- so the employee column (Building) is NULL, and the WHERE keeps only those buildings.
SELECT building_name FROM Buildings b
LEFT JOIN Employees e
    ON b.building_name = e.building
WHERE Building IS NULL;
-- Better approach: write e.building instead of Building so it is clear which table the column comes from.

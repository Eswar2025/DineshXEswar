/*
  Q6 - Employees who earn more than their manager   [MEDIUM]
  Schema: see schema.svg (this question has its own schema, in this folder)

  Write an SQL query to display the employees whose SALARY is strictly greater
  than the SALARY of their direct manager (MANAGER_ID refers to EMP_ID of the
  same table). The top boss has no manager and must not appear.

  Full names are FIRST_NAME, a space, then LAST_NAME  (SQLite: use ||).

  Your output should contain 3 columns in the below-mentioned order:
      employee_name, manager_name, salary_difference
  where salary_difference = employee salary - manager salary.

  Sort by salary_difference in descending order, then by employee_name in
  ascending order.

  Run:  python check.py Q6   (from the SQL_Questions folder)
*/

-- write your query here

SELECT e.FIRST_NAME || ' ' || e.LAST_NAME AS employee_name,
       m.FIRST_NAME || ' ' || m.LAST_NAME AS manager_name,
       e.SALARY - m.SALARY AS salary_difference
FROM employee e
JOIN employee m ON m.EMP_ID = e.MANAGER_ID
WHERE e.SALARY > m.SALARY
ORDER BY salary_difference DESC, employee_name ASC;

SELECT Name as employee_name, mName as manager_name, salaryDiff
FROM employee e1
JOIN employee e2 ON e1.emp_id = e2.manager_id
WHERE e1.salary > e2.salary
ORDER BY salary_difference DESC, employee_name ASC;

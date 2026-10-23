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

select (e1.FIRST_NAME || ' ' || e1.LAST_NAME) as employee_name,
 (e2.FIRST_NAME || ' ' || e2.LAST_NAME) as manager_name, 
(e1.salary - e2.salary) as salary_difference
from employee e1
left join employee e2 on e1.MANAGER_ID = e2.EMP_ID
where e1.salary > e2.salary
order by salary_difference desc, employee_name asc ;
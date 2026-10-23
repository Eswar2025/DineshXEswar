SELECT e.FIRST_NAME || ' ' || e.LAST_NAME AS employee_name,
       m.FIRST_NAME || ' ' || m.LAST_NAME AS manager_name,
       e.SALARY - m.SALARY AS salary_difference
FROM employee e
JOIN employee m ON m.EMP_ID = e.MANAGER_ID
WHERE e.SALARY > m.SALARY
ORDER BY salary_difference DESC, employee_name ASC;

-- Basic JOIN template
-- SELECT <columns>
-- FROM <left_table>
-- JOIN <right_table>
-- ON <left_table>.<column> = <right_table>.<column>;

-- Join to view all roles
SELECT role.id, role.title, department.name as department, role.salary
FROM role
JOIN department 
ON role.department_id = department.id;

-- Join to view all employees with self-join
SELECT e.id, e.first_name, e.last_name, role.title, department.name as department, role.salary, concat(m.first_name, " ", m.last_name) as manager
FROM employee AS e
JOIN role ON e.role_id = role.id
JOIN department ON role.department_id = department.id
left JOIN employee AS m ON e.manager_id = m.id;

-- view all employees w/ names
SELECT concat(e.first_name, " ", e.last_name) as employees
FROM employee AS e
left JOIN employee AS m ON e.manager_id = m.id;


-- update role_id in the employee table
UPDATE employee
-- SET: column to update and the new value
SET role_id = 3
-- WHERE: which rows to be updated
WHERE id = 1;


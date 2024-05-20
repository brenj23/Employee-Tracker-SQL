INSERT INTO department (name) VALUES ('Engineering'), ('Finance'), ('Human Resources');

INSERT INTO role (title, salary, department_id) VALUES
    ('Software Engineer', 80000, 1),
    ('Accountant', 65000, 2),
    ('HR Representative', 55000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ('Bren', 'Broussard', 1, NULL),
    ('Selina', 'Broussard', 2, 1),
    ('Jane', 'Doe', 3, NULL)
const inquirer = require('inquirer');
const client = require('./db/connection')

async function viewAllDepartments() {
    const res = await client.query('SELECT * FROM department');
    console.table(res.rows);
}

async function viewAllRoles() {
    const res = await client.query(
        `SELECT role.id, role.title, role.salary, department.name AS department
        FROM role
        JOIN department ON role.department_id = department.id`
      );
      console.table(res.rows);
}

async function viewAllEmployees() {
    const res = await client.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id`
    );
  console.table(res.rows);
}
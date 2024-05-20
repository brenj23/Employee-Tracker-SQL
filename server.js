const inquirer = require("inquirer");
const client = require("./connection");

async function viewAllDepartments() {
  const res = await client.query("SELECT * FROM department");
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

async function addDepartment() {
  const answers = await inquirer.prompt([
    { type: "input", name: "name", message: "Enter name of the department:" },
  ]);
  await client.query(`INSERT INTO department (name) VALUES ('${answers.name}')`);
  console.log(`Added department ${answers.name}`);
}

async function addRole() {
  const departments = await client.query("SELECT * FROM department");
  const answers = await inquirer.prompt([
    { type: "input", name: "title", message: "Enter title of role:" },
    { type: "input", name: "salary", message: "Enter the salary of the role:" },
    {
      type: "list",
      name: "department_id",
      message: "Select the department for this role:",
      choices: departments.rows.map((dept) => ({
        name: dept.name,
        value: dept.id,
      })),
    },
  ]);
  await client.query(
    "INSERT INTO role(title, salary, department_id) VALUES ($1,$2,$3)",
    [answers.title, answers.salary, answers.department_id]
  );
  console.log(`Added role ${answers.title}`);
}

async function addEmployee() {
  const roles = await client.query("SELECT * FROM role");
  const employees = await client.query("SELECT * FROM employee");
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "Enter the first name of the employee:",
    },
    {
      type: "input",
      name: "last_name",
      message: "Enter the last name of the employee:",
    },
    {
      type: "list",
      name: "role_id",
      message: "Select the role for this employee:",
      choices: roles.rows.map((role) => ({ name: role.title, value: role.id })),
    },
    {
      type: "list",
      name: "manager_id",
      message: "Select the manager for this employee (if any):",
      choices: [
        { name: "None", value: null },
        ...employees.rows.map((emp) => ({
          name: `${emp.first_name} ${emp.last_name}`,
          value: emp.id,
        }))],
    }
  ]);
  await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]);
  console.log(`Added employee ${answers.first_name} ${answers.last_name}`);
}

async function updateEmployeeRole() {
    const employees = await client.query('SELECT * FROM employee');
    const roles = await client.query('SELECT * FROM role');
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Select the employee to update:',
        choices: employees.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the new role for this employee:',
        choices: roles.rows.map(role => ({ name: role.title, value: role.id }))
      }
    ]);
    await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.role_id, answers.employee_id]);
    console.log('Updated employee role');
  }
  
  async function mainMenu() {
    const choices = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add Department',
            'Add Role',
            'Add Employee',
            'Update Employee Role',
            'Exit'
          ]
        }
      ]);
    
      switch (choices.action) {
        case 'View All Departments':
          await viewAllDepartments();
          break;
        case 'View All Roles':
          await viewAllRoles();
          break;
        case 'View All Employees':
          await viewAllEmployees();
          break;
        case 'Add Department':
          await addDepartment();
          break;
        case 'Add Role':
          await addRole();
          break;
        case 'Add Employee':
          await addEmployee();
          break;
        case 'Update Employee Role':
          await updateEmployeeRole();
          break;
        case 'Exit':
          client.end();
          return;
      }
    
      mainMenu();
    }
    
    mainMenu();
  
  
  
  
  
  
  
  
  

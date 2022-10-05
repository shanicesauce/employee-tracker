//for inquirer path 
const inquirer = require('inquirer');
const db = require('../../db/connection');
const cTable = require('console.table');

inquirer 
.prompt([
    {
         type: 'list',
         name: 'options',
         message: 'What would you like to do?',
         choices: [
            "View All Employees",
            "Add Employee",
            "Update Employee Role",
            "View All Roles",
            "Add Role",
            "View All Departments",
            "Add Department"
        ]
    } 
])
.then(answers => {
    const chosenOption = answers.options;
    if(chosenOption === "View All Employees"){
        allEmployees()
    };
})

const allEmployees = () => {
    const sql = `SELECT employees.id, 
    employees.first_name, 
    employees.last_name,
    roles.title AS title,
    roles.salary AS salary,
    departments.name AS department,
    CONCAT (manager.first_name, " ", manager.last_name) AS Manager 
    FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees manager ON employees.manager_id = manager.id;`

    db.query(sql, (err, rows) => {
        if (err){
            res.status(500).json({ error: err.message });
            return;
        }
        cTable(rows)
    })
}
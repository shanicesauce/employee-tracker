//for inquirer path 
const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

// console.log(db);

const optionsArray = () => {
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
            if (chosenOption === "View All Employees") {
                allEmployees();
            }
            if (chosenOption === "Add Employee") {
                addEmployee();
            }
            if (chosenOption === "Update Employee Role") {
                updateEmployee();
            }
            if (chosenOption === "View All Roles") {
                allRoles();
            }
            if (chosenOption === 'Add Role') {
                addRole();
            }
            if (chosenOption === "View All Departments") {
                allDepartments();
            }
            if (chosenOption === 'Add Department') {
                addDepartment();
            }
        })
};

const allDepartments = () => {
    // return db.query(
    //     `SELECT * FROM departments;`)
    // 
    const sql = `SELECT * FROM departments;`

    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        console.table(rows);
        return optionsArray()
    })

};

const addDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the department?'
            }
        ])
        .then(answers => {
            const sql = `INSERT INTO departments (name)
    VALUE (?)`
            const params = answers.name

            db.query(sql, params, (err) => {
                if (err) {
                    console.log(err);
                }
                allDepartments()

            })
        })

};


const allRoles = () => {
    const sql = `SELECT roles.id, roles.title, roles.salary, departments.name AS department 
    FROM roles 
    LEFT JOIN departments 
    ON roles.department_id = departments.id;`

    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        console.table(rows);
        optionsArray()
    })
};

const addRole = () => {
    //prompt fo name and salary
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the title of this Role?'
            },
            {
                type: 'number',
                name: 'salary',
                message: 'What is the salary of this role?'
            },
        ])
        .then(answers => {
            //hold title and salary in array
            const params = [answers.title, answers.salary]
            const sql = `SELECT * FROM departments`

            db.query(sql, (err, rows) => {
                if (err) {
                    console.log(err);
                }
                //deconstruct name and id from * departments 
                const departments = rows.map(({ name, id }) => ({ name: name, value: id }))

                inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'department',
                            message: 'What department does this role belong to?',
                            // choices: ['Sales','Engineering','Finance','Legal']
                            choices: departments
                        }
                    ])
                    .then(depAnswer => {
                        const department = depAnswer.department;
                        params.push(department);

                        const sql = `INSERT INTO roles (title,salary, department_id)
            VALUES (?,?,?);`

                        db.query(sql, params, (err) => {
                            if (err) {
                                console.log(err);
                            }
                            allRoles();
                        })
                    })
            })
        })

};


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
        if (err) {
            console.log(err);
        }
        console.table(rows);
        optionsArray();
    })
};


const addEmployee = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'What is the first name of this Employee?'
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'What is the last name of this Employee?'
            },
        ])
        .then(name => {
            const params = [name.firstName, name.lastName]
            const sql = `SELECT * FROM roles`

            db.query(sql, (err, rows) => {
                if (err) {
                    console.log(err);
                }
                const roles = rows.map(({ title, id }) => ({ name: title, value: id }))
                inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'roles',
                            message: 'What Role does this employee belong to?',
                            choices: roles
                        }
                    ])
                    .then(roleAnswer => {
                        const role = roleAnswer.roles;
                        params.push(role);

                        const sql = `SELECT * FROM employees`

                        db.query(sql, (err, rows) => {
                            if (err) {
                                console.log(err);
                            }
                            const manager = rows.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id }));
                            manager.push({ name: 'No Manager', value: null });
                            inquirer
                                .prompt([
                                    {
                                        type: 'list',
                                        name: 'manager',
                                        message: 'Who is this employees manager?',
                                        choices: manager
                                    }
                                ])
                                .then(managerAns => {
                                    const manager = managerAns.manager;
                                    params.push(manager);
                                    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                                    VALUES (?, ?, ?, ?)`

                                    db.query(sql, params, (err) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                        allEmployees();
                                    })
                                })
                        })
                    })

            })

        })
};

const updateEmployee = () => {

}

optionsArray();

const mysql = require("mysql2");
const inquirer = require("inquirer");
const figlet = require("figlet");
const cTable = require("console.table");

// create the connection to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`)
);

const init = () => {
  new Promise((resolve, reject) => {
    figlet("Employee Tracker", function (err, data) {
      if (err) {
        reject(err);
        return;
      }
      console.log(data);
      resolve();
    });
  })
    .catch(() => {
      console.log("Welcome to the Employee Tracker");
    })
    .then(() => {
      menu();
    });
};

const menu = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "userOptions",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
      },
    ])
    .then((data) => {
      let option = data.userOptions;

      if (option === "View all departments") {
        db.promise()
          .query("SELECT * FROM department")
          .then(([rows, fields]) => {
            const table = cTable.getTable(rows);
            console.log(table);

            menu();
          });
      } else if (option === "View all roles") {
        db.promise()
          .query(
            "SELECT role.id, role.title, department.name as department, role.salary FROM role JOIN department ON role.department_id = department.id"
          )
          .then(([rows, fields]) => {
            const table = cTable.getTable(rows);
            console.log(table);

            menu();
          });
      } else if (option === "View all employees") {
        db.promise()
          .query(
            'SELECT e.id, e.first_name, e.last_name, role.title, department.name as department, role.salary, concat(m.first_name, " ", m.last_name) as manager FROM employee AS e JOIN role ON e.role_id = role.id JOIN department ON role.department_id = department.id left JOIN employee AS m ON e.manager_id = m.id'
          )
          .then(([rows, fields]) => {
            const table = cTable.getTable(rows);
            console.log(table);

            menu();
          });
      } else if (option === "Add a department") {
        addDepartment();
      } else if (option === "Add a role") {
        addRole();
      } else if (option === "Add an employee") {
        addEmployee();
      } else if (option === "Update an employee role") {
        updateEmployee();
      }
    });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the department?",
        name: "departmentName",
      },
    ])
    .then((data) => {
      const deptName = data.departmentName;
      db.promise()
        .query("INSERT INTO department (name) VALUES (?)", deptName)
        .then(([rows, fields]) => {
          console.log(`Added ${deptName} to the database`);
          menu();
        });
    });
};

const addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the role?",
        name: "roleName",
      },
      {
        type: "input",
        message: "What is the salary of the role?",
        name: "roleSalary",
      },
    ])
    .then((value) => {
      const sql = `SELECT name FROM department`;

      choices(sql).then((data) => {
        inquirer
          .prompt([
            {
              type: "list",
              message: "Which department does the role belong to?",
              name: "roleInDepartment",
              choices: data,
            },
          ])
          .then((result) => {
            const title = value.roleName;
            const salary = value.roleSalary;
            const departmentName = result.roleInDepartment;

            db.query(
              "SELECT id FROM department WHERE name = ?",
              departmentName,
              function (err, results) {
                db.promise()
                  .query(
                    "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
                    [title, salary, results[0].id]
                  )
                  .then(([rows, fields]) => {
                    console.log(`Added ${title} to the database`);
                    menu();
                  })
                  .catch(console.log);
              }
            );
          });
      });
    });
};

const choices = (sql) => {
  return db
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      const choiceArray = [];
      for (i = 0; i < rows.length; i++) {
        const newArray = choiceArray.push(rows[i].name);
      }

      return choiceArray;
    });
};

const roleList = (sql) => {
  return db
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      const choiceArray = [];
      for (i = 0; i < rows.length; i++) {
        const newArray = choiceArray.push(rows[i].title);
      }

      return choiceArray;
    });
};

const employeeList = (choiceArray) => {
  return db
    .promise()
    .query(
      'SELECT concat(e.first_name, " ", e.last_name) as employees FROM employee AS e left JOIN employee AS m ON e.manager_id = m.id'
    )
    .then(([rows, fields]) => {
      for (i = 0; i < rows.length; i++) {
        const newArray = choiceArray.push(rows[i].employees);
      }

      return choiceArray;
    });
};

const addEmployee = () => {
  const sql = `SELECT title FROM role`;

  roleList(sql)
    .then((data) => {
      return data;
    })
    .then((results) => {
      return inquirer.prompt([
        {
          type: "input",
          message: "What is the employee's first name?",
          name: "firstName",
        },
        {
          type: "input",
          message: "What is the employee's last name?",
          name: "lastName",
        },
        {
          type: "list",
          message: "What is the employee's role?",
          name: "roleChoices",
          choices: results,
        },
      ]);
    })
    .then((data) => {
      const choiceArray = ["NULL"];
      employeeList(choiceArray).then((results) => {
        inquirer
          .prompt([
            {
              type: "list",
              message: "who is the employee's manager?",
              name: "roleOptions",
              choices: results,
            },
          ])
          .then((value) => {
            const firstName = data.firstName;
            const lastName = data.lastName;
            const roleTitle = data.roleOptions;

            db.query(
              "SELECT id FROM role WHERE title = ?",
              roleTitle,
              function (err, results) {
                const roleId = results[0].id;

                const employeeFN = value.roleOptions.split(" ")[0];
                const employeeLN = value.roleOptions.split(" ")[1];

                db.query(
                  "SELECT id FROM employee WHERE first_name = ? AND last_name =?",
                  [employeeFN, employeeLN],
                  function (err, outcomes) {
                    if (!outcomes[0]) {
                      db.promise()
                        .query(
                          "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, NULL)",
                          [firstName, lastName, roleId]
                        )
                        .then(([rows, fields]) => {
                          console.log(
                            `Added ${firstName} ${lastName} to the database`
                          );

                          // show the main menu again
                          menu();
                        })
                        .catch(console.log);
                    } else {
                      const managerId = outcomes[0].id;

                      db.promise()
                        .query(
                          "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
                          [firstName, lastName, roleId, managerId]
                        )
                        .then(([rows, fields]) => {
                          console.log(
                            `Added ${firstName} ${lastName} to the database`
                          );

                          menu();
                        })
                        .catch(console.log);
                    }
                  }
                );
              }
            );
          });
      });
    });
};

const updateEmployee = () => {
  const choiceArray = [];
  employeeList(choiceArray)
    .then((results) => {
      return results;
    })
    .then((outcomes) => {
      return inquirer.prompt([
        {
          type: "list",
          message: "Which employee's role do you want to update?",
          name: "employeeToUpdate",
          choices: outcomes,
        },
      ]);
    })
    .then((results) => {
      const sql = `SELECT title FROM role`;
      roleList(sql).then((data) => {
        inquirer
          .prompt([
            {
              type: "list",
              message:
                "Which role do you want to assign the selected employee?",
              name: "roleToUpdate",
              choices: data,
            },
          ])
          .then((outcomes) => {
            empName = results.employeeToUpdate;
            employeeFN = results.employeeToUpdate.split(" ")[0];
            employeeLN = results.employeeToUpdate.split(" ")[1];
            roleTitle = outcomes.roleToUpdate;

            db.query(
              "SELECT id FROM role WHERE title = ?",
              roleTitle,
              function (err, dbRoleId) {
                empRoleId = dbRoleId[0].id;

                db.query(
                  "SELECT id FROM employee WHERE first_name = ? AND last_name = ?",
                  [employeeFN, employeeLN],
                  function (err, dbId) {
                    empId = dbId[0].id;

                    db.promise()
                      .query("UPDATE employee SET role_id = ? WHERE id = ?", [
                        empRoleId,
                        empId,
                      ])
                      .then(([rows, fields]) => {
                        console.log(
                          `Updated ${empName}'s role in the database`
                        );
                        menu();
                      })
                      .catch(console.log);
                  }
                );
              }
            );
          });
      });
    });
};

init();

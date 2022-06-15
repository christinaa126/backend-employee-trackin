# backend-employee-trackin

## Description

Backend Employee Trackin is a command-line content management systems (CMS) that uses Node.js, Inquirer, and MySQL to view and edit an employee database.

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Technology](#technology)
- [Assets](#assets)

## Installation

- Clone the Repo for this application
- Install [MySQL](https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/) in your local machine if you do not have one yet
- Open the terminal in the directory where the Repo has been cloned to
- Create .gitignore file which includes `node_modules` and `.DS_Store` (for macOS) before installing any npm dependencies
- Enter the following commands in terminal:
  - `npm init -y`
  - `nmp i inquirer`
  - `npm i mysql2`
    - In order to run mysql, make sure to install it in your local machine and create your own root password
  - `npm i console.table`
  - `npm i figlet`

## Usage

    - To start MySQL: enter `mysql.server start` in your terminal

- Enter the following commands in terminal to pre-populate the database:
  - `mysql -u root -p`
    - enter your root password if there is one
    - please go to `index.js` file and replace your own password in line 14 for creating connect to the database
  - `source db/schema.sql;`
  - `source db/seed.sql;`
  - `quit;` - to quit MySQL
- To start the application:
  - `node index.js`
- Answer the prompts/questions that displayed in your terminal
  - Select any action you would like to take from the listed options:
    - view all departments;
    - view all roles;
    - view all employees;
    - add a department;
    - add a role;
    - add an employee; and
    - update an employee role
- Press `Control+C` anytime in your terminal to stop the app

## Technology

```
JavaScript
Node.js
MySQL
NPM Inquirer
NPM Figlet
NPM Console.Table
```

## Assets

[link to video](https://drive.google.com/file/d/1S-L7Qe-Omh77qd_JxDaIu-9EuTPaaII8/view)

![screenshot of app](assets/images/Screen%20Shot%202022-06-14%20at%206.18.27%20PM.png)

The Employee Tracker with tables:

![screenshot of app2](assets/images/Screen%20Shot%202022-06-14%20at%206.18.43%20PM.png)

#

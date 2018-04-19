const mysql = require('mysql');
//const faker = require('faker');
const inquirer = require('inquirer');
const Table = require('cli-table');
const chalk = require('chalk');
//const seedsTable = require('./bamazonCustomer');

const questSuper = () => {
    inquirer.prompt([{
        message: 'What would you like to do?',
        type: 'list',
        name: 'supervisorAction',
        choices: [
            'View Product Sales by Department',
            'Create New Department',
        ],
    }, ]).then((answer) => {
        switch (answer.supervisorAction) {
            case 'View Product Sales by Department':
                viewSalesByDept();
                break;
            case 'Create New Department':
                createNewDept();
                break;

            default:
                break;
        }
    })
};
const viewSalesByDept = () => {
    const query = "SELECT departProd.department_id, departProd.department_name, departProd.over_head_costs, SUM(departProd.product_sales) as product_sales, (SUM(departProd.product_sales) - departProd.over_head_costs) as total_profit FROM (SELECT departments.department_id, departments.department_name, departments.over_head_costs, IFNULL(products.product_sales, 0) as product_sales FROM products RIGHT JOIN departments ON products.department_name = departments.department_name) as departProd GROUP BY department_id"
    connection.query(query, (err, res) => {
        if (err) throw error;
        let table = new Table({
            head: ["Dep ID", "Dep Name", "Overhead Costs", "Product sales", "Total Profit"],
            colWidth: [6, 30, 10, 15, 15]
        });
        res.forEach(element => {
            table.push([
                element.department_id,
                element.department_name,
                element.over_head_costs,
                element.product_sales || 0,
                element.total_profit || (-element.over_head_costs),
            ]);

        });
        console.log(chalk.blue(table.toString()));
        contin();
    })
};
const createNewDept = () => {
    inquirer.prompt([{
            message: "Please type in the name of the department you would like to add.",
            type: "input",
            name: "deptName"
        },
        {
            message: "what is the overhead for this department?",
            type: "input",
            name: "overHeadCost",
            validate: (val) => {
                return val > 0;
            }
        }
    ]).then((answer) => {
        const query = 'INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)';
        connection.query(query, [answer.deptName, parseInt(answer.overHeadCost)], (err, res) => {
            if (err) throw err;
            console.log(chalk.green('Department added!!!'));
            contin();
        });
    })
}
const contin = () => {
    console.log('\n');
    inquirer
        .prompt([{
            type: 'confirm',
            message: 'Continue?',
            name: 'continue',
        }, ])
        .then(answer => {
            if (answer.continue) {
                questSuper();
                return;
            } else {
                end();
            }
        });
};
const end = () => {
    connection.end();
    console.log(chalk.yellow('Bye'));
};
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'bamazon',
});
questSuper();
//seedsTable.seedsTable();
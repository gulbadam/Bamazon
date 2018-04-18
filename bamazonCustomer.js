const mysql = require('mysql');
const faker = require('faker');
const inquirer = require('inquirer');
const Table = require('cli-table');
const chalk = require('chalk');
let totalQuantity = 10;
let totalPrice = 0;
const seedsTable = () => {
    const data = [];
    const depData = [];
    const uniqDep = [];
    const dataDep = [];

    for (let i = 0; i < 100; i++) {
        depData.push(faker.commerce.department())
    }
    let uniq = depData.filter((elem, index, self) => { return index === self.indexOf(elem) });
    for (var i = 0; i < 10; i++) {
        data.push([
            faker.commerce.productName(),
            faker.commerce.department(),
            faker.finance.amount(1, 100, 2),
            faker.random.number({ min: 1, max: 10 }),
        ]);
    }
    for (let i = 0; i < uniq.length; i++) {
        dataDep.push([uniq[i], faker.random.number({ min: 10000, max: 50000 })])
    }
    const q =
        'INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?';
    const qd = 'INSERT INTO departments(department_name, over_head_costs) VALUE ?';
    connection.query(q, [data], (err, res) => {
        console.log(err);
        connection.query(qd, [dataDep], (err, res) => {
            console.log(err);
        })
    });
};

const showTable = () => {
    const table = new Table({
        head: ['ID', 'Name', ' Department', 'Price', 'Quantity'],
        colWidths: [6, 30, 20, 10, 10],
    });
    connection.query('SELECT * FROM products', (err, res) => {
        if (err) throw err;
        res.forEach(element => {
            table.push([element.item_id,
                element.product_name,
                element.department_name,
                element.price,
                element.stock_quantity
            ]);
        });
        console.log(chalk.blue(table.toString()));

        askCustomer();

    });
};
const lastID = () => {
    connection.query('SELECT MAX(item_id) AS item_id FROM products', (err, res) => {
        if (err) throw err;
        let str = JSON.stringify(res);
        let maxQuant = JSON.parse(str);
        //console.log(maxQuant[0].item_id);
        totalQuantity = maxQuant[0].item_id;


    })
}
const askCustomer = () => {
    inquirer
        .prompt([{
            message: 'Please type in the product id you would like to order. [Quit with Q]',
            type: 'input',
            name: 'prodId',
            validate: (value) => {
                var regEx = new RegExp('^([0-9]|Q)+$');

                return regEx.test(value);
            }
        }]).then(answer => {
            let prodId = answer.prodId;
            if (answer.prodId.toUpperCase() == "Q") {
                process.exit();

            } else if (prodId > totalQuantity) {
                console.log(chalk.green.bgRed.bold("Wrong item ID!!!"));
                contin();
            } else {
                inquirer.prompt([{
                    message: 'How many of this item would you like to purchase',
                    type: 'input',
                    name: 'prodQty',
                    validate: (value) => {
                        var regEx = new RegExp('^([0-9])+$');
                        return regEx.test(value);
                    }
                }]).then(answer => {
                    let prodQty = answer.prodQty;
                    withdrawProd(prodId, prodQty);

                })
            }
        });
};
const contin = () => {
    console.log('\n');
    inquirer.prompt([{
        type: "confirm",
        message: "Continue?",
        name: "continue"
    }]).then((answer) => {
        if (answer.continue) {
            askCustomer();
            return;
        } else {
            end();
        }
    })
}
const withdrawProd = (prodId, prodQty) => {
    //console.log(prodId, prodQty);
    connection.query('SELECT * FROM products', (err, res) => {
        if (err) throw err;
        let prod;
        for (let i = 0; i < res.length; i++) {
            if (res[i].item_id == prodId) {
                prod = res[i]
            }

        }
        totalPrice = parseFloat(prodQty * JSON.stringify(prod.price)).toFixed(2);

        console.log(chalk.white("\n================================================" + "\n"));

        console.log(chalk.cyan("Product Name:  " + JSON.stringify(prod.product_name)));
        console.log(chalk.cyan("Price:         " + "$" + JSON.stringify(prod.price)));
        console.log(chalk.cyan("Quantity:      " + prodQty));
        console.log(chalk.white("_____________________________"));
        console.log(chalk.cyan("Your total is: " + "$" + totalPrice));
        console.log(chalk.white("\n================================================" + "\n"));




        if (prod.stock_quantity >= prodQty) {
            orderComplete(prod, prodId, prodQty, totalPrice);
            //connection.end();

        } else {
            console.log(chalk.green.bgRed.bold("Insufficient quantity!!!"));
            contin();
        }

    })
};
const orderComplete = (prodObj, prodId, prodQty, totalPrice) => {
    let = newQuantity = prodObj.stock_quantity - prodQty;
    let query = "UPDATE products SET stock_quantity = ?, product_sales = product_sales + ? where ?";
    connection.query(query, [newQuantity, totalPrice, { item_id: prodId }], (err, res) => {})



    console.log(chalk.cyan("Your order is complete!!!"));

    contin();


};
const end = () => {
    connection.end();
    console.log(chalk.yellow("Bye"));
}

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'bamazon',
});


seedsTable();
lastID();
showTable();
module.exports.seedsTable = seedsTable;
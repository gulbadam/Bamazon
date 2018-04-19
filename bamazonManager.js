const mysql = require('mysql');
//const faker = require('faker');
const inquirer = require('inquirer');
const Table = require('cli-table');
const chalk = require('chalk');
//const seedsTable = require('./bamazonCustomer')
const showTable = () => {
    const table = new Table({
        head: ['ID', 'Name', ' Department', 'Price', 'Quantity'],
        colWidths: [6, 30, 20, 10, 10],
    });
    connection.query('SELECT * FROM products', (err, res) => {
        if (err) throw err;
        res.forEach(element => {
            table.push([
                element.item_id,
                element.product_name,
                element.department_name,
                element.price,
                element.stock_quantity,
            ]);
        });
        console.log(chalk.blue(table.toString()));
        contin();
    });
};

const viewLowInventory = () => {
    const table = new Table({
        head: ['ID', 'Name', ' Department', 'Price', 'Quantity'],
        colWidths: [6, 30, 20, 10, 10],
    });
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', (err, res) => {
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
        contin();

    });
};
const selectInventory = (prodId, prodQty) => {
    //viewProducts(prodId, prodQty);
    inquirer.prompt([{
            message: 'Please type in the id of the product you would like to add inventory to.',
            type: 'input',
            name: 'prodId',
        },
        {
            message: "what is the quantity you are adding to this item's stock.",
            type: 'input',
            name: 'prodQty',
        },
    ]).then((answer) => {
        connection.query('SELECT * FROM products', (err, res) => {
            if (err) throw err;
            let prod;
            for (let i = 0; i < res.length; i++) {
                if (res[i].item_id == answer.prodId) {
                    prod = res[i]
                }

            }
            console.log("Product was found")
            if (prod !== undefined) {
                addToInventory(prod, answer.prodId, parseInt(answer.prodQty))
                console.log("Added to stock");
                contin();
            } else {
                console.log("sorry that item doesn't exist");
                contin();
            }

        })
    })


};
const addToInventory = (prodObj, prodId, prodQty) => {
    let newQuantity = prodObj.stock_quantity + prodQty
    const query = 'UPDATE products SET stock_quantity = ? WHERE ?';
    connection.query(query, [newQuantity, { item_id: prodId }], (err, res) => {});

};
const addProduct = () => {
    inquirer.prompt([{
            message: "What is the name of this product?",
            type: "input",
            name: "prodName"
        },
        {
            message: "What department does this product belong to?",
            type: "input",
            name: "prodDept"
        },
        {
            message: "What is the price of this product?",
            type: "input",
            name: "prodPrice"
        },
        {
            message: "how much of this item do you have to add to stock?",
            type: "input",
            name: "prodQty"
        }
    ]).then((answer) => {
        const query = 'INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE (?, ?, ?, ?)';
        if (answer.prodName !== "" && answer.prodDept !== "" && answer.prodPrice !== "" && answer.prodQty !== "") {
            connection.query(query, [answer.prodName, answer.prodDept, answer.prodPrice, answer.prodQty], (err, res) => {

            });
            console.log("Product was added");
            contin();
        } else {
            console.log('ERROR: Product info is incomplete. Please fill all prompts with complete product info!');

        }
    })
}
const askQuest = () => {
    inquirer.prompt([{
        message: 'What would you like to do?',
        type: 'list',
        name: 'managerAction',
        choices: [
            'View Products for Sale',
            'View Low Inventory',
            'Add to Inventory',
            'Add New Product',
        ],
    }, ]).then((answer) => {
        switch (answer.managerAction) {
            case 'View Products for Sale':
                showTable();
                break;
            case 'View Low Inventory':
                viewLowInventory();
                break;
            case 'Add to Inventory':
                selectInventory();
                break;
            case 'Add New Product':
                addProduct();
                break;

            default:

                break;
        }
    })
}
const contin = () => {
    console.log('\n');
    inquirer.prompt([{
        type: "confirm",
        message: "Continue?",
        name: "continue"
    }]).then((answer) => {
        if (answer.continue) {
            askQuest();
            return;
        } else {
            end();
        }
    })
}
const end = () => {
    connection.end();
    console.log("Bye");
}

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'bamazon',
});

//seedsTable.seedsTable();
askQuest();
const mysql = require('mysql');
const faker = require('faker');

const seedsTable = () => {
    const data = [];
    const depData = [];
    const uniqDep = [];
    const dataDep = [];

    for (let i = 0; i < 100; i++) {
        depData.push(faker.commerce.department());
    }
    let uniq = depData.filter((elem, index, self) => {
        return index === self.indexOf(elem);
    });
    for (var i = 0; i < 10; i++) {
        data.push([
            faker.commerce.productName(),
            faker.commerce.department(),
            faker.finance.amount(1, 100, 2),
            faker.random.number({ min: 1, max: 10 }),
        ]);
    }
    for (let i = 0; i < uniq.length; i++) {
        dataDep.push([uniq[i], faker.random.number({ min: 10000, max: 50000 })]);
    }
    const q =
        'INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?';
    const qd =
        'INSERT INTO departments(department_name, over_head_costs) VALUE ?';
    connection.query(q, [data], (err, res) => {
        //console.log(err);
        connection.query(qd, [dataDep], (err, res) => {

        });
        connection.end();
    });
};
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'bamazon',
});



seedsTable();
DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE products(
    item_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT(10) NOT NULL,
    product_sales DECIMAL(10,2) DEFAULT 0
);
CREATE TABLE departments
(
    department_id INT
    AUTO_INCREMENT NOT NULL PRIMARY KEY,
    department_name VARCHAR
    (50) NOT NULL,
    over_head_costs DECIMAL
    (10,2) NOT NULL

);
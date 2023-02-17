//const { query } = require("express");
const { Client } = require("pg");
const { DB } = require("../config");
const dotenv = require("dotenv").config({
  path: "../.env",
});
(async () => {
  const clearUsersTable = `DELETE FROM users`;
  const clearProductsTable = `DELETE FROM products`;
  const clearOrdersTable = `DELETE FROM orders`;
  const clearCartsTable = `DELETE FROM carts`;
  const clearCartItemsTable = `DELETE FROM cart_has_products`;
  // Users whose passwords are "password"
  const seedUsersTable = `
    INSERT INTO users(user_id, fname, lname, email, password) OVERRIDING SYSTEM VALUE
    VALUES
    (1,'f1', 'l1', 'f1.l1@test.com', 'password'),
    (2,'f2', 'l2', 'f2.l2@test.com', 'password'),
    (3,'f3', 'l3', 'f3.l3@test.com', 'password')
  `;

  const seedCategoriesTable = `
    INSERT INTO categories(name) OVERRIDING SYSTEM VALUE
    VALUES 
    ('Clothes');
  `;

  const seedProductsTable = `
    INSERT INTO products(product_id, category_id, title, price, description) OVERRIDING SYSTEM VALUE
     VALUES
    (1, 1,'blue pants',  123.45,  'Description 1'),
    (2, 1,'shirt',       10.00,   'Description 2'),
    (3, 1,'black pants', 5.00,    'Description 3'),
    (4, 1,'khaki pants', 999.00, 'Description 4');
  `;

  const seedOrdersTable = `
    INSERT INTO orders(user_id, date, status)
    OVERRIDING SYSTEM VALUE
    VALUES
   (1,'1992-09-25','COMPLETE'),
   (2,'2023-01-29','PENDING')
  `;

  const seedCartsTable = `
    INSERT INTO carts(cart_id, created, modified)
    OVERRIDING SYSTEM VALUE
     VALUES
    (1,'2023-09-25','2023-09-26')
  `;

  const seedCartItemsTable = `
    INSERT INTO cart_has_products 
    OVERRIDING SYSTEM VALUE
     VALUES
    (1,1,1)
  `;
  // Client for actual ecommerce project database.
  const dbECommerceProjectTest = new Client({
    user: DB.PGUSER,
    host: DB.PGHOST,
    database: DB.PGDATABASE,
    password: DB.PGPASSWORD,
    port: DB.PGPORT,
  });
  try {
    try {
      await dbECommerceProjectTest.connect();
    } catch (error) {
      console.error(`There was an issue connecting ${DB.PGDATABASE}: ` + error);
    }
    //Clear data in tables. That way it can be used to refresh the db.
    await dbECommerceProjectTest.query(clearUsersTable);
    await dbECommerceProjectTest.query(clearProductsTable);
    await dbECommerceProjectTest.query(clearOrdersTable);
    await dbECommerceProjectTest.query(clearCartsTable);
    await dbECommerceProjectTest.query(clearCartItemsTable);

    // Seed tables on database
    await dbECommerceProjectTest.query(seedUsersTable);
    await dbECommerceProjectTest.query(seedCategoriesTable);
    await dbECommerceProjectTest.query(seedProductsTable);
    await dbECommerceProjectTest.query(seedOrdersTable);
    await dbECommerceProjectTest.query(seedCartsTable);
    await dbECommerceProjectTest.query(seedCartItemsTable);
  } catch (err) {
    console.log("ERROR SEEDING ONE OR MORE TABLES: ", err);
  } finally {
    await dbECommerceProjectTest.end();
  }
})();

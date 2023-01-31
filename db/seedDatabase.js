const { query } = require("express");
const { Client } = require("pg");
const { DB } = require("../config");
const dotenv = require("dotenv").config({
  path: "../.env",
});
(async () => {
  const clearUsersTable = `
    DELETE FROM users
    `;
  const clearProductsTable = `
    DELETE FROM products
    `;
  const clearOrdersTable = `
    DELETE FROM orders`;
  const clearCartsTable = `
    DELETE FROM carts
    `;
  const clearCartItemsTable = `
    DELETE FROM cartitems
    `;
  // Users whose passwords are "password"
  const seedUsersTable = `
    INSERT INTO users OVERRIDING SYSTEM VALUE
    VALUES
    (1,'password','f1.l1@test.com'),
    (2,'password','f2.l2@test.com'),
    (3,'password','f3.l3@test.com')
  `;

  const seedProductsTable = `
    INSERT INTO products OVERRIDING SYSTEM VALUE
     VALUES
    (1,'pants',123.45,'Description 1','Test1'),
    (2,'shirt',10.00,'Description 2','Test2'),
    (3,'pants',5.00,'Description 3','Test1'),
    (4,'pants',9999.00,'Description 1','Test2');
  `;

  const seedOrdersTable = `
    INSERT INTO orders
    OVERRIDING SYSTEM VALUE
    VALUES
   (1,'1992-09-25',2),
   (2,'2023-01-29',3)
  `;

  const seedCartsTable = `
    INSERT INTO carts
    OVERRIDING SYSTEM VALUE
     VALUES
    (1,'2023-09-25','2023-09-26')
  `;

  const seedCartItemsTable = `
    INSERT INTO cartitems OVERRIDING SYSTEM VALUE
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

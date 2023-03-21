const { Client } = require("pg");
const { DB } = require("../config");
const pgp = require("pg-promise")();
const dotenv = require("dotenv").config({
  path: "../.env",
});
console.log(dotenv);

// First clear all the tables to ensure we have a clean slate
const clearUsersTable = `DELETE FROM users`;
const clearProductsTable = `DELETE FROM products`;
const clearOrdersTable = `DELETE FROM orders`;
const clearCategoriesTable = `DELETE FROM categories`;
const clearCartsTable = `DELETE FROM carts`;
const clearCartHasProductsTable = `DELETE FROM cart_has_products`;
const clearOrderHasProductsTable = `DELETE FROM order_has_products`;
const clearDatabase = async () => {
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
    await dbECommerceProjectTest.query(clearCategoriesTable);
    await dbECommerceProjectTest.query(clearCartsTable);
    //await dbECommerceProjectTest.query(clearCartItemsTable);
  } catch (err) {
    console.log("ERROR CLEARING ONE OR MORE TABLES: ", err);
  } finally {
    await dbECommerceProjectTest.end();
  }
};

module.exports = { clearDatabase };

const { Client } = require("pg");
const { DB } = require("../config");

(async () => {
  const createDatabase = `
  CREATE DATABASE ${DB.PGDATABASE};
  `;
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS public.users (
      id               integer          PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      password         text             NOT NULL,
      email            VARCHAR(50)      NOT NULL
    );
  `;

  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS public.products (
      id               integer          PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      name             VARCHAR(100)     NOT NULL,                                   
      price            numeric          NOT NULL,
      description      VARCHAR(200),
      category         text                                       
    );
  `;

  const createOrdersTable = `
    CREATE TABLE IF NOT EXISTS public.orders (
      id               integer          PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      date             date,
      product_id       integer,
      FOREIGN KEY (product_id)
        REFERENCES products(id) 
    );
  `;

  const createCartsTable = `
    CREATE TABLE IF NOT EXISTS public.carts (
      id               integer          PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      created          date,
      modified         date                                     
    );
  `;

  const createCartItemsTable = `
      CREATE TABLE IF NOT EXISTS public.cartitems (
        id             integer          PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
        product_id     integer,
        cart_id        integer,
        FOREIGN KEY (product_id)
          REFERENCES products(id),
        FOREIGN KEY (cart_id)
          REFERENCES carts(id)
      );
  `;

  try {
    // Make a temporary client so we can create tables in the database

    const dbPostGres = new Client({
      user: DB.PGUSER,
      host: DB.PGHOST,
      database: "postgres",
      password: DB.PGPASSWORD,
      port: DB.PGPORT,
    });
    const dbECommerceProjectTest = new Client({
      user: DB.PGUSER,
      host: DB.PGHOST,
      database: DB.PGDATABASE,
      password: DB.PGPASSWORD,
      port: DB.PGPORT,
    });
    /*
    @hazeltonbw, although this secript is able to create the schema of the tables, it does not create the database itself.
    Although you are not doing anything special with the database itself, I think the script is close enough to making it 
    for contributors.
    */
    /*
   @hazeltonbw First we'll connect to postgres in order to create the database. Typically postgres is the default db in PSQL. 
   There is a chance that maybe a contributor doesn't have postgres locally. In which case it's up to the user to execute the SQL
   themselves. You may be thinking this exception might defeat the whole purpose of trying to create the DB locally.

   I agree, and I think I found some stackoverflow articles that offer a good solution, although it will require restructuring the code.I'll
   let you decide! 

   https://stackoverflow.com/questions/20813154/node-postgres-create-database

   */
    await dbPostGres.connect();
    try {
      await dbPostGres.query(createDatabase);
    } catch (error) {
      if (error.code == "42P04") {
        console.error(`${DB.PGDATABASE} already exists`);
      } else {
        console.error(error);
      }
    } finally {
      dbPostGres.end();
      console.debug(`Switching from postgres to ${DB.PGDATABASE}.`);
      await dbECommerceProjectTest.connect();
    }

    // Create tables on database
    await dbECommerceProjectTest.query(createUsersTable);
    await dbECommerceProjectTest.query(createProductsTable);
    await dbECommerceProjectTest.query(createOrdersTable);
    await dbECommerceProjectTest.query(createCartsTable);
    await dbECommerceProjectTest.query(createCartItemsTable);

    await dbECommerceProjectTest.end();
  } catch (err) {
    console.log("ERROR CREATING ONE OR MORE TABLES: ", err);
  }
})();

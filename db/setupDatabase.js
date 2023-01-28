const { Client } = require("pg");
const { DB } = require("../config");

(async () => {
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
          REFERENCES product(id),
        FOREIGN KEY (cart_id)
          REFERENCES cart(id)
      );
  `;

  try {
    // Make a temporary client so we can create tables in the database
    console.log(DB);
    const db = new Client({
      user: DB.PGUSER,
      host: DB.PGHOST,
      database: DB.PGDATABASE,
      password: DB.PGPASSWORD,
      port: DB.PGPORT,
    });

    await db.connect();

    // Create tables on database
    await db.query(createUsersTable);
    await db.query(createProductsTable);
    await db.query(createOrdersTable);
    await db.query(createCartsTable);
    await db.query(createCartItemsTable);

    await db.end();
  } catch (err) {
    console.log("ERROR CREATING ONE OR MORE TABLES: ", err);
  }
})();

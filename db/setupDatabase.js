const { Client } = require("pg");
const { DB } = require("../config");

(async () => {
  const createDatabase = `
    CREATE DATABASE ${DB.PGDATABASE};
  `;

  const createCartsTable = `
    DROP TABLE IF EXISTS public.carts CASCADE;

    CREATE TABLE IF NOT EXISTS public.carts
    (
        cart_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
        created date NOT NULL,
        modified date NOT NULL,
        PRIMARY KEY (cart_id)
    );
  `;

  const createProductsTable = `
    DROP TABLE IF EXISTS public.products CASCADE;

    CREATE TABLE IF NOT EXISTS public.products
    (
        product_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
        category_id integer NOT NULL,
        title text NOT NULL,
        price numeric(5, 2) NOT NULL,
        description text,
        PRIMARY KEY (product_id)
    );
  `;

  const createCartHasProductsTable = `
    DROP TABLE IF EXISTS public.cart_has_products CASCADE;

    CREATE TABLE IF NOT EXISTS public.cart_has_products
    (
        cart_id integer NOT NULL,
        product_id integer NOT NULL,
        qty integer NOT NULL
    );
  `;

  const createOrdersTable = `
    DROP TABLE IF EXISTS public.orders CASCADE;

    CREATE TABLE IF NOT EXISTS public.orders
    (
        order_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
        user_id integer NOT NULL,
        date date NOT NULL,
        status text NOT NULL,
        PRIMARY KEY (order_id)
    );
  `;

  const createUsersTable = `
    DROP TABLE IF EXISTS public.users CASCADE;

    CREATE TABLE IF NOT EXISTS public.users
    (
        user_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
        cart_id integer,
        fname character varying(20),
        lname character varying(20),
        email character varying(70),
        PRIMARY KEY (user_id)
    );
  `;

  const createOrderHasProductTable = `
    DROP TABLE IF EXISTS public.order_has_products CASCADE;

    CREATE TABLE IF NOT EXISTS public.order_has_products
    (
        order_id integer NOT NULL,
        product_id integer NOT NULL,
        qty integer NOT NULL
    );
  `;

  const createCategoryTable = `
    DROP TABLE IF EXISTS public.categories CASCADE;

    CREATE TABLE IF NOT EXISTS public.categories
    (
        category_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
        name text NOT NULL,
        PRIMARY KEY (category_id)
    );
  `;

  const createUserSessionsTable = `
    DROP TABLE IF EXISTS public.user_sessions CASCADE;

    CREATE TABLE IF NOT EXISTS "user_sessions" (
      "sid" varchar NOT NULL COLLATE "default",
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL
    )
    WITH (OIDS=FALSE);
  `;

  const addConstraints = `
    ALTER TABLE IF EXISTS "user_sessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

    CREATE INDEX "IDX_session_expire" ON "user_sessions" ("expire");

    ALTER TABLE IF EXISTS public.products
        ADD FOREIGN KEY (category_id)
        REFERENCES public.categories (category_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID;


    ALTER TABLE IF EXISTS public.cart_has_products
        ADD FOREIGN KEY (cart_id)
        REFERENCES public.carts (cart_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID;


    ALTER TABLE IF EXISTS public.cart_has_products
        ADD FOREIGN KEY (product_id)
        REFERENCES public.products (product_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID;


    ALTER TABLE IF EXISTS public.orders
        ADD FOREIGN KEY (user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID;


    ALTER TABLE IF EXISTS public.users
        ADD FOREIGN KEY (cart_id)
        REFERENCES public.carts (cart_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID;


    ALTER TABLE IF EXISTS public.order_has_products
        ADD FOREIGN KEY (order_id)
        REFERENCES public.orders (order_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID;


    ALTER TABLE IF EXISTS public.order_has_products
        ADD FOREIGN KEY (product_id)
        REFERENCES public.products (product_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID;
      
  `;

  try {
    // Make a temporary client to connect to postgres in order to create database.

    const dbPostGres = new Client({
      user: DB.PGUSER,
      host: DB.PGHOST,
      database: "postgres",
      password: DB.PGPASSWORD,
      port: DB.PGPORT,
    });
    // Client for actual ecommerce project database.
    const dbECommerceProjectTest = new Client({
      user: DB.PGUSER,
      host: DB.PGHOST,
      database: DB.PGDATABASE,
      password: DB.PGPASSWORD,
      port: DB.PGPORT,
    });
    /*
    @hazeltonbw, although this script is able to create the schema of the tables, it does not create the database itself.
    You are not doing anything special with the database itself, I think the script is close enough to making it 
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

    try {
      await dbPostGres.connect();
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
    await dbECommerceProjectTest.query(createCartsTable);
    await dbECommerceProjectTest.query(createProductsTable);
    await dbECommerceProjectTest.query(createCartHasProductsTable);
    await dbECommerceProjectTest.query(createOrdersTable);
    await dbECommerceProjectTest.query(createUsersTable);
    await dbECommerceProjectTest.query(createOrderHasProductTable);
    await dbECommerceProjectTest.query(createCategoryTable);
    await dbECommerceProjectTest.query(createUserSessionsTable);
    await dbECommerceProjectTest.query(addConstraints);

    await dbECommerceProjectTest.end();
  } catch (err) {
    console.log("ERROR CREATING ONE OR MORE TABLES: ", err);
  }
})();

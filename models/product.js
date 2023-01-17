const pool = require("../db");
const createError = require("http-errors");

/**
 * Queries the database for all products
 * @param {Object} queryOpts Object containing `category` or `name`
 * property to filter the search result from the database.
 * @returns An array of products
 */
const getProducts = async (queryOpts) => {
  const { category, name } = queryOpts;
  if (name) {
    return await getProductsByName(name);
  } else if (category) {
    return await getProductsByCategory(category);
  }

  // If there is no query options, get all products
  const statement = "SELECT * FROM products ORDER BY id ASC";
  try {
    const result = await pool.query(statement);
    return result.rows;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Queries the database for all products that match a certain category
 * @param {String} category Category of a product
 * @returns an array of products that match a certain category
 */
const getProductsByCategory = async (category) => {
  const query = {
    text: "SELECT * FROM products WHERE category = $1 ORDER BY id ASC",
    values: [category.toLowerCase()],
  };

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Queries the database for products by name
 * @param {String} name Name of the product
 * @returns An array of products
 */
const getProductsByName = async (name) => {
  const query = {
    text:
      // ILIKE = case insensitive query
      // LIKE requires special syntax to surround with %    '%'||$1||'%'
      // https://stackoverflow.com/questions/60257510/postgres-node-search-query-using-like-how-to-set
      "SELECT * FROM products WHERE name ILIKE '%'||$1||'%' ORDER BY name ASC",
    values: [name.toLowerCase()],
  };
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Gets a product by product id
 * @param {number} id - The product id
 * @returns an object with product information
 */
const getProductById = async (id) => {
  const query = {
    text: "SELECT * FROM products WHERE id = $1",
    values: [id],
  };
  try {
    const result = await pool.query(query);
    if (result.rows?.length) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (err) {
    throw new Error(err);
  }
};

const updateProductById = async (id, data) => {
  const { name, price, description, category } = data;
  // Check if product exists first
  if (!getProductById(id)) {
    throw createError(400, `No product with id: ${id} found.`);
  }

  const query = {
    text: "UPDATE products SET name = $1, price = $2, description = $3, category = $4 WHERE id = $5 RETURNING *",
    values: [name, price, description, category, id],
  };

  try {
    const result = await pool.query(query);
    return result.rows?.length ? result.rows[0] : null;
  } catch (err) {
    throw err;
  }
};

const deleteProductById = async (id) => {
  // First check if product exists in database
  const product = getProductById(id);
  if (!product) {
    throw createError(400, `No product with id: ${id} found.`);
  }

  const query = {
    text: "DELETE FROM products WHERE id = $1",
    values: [id],
  };

  try {
    const result = await pool.query(query);
    return result.rows?.length ? result.rows[0] : null;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getProducts,
  getProductsByCategory,
  getProductById,
  getProductsByName,
  updateProductById,
  deleteProductById,
};

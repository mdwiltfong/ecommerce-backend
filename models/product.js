const pool = require("../db");

const getProducts = async () => {
  const statement = "SELECT * FROM products ORDER BY id ASC";
  try {
    const result = await pool.query(statement);
    return result.rows;
  } catch (err) {
    throw new Error(err);
  }
};

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

module.exports = {
  getProducts,
  getProductsByCategory,
  getProductById,
  getProductsByName,
};

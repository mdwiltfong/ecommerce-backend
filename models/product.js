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

const getProductById = async (id) => {
  const statement = `
      SELECT * FROM products 
      WHERE id = $1 `;
  const values = [id];

  try {
    const result = await pool.query(statement, values);
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
  getProductById,
};

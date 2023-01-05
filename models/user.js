const pool = require("../db");

const getUsers = async () => {
  try {
    const statement = `
      SELECT * FROM users 
        ORDER BY id ASC`;
    const result = await pool.query(statement);
    return result.rows;
  } catch (err) {
    throw new Error(err);
  }
};

const getUserById = async (id) => {
  const statement = `SELECT * FROM users 
      WHERE id = $1
      ORDER BY id ASC`;
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

const createUser = async () => {
  const { name, email } = req.body;
  const statement = `INSERT INTO users(name, email) 
      VALUES($1, $2) RETURNING *`;
  const values = [name, email];

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

const updateUser = async (user) => {
  try {
    const { id, username, password, email } = user;

    const statement = `UPDATE users SET username = $1, password = $2, email = $3 WHERE id = $4`;
    const values = [username, password, email, id];

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
  getUsers,
  getUserById,
  createUser,
  updateUser,
};

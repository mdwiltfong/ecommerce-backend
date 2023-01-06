const pool = require("../db");
const createError = require("http-errors");
const bcrypt = require("bcrypt");

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

const createUser = async (data) => {
  const { username, email } = data;
  const saltRounds = 10;
  const password = await bcrypt.hash(data.password, saltRounds);
  const statement = `INSERT INTO users(username, password, email) 
      VALUES($1, $2, $3) RETURNING *`;
  const values = [username, password, email];

  try {
    const result = await pool.query(statement, values);
    if (result.rows?.length) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const updateUser = async (data) => {
  const { id, username, email } = data;
  const saltRounds = 10;
  password = await bcrypt.hash(data.password, saltRounds);

  const statement = `UPDATE users SET username = $1, password = $2, email = $3 WHERE id = $4`;
  const values = [username, password, email, id];

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

const findUserByEmail = async (email) => {
  const statement = `SELECT * FROM users 
                        WHERE email = $1  
                      `;
  const values = [email];

  try {
    const result = await pool.query(statement, values);
    if (result.rows?.length) {
      return result.rows[0];
    }
    return null;
  } catch (err) {
    throw new Error(err);
  }
};

const registerNewUser = async (data) => {
  const { email } = data;
  const user = await findUserByEmail(email);
  if (user) {
    throw createError(409, `User with email: ${email} already exists!`);
  }
  return await createUser(data);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  findUserByEmail,
  registerNewUser,
};

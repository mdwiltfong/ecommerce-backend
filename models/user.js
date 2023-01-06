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
  const { email } = data;
  const saltRounds = 10;
  const password = await bcrypt.hash(data.password, saltRounds);
  const statement = `INSERT INTO users(password, email) 
      VALUES($1, $2) RETURNING *`;
  const values = [password, email];

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
  const { id, email } = data;
  const saltRounds = 10;
  password = await bcrypt.hash(data.password, saltRounds);

  const statement = `UPDATE users SET password = $1, email = $2 WHERE id = $3`;
  const values = [password, email, id];

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

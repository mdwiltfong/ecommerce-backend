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
  const hashedPassword = hashPassword(data.password);

  const statement = `INSERT INTO users(password, email) 
      VALUES($1, $2) RETURNING *`;
  const values = [hashedPassword, email];

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

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(data.password, saltRounds);
};

const updateUser = async (data) => {
  const { id, email } = data;
  const hashedPassword = hashPassword(data.password);

  const statement = `UPDATE users SET password = $1, email = $2 WHERE id = $3`;
  const values = [hashedPassword, email, id];

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

const loginUser = async (user) => {
  const { email, password } = user;
  try {
    // Check if user exists
    const user = await findUserByEmail(email);

    // If no user found, reject
    if (!user) {
      throw createError(401, "Incorrect username or password");
    }

    // Check for matching passwords
    const passwordIsValid = bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw createError(401, "Incorrect username or password");
    }

    return user;
  } catch (err) {
    throw createError(500, err);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  findUserByEmail,
  registerNewUser,
  loginUser,
};

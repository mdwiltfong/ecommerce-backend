const pool = require("../db");
const createError = require("http-errors");
const bcrypt = require("bcrypt");

const getUsers = async () => {
  const statement = "SELECT * FROM users ORDER BY id ASC";
  try {
    const result = await pool.query(statement);
    return result.rows;
  } catch (err) {
    throw new Error(err);
  }
};

const getUserById = async (id) => {
  const query = {
    text: "SELECT * FROM users WHERE id = $1",
    values: [id],
  };

  try {
    const result = await pool.query(query);
    return result.rows?.length ? result.rows[0] : null;
  } catch (err) {
    throw new Error(err);
  }
};

const createUser = async (data) => {
  const { email, password } = data;
  const hashedPassword = await hashPassword(password);

  const query = {
    text: "INSERT INTO users(password, email) VALUES($1, $2) RETURNING *",
    values: [hashedPassword, email],
  };

  try {
    const result = await pool.query(query);
    return result.rows?.length ? result.rows[0] : null;
  } catch (err) {
    throw new Error(err);
  }
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const updateUserPassword = async (data) => {
  const { id, password } = data;

  // First see if there is a user with the given id.
  try {
    const user = await getUserById(id);
    if (!user) {
      throw createError(400, `No user with id: ${id} found.`);
    }
  } catch (err) {
    throw err;
  }

  const hashedPassword = await hashPassword(password);

  const query = {
    text: "UPDATE users SET password = $1 WHERE id = $2 RETURNING *",
    values: [hashedPassword, id],
  };

  try {
    const result = await pool.query(query);
    return result.rows?.length ? result.rows[0] : null;
  } catch (err) {
    throw err;
  }
};

const findUserByEmail = async (email) => {
  const query = {
    text: "SELECT * FROM users WHERE email = $1",
    values: [email],
  };

  try {
    const result = await pool.query(query);
    return result.rows?.length ? result.rows[0] : null;
  } catch (err) {
    throw err;
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

const loginUser = async (data) => {
  const { email, password } = data;
  try {
    // Check if user exists
    const user = await findUserByEmail(email);

    // If no user found, reject
    if (!user) {
      throw createError(401, "Incorrect username or password");
    }

    // Check for matching passwords
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw createError(401, "Incorrect username or password");
    }

    return user;
  } catch (err) {
    throw err;
  }
};

const deleteUserById = async (userId) => {
  // First check if there is a user with that id
  const user = await getUserById(userId);
  if (!user) {
    throw createError(404, "No user with that id found!");
  }

  const query = {
    text: "DELETE FROM users WHERE id = $1",
    values: [userId],
  };

  try {
    const result = await pool.query(query);
    return result.rows?.length ? result.rows[0] : null;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserPassword,
  findUserByEmail,
  registerNewUser,
  loginUser,
  deleteUserById,
};

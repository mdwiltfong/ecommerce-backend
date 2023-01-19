// TODO: isLoggedIn, isAdmin
const userModel = require("../models/user");

const getUsers = async (req, res, next) => {
  try {
    const response = await userModel.getUsers();
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};
// TODO: isLoggedIn, isAdmin
const getUserById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const response = await userModel.getUserById(id);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

//TODO: isLoggedIn
const updateUserById = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const { password } = req.body;
  const user = { id, password };

  try {
    const response = await userModel.updateUserPassword(user);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

// TODO: isLoggedIn, isAdmin
const deleteUserById = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const response = await userModel.deleteUserById(userId);
    res.status(200).send({
      message: `User with userId: ${userId} deleted from database.`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};

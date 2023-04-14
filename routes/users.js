const express = require("express");
const router = express.Router();
const { isAdmin, isLoggedIn } = require("../middleware/auth");
const userController = require("../controllers/userController");

module.exports = (app) => {
  app.use("/users", router);
  router.get("/", userController.getUsers);
  router.delete("/:id", userController.deleteUserById);
  router.get("/:id", userController.getUserById);
  router.put("/:id", userController.updateUserById);
};

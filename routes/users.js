const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

module.exports = (app) => {
  app.use("/users", router);
  router.get("/", userController.getUsers);
  router.get("/:id", userController.getUserById);
  router.put("/:id", userController.updateUserById);
  router.delete("/:id", userController.deleteUserById);
};

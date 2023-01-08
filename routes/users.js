const pool = require("../db");
const express = require("express");
const router = express.Router();
const userModel = require("../models/user");

module.exports = (app) => {
  app.use("/users", router);

  router.get("/", async (req, res, next) => {
    try {
      const response = await userModel.getUsers();
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const response = await userModel.getUserById(id);
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  // Update user password in database
  router.put("/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const { password } = req.body;
      const user = { id, password };

      const response = await userModel.updateUserPassword(user);
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });
};

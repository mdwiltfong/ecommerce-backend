const pool = require("../db");
const express = require("express");
const router = express.Router();
const userModel = require("../models/user");

module.exports = (app) => {
  app.use("/users", router);

  router.get("/", async (req, res, next) => {
    try {
      const response = await userModel.getUsers();
      console.log(response);
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

  router.post("/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const { password, email } = req.body;
      const user = { id, password, email };

      const response = await userModel.updateUser(user);
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.put("/users", async (req, res, next) => {
    try {
      const { id } = req.params;
      const { password, email } = req.body;
      const user = { id, password, email };

      const response = await userModel.updateUser(user);
    } catch (err) {
      next(err);
    }
  });
};

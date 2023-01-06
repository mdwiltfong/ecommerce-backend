const express = require("express");
const { registerNewUser } = require("../models/user");
const router = express.Router();

module.exports = (app, passport) => {
  app.use("/auth", router);
  // Registration Endpoint
  router.post("/register", async (req, res, next) => {
    const data = req.body;
    try {
      const response = await registerNewUser(data);
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  // Login Endpoint
  // router.post(
  //   "/login",
  //   passport.authenticate("local"),
  //   async (req, res, next) => {
  //     try {
  //       const { username, password } = req.body;

  //       const response = await AuthServiceInstance.login({
  //         email: username,
  //         password,
  //       });

  //       res.status(200).send(response);
  //     } catch (err) {
  //       next(err);
  //     }
  //   }
  // );
};

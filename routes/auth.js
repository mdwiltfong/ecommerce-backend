const express = require("express");
const { registerNewUser, loginUser } = require("../models/user");
const router = express.Router();

module.exports = (app, passport) => {
  app.use("/auth", router);
  // Registration Endpoint
  router.post("/register", async (req, res, next) => {
    const data = req.body;
    if (!data.password || !data.email) {
      res.status(400).send({message: `Missing email or password information!` })
    }
    try {
      const response = await registerNewUser(data);
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  // Login Endpoint
  router.post(
    "/login",
    passport.authenticate("local"),
    async (req, res, next) => {
      try {
        const { email, password } = req.body;
        const response = await loginUser({ email, password });
        res.status(200).send(response);
      } catch (err) {
        next(err);
      }
    }
  );
};

const express = require("express");
const { registerNewUser, loginUser } = require("../models/user");
const router = express.Router();

module.exports = (app, passport) => {
  app.use("/auth", router);
  // Registration Endpoint
  router.get("/login", async (req, res, next) => {
    res.send(":)");
  });

  router.post("/register", async (req, res, next) => {
    const data = req.body;
    if (!data.password || !data.email) {
      res
        .status(400)
        .send({ message: `Missing email or password information!` });
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
    "/login/password",
    passport.authenticate("local"),
    // failureRedirect: "/login",
    async (req, res, next) => {
      const user = req.user;
      if (!user) {
        // we didnt get a user back from passport authenticate
        res.status(401).send({ message: "Incorrect username or password" });
      }
      res.status(200).send(req.user);
    }
  );

  router.get("/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy();
      res.redirect("/");
    });
  });
};

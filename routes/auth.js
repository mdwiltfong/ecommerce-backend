const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { isLoggedIn } = require("../middleware/auth");
const { ExpressErrorHandler } = require("../helperFunctions");

module.exports = (app, passport) => {
  app.use("/auth", router);
  router.get("/login", authController.loginPage);
  router.post("/register", authController.registerNewUser);
  router.post(
    "/login",
    passport.authenticate("local"),
    async (req, res, next) => {
      try {
        console.log("making it here?");
        const user = req.user;
        console.log(user, "req.user TESTTTTTTTTT");
        if (!user) {
          // we didnt get a user back from passport authenticate
          throw new ExpressErrorHandler(401, "Incorrect username or password");
        }
        res.status(200).send(user);
      } catch (error) {
        next(error);
      }
    }
  );
  router.post("/logout", authController.logout);
};

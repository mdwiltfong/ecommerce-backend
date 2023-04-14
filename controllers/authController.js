const userModel = require("../models/user");
const cartModel = require("../models/cart");

const loginPage = async (req, res, next) => {
  res.send("Redirected to /auth/login! :)");
};

const registerNewUser = async (req, res, next) => {
  const data = req.body;
  if (!data.password || !data.email) {
    res.status(400).send({ message: `Missing email or password information!` });
  }
  try {
    const userData = await userModel.registerNewUser(data);
    if (!userData) throw new Error("User couldn't be created");

    const cart = await cartModel.createCart(userData.user_id);
    const user = { ...userData, cart };

    req.login(user, (err) => {
      console.log("Registration successful.. Logging in user...");
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
    //res.status(200).send({ ...user, ...cart });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.clearCookie("connect.sid");
    req.session.destroy();
    res.status(200).send("LOGGED OUT");
  });
};

module.exports = {
  loginPage,
  registerNewUser,
  logout,
};

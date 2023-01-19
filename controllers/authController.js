const userModel = require("../models/user");

const loginPage = async (req, res, next) => {
  res.send(":)");
};

const registerNewUser = async (req, res, next) => {
  const data = req.body;
  if (!data.password || !data.email) {
    res.status(400).send({ message: `Missing email or password information!` });
  }
  try {
    const response = await userModel.registerNewUser(data);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

//TODO: isLoggedIn middleware
const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.clearCookie("connect.sid");
    req.session.destroy();
    res.redirect("/login");
  });
};

module.exports = {
  loginPage,
  registerNewUser,
  logout,
};

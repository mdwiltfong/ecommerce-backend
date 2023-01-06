// Holds all of the various express routers (users, products, orders)
const userRouter = require("./users");
const authRouter = require("./auth");
module.exports = (app, passport) => {
  userRouter(app);
  authRouter(app, passport);
};

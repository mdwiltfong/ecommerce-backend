// Holds all of the various express routers (users, products, orders)
const userRouter = require("./users");
module.exports = (app, passport) => {
  userRouter(app);
};

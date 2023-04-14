const app = require("./index");
const dotenv = require("dotenv").config({
  path: "../.env",
});

const { PORT } = require("./config");

app.get("/", (req, res, next) => {
  console.log(req.user, "req.user from root path");
  res.send(req);
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});

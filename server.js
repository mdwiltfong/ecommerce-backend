const app = require("./index");
const { PORT } = require("./config");

app.get("/", (req, res, next) => {
  res.send(":)))))");
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});

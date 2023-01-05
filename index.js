// const express = require("express");
// //const morgan = require("morgan");
// const bodyParser = require("body-parser");

// const app = express();
// const port = process.env.PORT || 4000;

// app.use(morgan("combined"));
// app.use(bodyParser.json());
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );

// app.get("/", (req, res) => {
//   //res.send("Hello World!");
//   res.json({});
// });

// app.get("/users", db.getUsers);
// app.get("/users/:id", db.getUserById);
// app.post("/users", db.createUser);

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
const express = require("express");
const app = express();

const loaders = require("./loaders");

const { PORT } = require("./config");

async function startServer() {
  // Init application loaders
  loaders(app);

  // Start server
  console.log(PORT);
  app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
  });
}

startServer();

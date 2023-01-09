const express = require("express");
const app = express();
const { PORT } = require("./config");
const loaders = require("./loaders");

// Init application loaders
loaders(app);

// exported for Jest testing
module.exports = app;

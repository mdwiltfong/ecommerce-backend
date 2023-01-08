const pool = require("../db");
const express = require("express");
const router = express.Router();
const productModel = require("../models/product");

module.exports = (app) => {
  app.use("/products", router);

  router.get("/", async (req, res, next) => {
    try {
      const response = await productModel.getProducts();
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const response = await productModel.getProductById(id);
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });
};

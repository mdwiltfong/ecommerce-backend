const pool = require("../db");
const express = require("express");
const router = express.Router();
const productModel = require("../models/product");

module.exports = (app) => {
  app.use("/products", router);

  router.get("/", async (req, res, next) => {
    const queryOpts = req.query;

    try {
      const response = await productModel.getProducts(queryOpts);
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.get("/:id", async (req, res, next) => {
    const id = parseInt(req.params.id);
    try {
      const response = await productModel.getProductById(id);
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.put("/:id", async (req, res, next) => {
    const id = parseInt(req.params.id);
    const newData = req.body;
    try {
      const response = await productModel.updateProductById(id, newData);
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    const id = parseInt(req.params.id);

    try {
      const response = await productModel.deleteProductById(id);
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });
};

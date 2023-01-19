const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

module.exports = (app) => {
  app.use("/products", router);
  router.get("/", productController.getAllProducts);
  router.get("/:id", productController.getProductById);
  router.put("/:id", productController.updateProductById);
  router.delete("/:id", productController.deleteProductById);
};

const express = require("express");
const router = express.Router();
const { isAdmin, isLoggedIn } = require("../middleware/auth");
const productController = require("../controllers/productController");

module.exports = (app) => {
  app.use("/products", router);
  router.get("/", productController.getProducts);
  router.post("/", productController.addProduct);
  router.get("/:id", productController.getProductById);
  router.put("/:id", productController.updateProductById);
  router.delete("/:id", productController.deleteProductById);
};

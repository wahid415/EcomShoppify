import express from "express";

import {
  getProdcuts,
  getProdcutById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopRatedProduct,
} from "../controllers/productController.js";

import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getProdcuts).post(protect, admin, createProduct);
router.get("/top", getTopRatedProduct);
router
  .route("/:id")
  .get(getProdcutById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

router.route("/:id/review").post(protect, createProductReview);

export default router;

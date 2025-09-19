import express from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
    .get(getProducts)            // همه محصولات + فیلتر
    .post(protect, admin, createProduct); // اضافه کردن محصول توسط ادمین

router.route("/:id")
    .get(getProductById)         // گرفتن محصول با ID
    .put(protect, admin, updateProduct)  // آپدیت توسط ادمین
    .delete(protect, admin, deleteProduct); // حذف توسط ادمین

export default router;

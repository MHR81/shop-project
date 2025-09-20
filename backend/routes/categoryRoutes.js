import express from "express";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryByNameWithProducts,
} from "../controllers/categoryController.js";
import { protect, admin } from "../middleware/authMiddleware.js"; // بعداً تعریف می‌کنیم

const router = express.Router();

router.route("/")
    .get(getCategories)       // همه دسته‌ها
    .post(protect, admin, createCategory); // اضافه کردن توسط ادمین

router.route("/:id")
    .put(protect, admin, updateCategory)  // آپدیت توسط ادمین
    .delete(protect, admin, deleteCategory); // حذف توسط ادمین

// گرفتن دسته‌بندی با نام و محصولات مرتبط
router.get("/name/:name", getCategoryByNameWithProducts);

export default router;

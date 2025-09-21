import express from "express";
import {
	createOrder,
	getMyOrders,
	getAllOrders,
	getOrderById,
	payOrder,
	deliverOrder
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ایجاد سفارش جدید
router.post("/", protect, createOrder);

// دریافت سفارش‌های کاربر
router.get("/myorders", protect, getMyOrders);

// دریافت همه سفارش‌ها (ادمین)
router.get("/all", protect, admin, getAllOrders);

// حذف همه سفارش‌ها (ادمین)
router.delete("/all", protect, admin, require("../controllers/orderController.js").deleteAllOrders);

// حذف سفارش با آیدی (ادمین)
router.delete("/:id", protect, admin, require("../controllers/orderController.js").deleteOrderById);

// دریافت سفارش با آیدی
router.get("/:id", protect, getOrderById);

// تغییر وضعیت پرداخت
router.put("/:id/pay", protect, payOrder);

// تغییر وضعیت ارسال
router.put("/:id/deliver", protect, admin, deliverOrder);

export default router;
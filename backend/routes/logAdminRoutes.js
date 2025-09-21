import express from "express";
import { deleteAllLogs, deleteUserLogs } from "../controllers/logAdminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// حذف همه لاگ‌ها (فقط ادمین)
router.delete("/all", protect, admin, deleteAllLogs);
// حذف لاگ‌های یک کاربر خاص (فقط ادمین)
router.delete("/user/:userId", protect, admin, deleteUserLogs);

export default router;

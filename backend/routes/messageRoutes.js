import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { sendMessage, getMessages, editMessage, deleteMessage } from "../controllers/messageController.js";

const router = express.Router();

// ارسال پیام جدید
router.post("/:ticketId", protect, sendMessage);
// دریافت پیام‌های یک تیکت
router.get("/:ticketId", protect, getMessages);
// ادیت پیام
router.put("/edit/:messageId", protect, editMessage);
// حذف پیام
router.delete("/delete/:messageId", protect, deleteMessage);

export default router;

import express from "express";
import { protect, support, admin } from "../middleware/authMiddleware.js";
import {
    createTicket,
    getAllTickets,
    answerTicket,
    getUserTickets,
    getSupportTickets,
    getTicketDetails,
    closeTicket,
    deleteTicket,
    setTicketReadForSupport,
    setTicketReadForUser,
    clearUserTicketNotification,
    reopenTicketByAdmin
} from "../controllers/ticketController.js";

const router = express.Router();

// Middleware برای چک نقش Admin یا Support
const checkAdminOrSupport = (req, res, next) => {
    if (req.user && (req.user.role === "admin" || req.user.role === "support")) {
        next();
    } else {
        res.status(403).json({ error: "دسترسی فقط برای ساپورت یا ادمین" });
    }
};

// تغییر وضعیت خوانده شدن تیکت توسط کاربر
router.put("/:id/read-user", protect, setTicketReadForUser);

// حذف نوتیفیکیشن برای کاربر وقتی تیکت خوانده شد
router.put("/:id/clear-user-notification", protect, clearUserTicketNotification);

// باز کردن دوباره تیکت بسته شده توسط ادمین
router.put("/:id/reopen", protect, admin, reopenTicketByAdmin);

// ایجاد تیکت توسط کاربر
router.post("/", protect, createTicket);

// دریافت لیست تیکت‌های یوزر
router.get("/my", protect, getUserTickets);

// دریافت لیست تیکت‌های ساپورت و ادمین
router.get("/all", protect, checkAdminOrSupport, getSupportTickets);

// دریافت جزئیات یک تیکت
router.get("/:id", protect, getTicketDetails);

// بستن تیکت (فقط admin/support)
router.put("/:id/close", protect, checkAdminOrSupport, closeTicket);

// حذف تیکت (فقط admin/support)
router.delete("/:id", protect, checkAdminOrSupport, deleteTicket);

// دریافت همه تیکت‌ها برای ساپورت و ادمین
router.get("/", protect, checkAdminOrSupport, getAllTickets);

// پاسخ به تیکت توسط ساپورت
router.put("/:id/answer", protect, support, answerTicket);

// تغییر وضعیت خوانده شدن تیکت توسط ساپورت
router.put("/:id/read", protect, support, setTicketReadForSupport);

export default router;
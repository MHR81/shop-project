import express from "express";
import { protect, support } from "../middleware/authMiddleware.js";
import { createTicket, getAllTickets, answerTicket, getUserTickets, getSupportTickets, getTicketDetails, closeTicket, deleteTicket, setTicketReadForSupport, setTicketReadForUser, clearUserTicketNotification, reopenTicketByAdmin } from "../controllers/ticketController.js";



// تغییر وضعیت خوانده شدن تیکت توسط کاربر
router.put("/:id/read-user", protect, setTicketReadForUser);

// حذف نوتیفیکیشن برای کاربر وقتی تیکت خوانده شد
router.put("/:id/clear-user-notification", protect, clearUserTicketNotification);

// باز کردن دوباره تیکت بسته شده توسط ادمین
router.put("/:id/reopen", protect, (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403);
        res.json({ error: "فقط ادمین می‌تواند تیکت را باز کند" });
    }
}, reopenTicketByAdmin);


// ایجاد تیکت توسط کاربر
router.post("/", protect, createTicket);
// دریافت لیست تیکت‌های یوزر
router.get("/my", protect, getUserTickets);
// دریافت لیست تیکت‌های ساپورت
router.get("/all", protect, support, getSupportTickets);
// دریافت جزئیات یک تیکت
router.get("/:id", protect, getTicketDetails);
// بستن تیکت
router.put("/:id/close", protect, closeTicket);
// حذف تیکت
router.delete("/:id", protect, deleteTicket);

// دریافت همه تیکت‌ها برای ساپورت
router.get("/", protect, support, getAllTickets);

// پاسخ به تیکت توسط ساپورت
router.put("/:id/answer", protect, support, answerTicket);

// تغییر وضعیت خوانده شدن تیکت توسط ساپورت
router.put("/:id/read", protect, support, setTicketReadForSupport);

export default router;

import express from "express";
import { protect, support } from "../middleware/authMiddleware.js";
import { createTicket, getAllTickets, answerTicket, getUserTickets, getSupportTickets, getTicketDetails, closeTicket, deleteTicket } from "../controllers/ticketController.js";

const router = express.Router();

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

export default router;

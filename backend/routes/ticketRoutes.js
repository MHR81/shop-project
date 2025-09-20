import express from "express";
import { protect, support } from "../middleware/authMiddleware.js";
import { createTicket, getAllTickets, answerTicket } from "../controllers/ticketController.js";

const router = express.Router();

// ایجاد تیکت توسط کاربر
router.post("/", protect, createTicket);

// دریافت همه تیکت‌ها برای ساپورت
router.get("/", protect, support, getAllTickets);

// پاسخ به تیکت توسط ساپورت
router.put("/:id/answer", protect, support, answerTicket);

export default router;

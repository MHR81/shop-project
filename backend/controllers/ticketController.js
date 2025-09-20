import asyncHandler from "express-async-handler";
import Ticket from "../models/Ticket.js";

// ایجاد تیکت توسط کاربر
export const createTicket = asyncHandler(async (req, res) => {
    const { subject, message } = req.body;
    if (!subject || !message) {
        res.status(400);
        throw new Error("لطفاً موضوع و پیام را وارد کنید");
    }
    const ticket = await Ticket.create({
        user: req.user._id,
        subject,
        message
    });
    res.status(201).json(ticket);
});

// دریافت همه تیکت‌ها برای ساپورت
export const getAllTickets = asyncHandler(async (req, res) => {
    const tickets = await Ticket.find().populate("user", "name email");
    res.json(tickets);
});

// پاسخ به تیکت توسط ساپورت
export const answerTicket = asyncHandler(async (req, res) => {
    const { answer } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        res.status(404);
        throw new Error("تیکت پیدا نشد");
    }
    ticket.answer = answer;
    ticket.status = "answered";
    ticket.support = req.user._id;
    await ticket.save();
    res.json(ticket);
});

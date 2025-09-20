// دریافت لیست تیکت‌های یوزر
export const getUserTickets = asyncHandler(async (req, res) => {
    const tickets = await Ticket.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tickets);
});

// دریافت لیست تیکت‌های ساپورت (همه تیکت‌ها)
export const getSupportTickets = asyncHandler(async (req, res) => {
    const tickets = await Ticket.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(tickets);
});

// دریافت جزئیات یک تیکت
export const getTicketDetails = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id).populate("user support", "name email role");
    if (!ticket) {
        res.status(404);
        throw new Error("تیکت پیدا نشد");
    }
    res.json(ticket);
});

// بستن تیکت
export const closeTicket = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        res.status(404);
        throw new Error("تیکت پیدا نشد");
    }
    if (String(ticket.user) !== String(req.user._id) && req.user.role !== "support") {
        res.status(403);
        throw new Error("دسترسی غیرمجاز");
    }
    ticket.closed = true;
    ticket.status = "closed";
    await ticket.save();
    res.json({ success: true });
});

// حذف تیکت
export const deleteTicket = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        res.status(404);
        throw new Error("تیکت پیدا نشد");
    }
    if (String(ticket.user) !== String(req.user._id) && req.user.role !== "support") {
        res.status(403);
        throw new Error("دسترسی غیرمجاز");
    }
    await ticket.deleteOne();
    res.json({ success: true });
});
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
// تغییر وضعیت خوانده شدن تیکت توسط ساپورت
export const setTicketReadForSupport = asyncHandler(async (req, res) => {
    const { isRead } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        res.status(404);
        throw new Error("تیکت پیدا نشد");
    }
    ticket.isReadForSupport = !!isRead;
    await ticket.save();
    res.json({ success: true, isReadForSupport: ticket.isReadForSupport });
});
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

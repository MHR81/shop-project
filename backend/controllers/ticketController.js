// باز کردن دوباره تیکت بسته شده توسط ادمین
export const reopenTicketByAdmin = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        res.status(404);
        throw new Error("تیکت پیدا نشد");
    }
    if (!req.user || req.user.role !== "admin") {
        res.status(403);
        throw new Error("فقط ادمین می‌تواند تیکت را باز کند");
    }
    ticket.closed = false;
    ticket.status = "open";
    await ticket.save();
    res.json({ success: true });
});
// حذف نوتیفیکیشن برای کاربر وقتی تیکت خوانده شد
export const clearUserTicketNotification = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        res.status(404);
        throw new Error("تیکت پیدا نشد");
    }
    if (String(ticket.user) !== String(req.user._id)) {
        res.status(403);
        throw new Error("دسترسی غیرمجاز");
    }
    ticket.notificationForUser = false;
    await ticket.save();
    res.json({ success: true });
});
// تغییر وضعیت خوانده شدن تیکت توسط کاربر
export const setTicketReadForUser = asyncHandler(async (req, res) => {
    const { isRead } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        res.status(404);
        throw new Error("تیکت پیدا نشد");
    }
    if (String(ticket.user) !== String(req.user._id)) {
        res.status(403);
        throw new Error("دسترسی غیرمجاز");
    }
    ticket.isReadForUser = !!isRead;
    await ticket.save();
    res.json({ success: true, isReadForUser: ticket.isReadForUser });
});
// دریافت لیست تیکت‌های یوزر
export const getUserTickets = asyncHandler(async (req, res) => {
    // Mark all tickets as read for user when accessed
    await Ticket.updateMany({ user: req.user._id, isReadForUser: false }, { $set: { isReadForUser: true } });
    const tickets = await Ticket.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tickets);
});

// دریافت لیست تیکت‌های ساپورت (همه تیکت‌ها)
export const getSupportTickets = asyncHandler(async (req, res) => {
    // Only support role can access
    if (!req.user || req.user.role !== "support") {
        res.status(403);
        throw new Error("Access denied, support only");
    }
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
    await Ticket.deleteOne({ _id: req.params.id });
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
    // ایجاد اولین پیام در چت تیکت
    const Message = (await import("../models/Message.js")).default;
    await Message.create({
        ticket: ticket._id,
        sender: req.user._id,
        text: message
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
    // Only support role can access
    if (!req.user || req.user.role !== "support") {
        res.status(403);
        throw new Error("Access denied, support only");
    }
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
    ticket.isReadForUser = false; // Mark as unread for user
    ticket.notificationForUser = true; // Set notification for user
    await ticket.save();
    // ثبت لاگ پاسخ به تیکت
    const Log = require("../models/Log.js");
    await Log.create({
        user: req.user._id,
        action: "پاسخ به تیکت",
        details: `تیکت ${ticket._id} توسط ساپورت ${req.user.email} پاسخ داده شد.`
    });
    res.json(ticket);
});

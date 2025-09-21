import asyncHandler from "express-async-handler";
import Message from "../models/Message.js";
import Ticket from "../models/Ticket.js";

// ارسال پیام جدید در تیکت
export const sendMessage = asyncHandler(async (req, res) => {
    const { text } = req.body;
    const ticketId = req.params.ticketId;
    if (!text) {
        res.status(400);
        throw new Error("متن پیام الزامی است");
    }
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        res.status(404);
        throw new Error("تیکت پیدا نشد");
    }
    // Prevent chat in closed tickets unless admin wants to reopen
    if (ticket.closed) {
        if (req.user.role === "admin" && req.body.reopen === true) {
            ticket.closed = false;
            ticket.status = "open";
            await ticket.save();
        } else {
            res.status(403);
            throw new Error("ارسال پیام در تیکت بسته شده مجاز نیست");
        }
    }
    const message = await Message.create({
        ticket: ticketId,
        sender: req.user._id,
        text
    });
    res.status(201).json(message);
});

// دریافت پیام‌های یک تیکت
export const getMessages = asyncHandler(async (req, res) => {
    const ticketId = req.params.ticketId;
    const messages = await Message.find({ ticket: ticketId }).populate("sender", "name role").sort({ createdAt: 1 });
    res.json(messages);
});

// ادیت پیام
export const editMessage = asyncHandler(async (req, res) => {
    const { text } = req.body;
    const message = await Message.findById(req.params.messageId);
    if (!message || message.deleted) {
        res.status(404);
        throw new Error("پیام پیدا نشد یا حذف شده است");
    }
    if (String(message.sender) !== String(req.user._id)) {
        res.status(403);
        throw new Error("فقط ارسال‌کننده می‌تواند پیام را ادیت کند");
    }
    message.text = text;
    message.edited = true;
    await message.save();
    res.json(message);
});

// حذف پیام
export const deleteMessage = asyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.messageId);
    if (!message || message.deleted) {
        res.status(404);
        throw new Error("پیام پیدا نشد یا حذف شده است");
    }
    if (String(message.sender) !== String(req.user._id)) {
        res.status(403);
        throw new Error("فقط ارسال‌کننده می‌تواند پیام را حذف کند");
    }
    message.deleted = true;
    await message.save();
    res.json({ success: true });
});

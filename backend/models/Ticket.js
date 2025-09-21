import mongoose from "mongoose";

const ticketSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["open", "answered", "closed"], default: "open" },
    support: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    closed: { type: Boolean, default: false },
    isReadForSupport: { type: Boolean, default: false }, // خوانده نشده برای ساپورت
    isReadForUser: { type: Boolean, default: false }, // خوانده نشده برای کاربر
    notificationForUser: { type: Boolean, default: false }, // نوتیفیکیشن برای کاربر
}, { timestamps: true });

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;

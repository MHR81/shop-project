import mongoose from "mongoose";

const ticketSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["open", "answered", "closed"], default: "open" },
    answer: { type: String },
    support: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;

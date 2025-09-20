import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    edited: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
export default Message;

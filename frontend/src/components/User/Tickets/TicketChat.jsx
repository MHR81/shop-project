import { useEffect, useState } from "react";
import Loading from "../../common/Loading";
import { useAuth } from "../../../context/AuthContext";
import { getTicketDetails } from "../../../api/ticket";
import { setTicketReadForUser, clearUserTicketNotification } from "../../../api/ticket";
import { getMessages, sendMessage, editMessage, deleteMessage } from "../../../api/message";

export default function TicketChat({ ticketId, onBack }) {
    const { user } = useAuth();
    // Removed t from useTranslation
    const [ticket, setTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState("");
    const [editId, setEditId] = useState(null);
    const [editText, setEditText] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const ticketData = await getTicketDetails(user.token, ticketId);
                setTicket(ticketData);
                // Mark as read and clear notification if needed
                if (!ticketData.isReadForUser) {
                    await setTicketReadForUser(user.token, ticketId, true);
                }
                if (ticketData.notificationForUser) {
                    await clearUserTicketNotification(user.token, ticketId);
                }
                const msgs = await getMessages(user.token, ticketId);
                setMessages(msgs);
            } catch {
                setMessage("Error fetching ticket info");
            }
            setLoading(false);
        };
        fetchData();
    }, [user.token, ticketId]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim() || ticket.closed) return;
        try {
            await sendMessage(user.token, ticketId, text);
            setText("");
            const msgs = await getMessages(user.token, ticketId);
            setMessages(msgs);
        } catch {
            setMessage("Error sending message");
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        if (!editText.trim()) return;
        try {
            await editMessage(user.token, editId, editText);
            setEditId(null);
            setEditText("");
            const msgs = await getMessages(user.token, ticketId);
            setMessages(msgs);
        } catch {
            setMessage("Error editing message");
        }
    };

    const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            await deleteMessage(user.token, id);
            const msgs = await getMessages(user.token, ticketId);
            setMessages(msgs);
        } catch {
            setMessage("Error deleting message");
        }
    };

    return (
        <div>
            <button className="btn btn-secondary mb-3" onClick={onBack}>Back to Ticket List</button>
            {loading ? (
                <Loading height="300px" />
            ) : (
                <div>
                    <h5 className="fw-bold mb-2 ticket-chat-title">Ticket Chat: {ticket?.subject}</h5>
                    {ticket?.closed && <div className="alert alert-warning">This ticket is closed.</div>}
                    <div className="chat-box mb-3 ticket-chat-box" style={{ maxHeight: 350, overflowY: "auto", background: "#f8f9fa", borderRadius: 8, padding: 12 }}>
                        {messages.map(msg => (
                            <div key={msg._id} className={`mb-2 p-2 rounded ${msg.sender && user && msg.sender._id === user._id ? "ticket-chat-user text-end" : "ticket-chat-support text-start"}`} style={{ position: "relative" }}>
                                {msg.deleted ? (
                                    <i className="text-muted">Message deleted</i>
                                ) : (
                                    <span>
                                        {msg.text}
                                        {msg.edited && <span className="ms-2 badge bg-info">Edited</span>}
                                        <div className="mt-4 small ticket-info">{msg.sender?.name} - {new Date(msg.createdAt).toLocaleString()}</div>
                                        {msg.sender && user && msg.sender._id === user._id && !msg.deleted && (
                                            <div style={{ position: "absolute", top: 10, left: 10 }}>
                                                <button className="btn btn-sm btn-outline-info me-1" onClick={() => { setEditId(msg._id); setEditText(msg.text); }}>Edit</button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(msg._id)}>Delete</button>
                                            </div>
                                        )}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                    {(!ticket || ticket.closed) ? null : (
                        editId ? (
                            <form onSubmit={handleEdit} className="d-flex mb-2 ticket-new-chat">
                                <input className="form-control me-2" value={editText} onChange={e => setEditText(e.target.value)} placeholder="Edit message..."/>
                                <button className="btn btn-success" type="submit">Submit Edit</button>
                                <button className="btn btn-secondary ms-2" type="button" onClick={() => setEditId(null)}>Cancel</button>
                            </form>
                        ) : (
                            <form onSubmit={handleSend} className="d-flex ticket-new-chat">
                                <input className="form-control me-2 ticket-new-chat" value={text} onChange={e => setText(e.target.value)} placeholder="New message..."/>
                                <button className="btn btn-primary" type="submit">Send</button>
                            </form>
                        )
                    )}
                    {message && <div className="alert alert-danger mt-2">{message}</div>}
                </div>
            )}
        </div>
    );
}

import { useEffect, useState } from "react";
import Loading from "../../common/Loading";
import { useAuth } from "../../../context/AuthContext";
import { getTicketDetails } from "../../../api/ticket";
import { setTicketReadForUser, clearUserTicketNotification } from "../../../api/ticket";
import { getMessages, sendMessage, editMessage, deleteMessage } from "../../../api/message";
import { useTranslation } from "react-i18next";

export default function TicketChat({ ticketId, onBack }) {
    const { user } = useAuth();
    const { t } = useTranslation();
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
                setMessage(t("ticket_chat_error"));
            }
            setLoading(false);
        };
        fetchData();
    }, [user.token, ticketId, t]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim() || ticket.closed) return;
        try {
            await sendMessage(user.token, ticketId, text);
            setText("");
            const msgs = await getMessages(user.token, ticketId);
            setMessages(msgs);
        } catch {
            setMessage(t("ticket_chat_send_error"));
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
            setMessage(t("ticket_chat_edit_error"));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t("ticket_chat_delete"))) return;
        try {
            await deleteMessage(user.token, id);
            const msgs = await getMessages(user.token, ticketId);
            setMessages(msgs);
        } catch {
            setMessage(t("ticket_chat_delete_error"));
        }
    };

    return (
        <div>
            <button className="btn btn-secondary mb-3" onClick={onBack}>{t("ticket_chat_back")}</button>
            {loading ? (
                <Loading height="300px" />
            ) : (
                <div>
                    <h5 className="fw-bold mb-2 ticket-chat-title">{t("ticket_chat_title")}: {ticket?.subject}</h5>
                    {ticket?.closed && <div className="alert alert-warning">{t("ticket_chat_closed")}</div>}
                    <div className="chat-box mb-3 ticket-chat-box" style={{ maxHeight: 350, overflowY: "auto", background: "#f8f9fa", borderRadius: 8, padding: 12 }}>
                        {messages.map(msg => (
                            <div key={msg._id} className={`mb-2 p-2 rounded ${msg.sender && user && msg.sender._id === user._id ? "ticket-chat-user text-end" : "ticket-chat-support text-start"}`} style={{ position: "relative" }}>
                                {msg.deleted ? (
                                    <i className="text-muted">{t("ticket_chat_deleted")}</i>
                                ) : (
                                    <span>
                                        {msg.text}
                                        {msg.edited && <span className="ms-2 badge bg-info">{t("ticket_chat_edited")}</span>}
                                        <div className="mt-4 small ticket-info">{msg.sender?.name} - {new Date(msg.createdAt).toLocaleString()}</div>
                                        {msg.sender && user && msg.sender._id === user._id && !msg.deleted && (
                                            <div style={{ position: "absolute", top: 10, left: 10 }}>
                                                <button className="btn btn-sm btn-outline-info me-1" onClick={() => { setEditId(msg._id); setEditText(msg.text); }}>{t("ticket_chat_edit")}</button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(msg._id)}>{t("ticket_chat_delete")}</button>
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
                                <input className="form-control me-2" value={editText} onChange={e => setEditText(e.target.value)} placeholder={t("ticket_chat_edit_placeholder")}/>
                                <button className="btn btn-success" type="submit">{t("ticket_chat_edit_submit")}</button>
                                <button className="btn btn-secondary ms-2" type="button" onClick={() => setEditId(null)}>{t("ticket_chat_edit_cancel")}</button>
                            </form>
                        ) : (
                            <form onSubmit={handleSend} className="d-flex ticket-new-chat">
                                <input className="form-control me-2 ticket-new-chat" value={text} onChange={e => setText(e.target.value)} placeholder={t("ticket_chat_new_placeholder")}/>
                                <button className="btn btn-primary" type="submit">{t("ticket_chat_send")}</button>
                            </form>
                        )
                    )}
                    {message && <div className="alert alert-danger mt-2">{message}</div>}
                </div>
            )}
        </div>
    );
}

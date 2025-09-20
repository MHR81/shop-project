import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Loading from "../../common/Loading";
import { getTicketDetails } from "../../../api/ticket";
import { getMessages, sendMessage, editMessage, deleteMessage } from "../../../api/message";

export default function SupportTicketChat({ ticketId, onBack }) {
    const { user } = useAuth();
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
                const t = await getTicketDetails(user.token, ticketId);
                setTicket(t);
                const msgs = await getMessages(user.token, ticketId);
                setMessages(msgs);
            } catch {
                setMessage("خطا در دریافت اطلاعات تیکت");
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
            setMessage("خطا در ارسال پیام");
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
            setMessage("خطا در ادیت پیام");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("آیا مطمئن هستید؟")) return;
        try {
            await deleteMessage(user.token, id);
            const msgs = await getMessages(user.token, ticketId);
            setMessages(msgs);
        } catch {
            setMessage("خطا در حذف پیام");
        }
    };

    return (
        <div>
            <button className="btn btn-secondary mb-3" onClick={onBack}>بازگشت به لیست تیکت‌ها</button>
            {loading ? (
                <Loading height="300px" />
            ) : (
                <div>
                    <h5 className="fw-bold mb-2 text-warning">چت تیکت: {ticket?.subject} - کاربر: {ticket?.user?.name}</h5>
                    {ticket?.closed && <div className="alert alert-warning">این تیکت بسته شده است.</div>}
                    <div className="chat-box mb-3" style={{ maxHeight: 350, overflowY: "auto", background: "#f8f9fa", borderRadius: 8, padding: 12 }}>
                        {messages.map(msg => (
                            <div key={msg._id} className={`mb-2 p-2 rounded ${msg.sender._id === user._id ? "bg-light text-end" : "bg-white text-start"}`} style={{ position: "relative" }}>
                                {msg.deleted ? <i className="text-muted">پیام حذف شده</i> : (
                                    <>
                                        <span>{msg.text}</span>
                                        {msg.edited && <span className="ms-2 badge bg-info">ویرایش شده</span>}
                                        <div className="small text-muted">{msg.sender.name} - {new Date(msg.createdAt).toLocaleString()}</div>
                                        {msg.sender._id === user._id && !msg.deleted && (
                                            <div style={{ position: "absolute", top: 2, left: 2 }}>
                                                <button className="btn btn-sm btn-outline-info me-1" onClick={() => { setEditId(msg._id); setEditText(msg.text); }}>ادیت</button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(msg._id)}>حذف</button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                    {!ticket?.closed && (
                        editId ? (
                            <form onSubmit={handleEdit} className="d-flex mb-2">
                                <input className="form-control me-2" value={editText} onChange={e => setEditText(e.target.value)} placeholder="ادیت پیام..." />
                                <button className="btn btn-success" type="submit">ثبت ادیت</button>
                                <button className="btn btn-secondary ms-2" type="button" onClick={() => setEditId(null)}>انصراف</button>
                            </form>
                        ) : (
                            <form onSubmit={handleSend} className="d-flex">
                                <input className="form-control me-2" value={text} onChange={e => setText(e.target.value)} placeholder="پیام جدید..." />
                                <button className="btn btn-primary" type="submit">ارسال</button>
                            </form>
                        )
                    )}
                    {message && <div className="alert alert-danger mt-2">{message}</div>}
                </div>
            )}
        </div>
    );
}

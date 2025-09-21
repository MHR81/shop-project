import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Loading from "../common/Loading";

export default function AdminTickets() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTicket, setActiveTicket] = useState(null);
    const [answer, setAnswer] = useState("");
    const [answerLoading, setAnswerLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            try {
                const res = await axios.get("/api/tickets", {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setTickets(res.data);
            } catch {
                setTickets([]);
            }
            setLoading(false);
        };
        fetchTickets();
    }, [user.token]);

    const handleShowTicket = ticket => {
        setActiveTicket(ticket);
        setAnswer("");
        setMessage("");
    };

    const handleAnswer = async () => {
        if (!answer.trim()) return setMessage("پاسخ را وارد کنید.");
        setAnswerLoading(true);
        try {
            await axios.post(`/api/tickets/${activeTicket._id}/answer`, { answer }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setMessage("پاسخ با موفقیت ثبت شد.");
            setAnswer("");
        } catch {
            setMessage("خطا در ثبت پاسخ");
        }
        setAnswerLoading(false);
    };

    return (
        <div>
            <h4 className="fw-bold mb-3 text-primary">مدیریت تیکت‌ها</h4>
            {loading ? <Loading height="100px" /> : (
                <ul className="list-group mb-4">
                    {tickets.length === 0 ? <li className="list-group-item">تیکتی وجود ندارد.</li> : (
                        tickets.map(ticket => (
                            <li key={ticket._id} className="list-group-item d-flex justify-content-between align-items-center">
                                <span style={{ cursor: "pointer" }} onClick={() => handleShowTicket(ticket)}>
                                    <b>{ticket.subject}</b> - {ticket.user?.name || "کاربر"} - وضعیت: <b>{ticket.status}</b>
                                </span>
                                <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                            </li>
                        ))
                    )}
                </ul>
            )}
            {activeTicket && (
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="fw-bold">جزئیات تیکت</h5>
                        <p><b>موضوع:</b> {activeTicket.subject}</p>
                        <p><b>پیام اولیه:</b> {activeTicket.message}</p>
                        <p><b>وضعیت:</b> {activeTicket.status}</p>
                        <p><b>پاسخ فعلی:</b> {activeTicket.answer || "-"}</p>
                        <textarea className="form-control mb-2" rows={3} value={answer} onChange={e => setAnswer(e.target.value)} placeholder="پاسخ ادمین یا ساپورت..." />
                        <button className="btn btn-success" onClick={handleAnswer} disabled={answerLoading}>ثبت پاسخ</button>
                        {message && <div className={`mt-2 alert ${message.includes("موفقیت") ? "alert-success" : "alert-danger"}`}>{message}</div>}
                        <button className="btn btn-secondary mt-2" onClick={() => setActiveTicket(null)}>بستن</button>
                    </div>
                </div>
            )}
        </div>
    );
}

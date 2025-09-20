import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllTickets, answerTicket } from "../../api/auth";

export default function SupportTickets() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [answer, setAnswer] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            try {
                const data = await getAllTickets(user.token);
                setTickets(data);
            } catch {
                setMessage("خطا در دریافت تیکت‌ها");
            }
            setLoading(false);
        };
        fetchTickets();
    }, [user.token]);

    const handleAnswer = async (e) => {
        e.preventDefault();
        if (!answer.trim()) return;
        try {
            await answerTicket(user.token, selectedId, answer);
            setMessage("پاسخ با موفقیت ثبت شد.");
            setAnswer("");
            setSelectedId(null);
            // Refresh tickets
            const data = await getAllTickets(user.token);
            setTickets(data);
        } catch {
            setMessage("خطا در ثبت پاسخ");
        }
    };

    return (
        <div>
            <h4 className="fw-bold mb-3 text-warning">تیکت‌های کاربران</h4>
            {loading ? <div>در حال بارگذاری...</div> : (
                <div>
                    {tickets.length === 0 ? (
                        <div className="alert alert-warning">هیچ تیکتی وجود ندارد.</div>
                    ) : (
                        <ul className="list-group mb-3">
                            {tickets.map(ticket => (
                                <li key={ticket._id} className="list-group-item">
                                    <div><b>موضوع:</b> {ticket.subject}</div>
                                    <div><b>پیام:</b> {ticket.message}</div>
                                    <div><b>وضعیت:</b> {ticket.status}</div>
                                    <div><b>کاربر:</b> {ticket.user?.name} ({ticket.user?.email})</div>
                                    {ticket.status !== "answered" && (
                                        <button className="btn btn-sm btn-warning mt-2" onClick={() => setSelectedId(ticket._id)}>پاسخ</button>
                                    )}
                                    {selectedId === ticket._id && (
                                        <form onSubmit={handleAnswer} className="mt-2">
                                            <textarea className="form-control mb-2" value={answer} onChange={e => setAnswer(e.target.value)} placeholder="پاسخ ساپورت" required />
                                            <button className="btn btn-success btn-sm" type="submit">ثبت پاسخ</button>
                                            <button className="btn btn-secondary btn-sm ms-2" type="button" onClick={() => setSelectedId(null)}>انصراف</button>
                                        </form>
                                    )}
                                    {ticket.answer && <div className="mt-2"><b>پاسخ ساپورت:</b> {ticket.answer}</div>}
                                </li>
                            ))}
                        </ul>
                    )}
                    {message && <div className={`alert ${message.includes("موفقیت") ? "alert-success" : "alert-danger"}`}>{message}</div>}
                </div>
            )}
        </div>
    );
}

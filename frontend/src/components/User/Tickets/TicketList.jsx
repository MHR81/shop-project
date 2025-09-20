import { useEffect, useState } from "react";
import Loading from "../../common/Loading";
import { useAuth } from "../../../context/AuthContext";
import { getUserTickets, deleteTicket, closeTicket } from "../../../api/ticket";

export default function TicketList({ onSelect }) {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            try {
                const data = await getUserTickets(user.token);
                setTickets(data);
            } catch {
                setMessage("خطا در دریافت تیکت‌ها");
            }
            setLoading(false);
        };
        fetchTickets();
    }, [user.token]);

    const handleDelete = async (id) => {
        if (!window.confirm("آیا مطمئن هستید؟")) return;
        try {
            await deleteTicket(user.token, id);
            setTickets(tickets.filter(t => t._id !== id));
        } catch {
            setMessage("خطا در حذف تیکت");
        }
    };

    const handleClose = async (id) => {
        try {
            await closeTicket(user.token, id);
            setTickets(tickets.map(t => t._id === id ? { ...t, closed: true, status: "closed" } : t));
        } catch {
            setMessage("خطا در بستن تیکت");
        }
    };

    return (
        <div>
            <h5 className="fw-bold mb-3 my-tickets-title">تیکت‌های من</h5>
            {loading ? (
                            <Loading height="300px" />
                        ) : (
                <ul className="list-group">
                    {tickets.map(ticket => (
                        <li key={ticket._id} className="list-group-item d-flex justify-content-between align-items-center my-tickets">
                            <span onClick={() => onSelect(ticket._id)} style={{ cursor: "pointer" }}>
                                <b>{ticket.subject}</b> - {ticket.status === "closed" ? "(بسته شده)" : "(باز)"}
                            </span>
                            <div>
                                {!ticket.closed && <button className="btn btn-sm btn-warning me-2" onClick={() => handleClose(ticket._id)}>بستن</button>}
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(ticket._id)}>حذف</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {message && <div className="alert alert-danger mt-2">{message}</div>}
        </div>
    );
}

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Loading from "../common/Loading";
import { getSupportTickets, deleteTicket, closeTicket, setTicketReadForSupport } from "../../api/ticket";

export default function AdminTicketList({ onSelect }) {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [changingRead, setChangingRead] = useState("");

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            try {
                const data = await getSupportTickets(user.token);
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

    const handleToggleRead = async (id, isRead) => {
        setChangingRead(id);
        try {
            await setTicketReadForSupport(user.token, id, !isRead);
            setTickets(tickets.map(t => t._id === id ? { ...t, isReadForSupport: !isRead } : t));
        } catch {
            setMessage("خطا در تغییر وضعیت خوانده شدن");
        }
        setChangingRead("");
    };

    return (
        <div>
            <h5 className="fw-bold mb-3 text-primary">همه تیکت‌های کاربران</h5>
            {loading ? (
                <Loading height="300px" />
            ) : (
                <ul className="list-group">
                    {tickets.map(ticket => (
                        <li
                            key={ticket._id}
                            className={`my-tickets list-group-item d-flex justify-content-between align-items-center ${!ticket.isReadForSupport ? "bg-info bg-opacity-25" : ""}`}
                        >
                            <span onClick={() => onSelect(ticket._id)} style={{ cursor: "pointer" }}>
                                <b>{ticket.subject}</b> - {ticket.status === "closed" ? "(بسته شده)" : "(باز)"} - {ticket.user?.name}
                                {!ticket.isReadForSupport && <span className="badge bg-primary ms-2">خوانده نشده</span>}
                            </span>
                            <div className="d-flex align-items-center">
                                <button
                                    className={`btn btn-sm ${ticket.isReadForSupport ? "btn-outline-secondary" : "btn-outline-primary"} me-2`}
                                    disabled={changingRead === ticket._id}
                                    onClick={() => handleToggleRead(ticket._id, ticket.isReadForSupport)}
                                >
                                    {ticket.isReadForSupport ? "علامت به عنوان خوانده نشده" : "علامت به عنوان خوانده شده"}
                                </button>
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

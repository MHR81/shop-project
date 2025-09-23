import { useEffect, useState } from "react";
import Loading from "../../common/Loading";
import { useAuth } from "../../../context/AuthContext";
import { getUserTickets, deleteTicket, closeTicket } from "../../../api/ticket";

export default function TicketList({ onSelect }) {
    const { user } = useAuth();
    // Removed t from useTranslation
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
                setMessage("Error fetching tickets");
            }
            setLoading(false);
        };
        fetchTickets();
    }, [user.token]);

    const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
        try {
            await deleteTicket(user.token, id);
            setTickets(tickets.filter(t => t._id !== id));
        } catch {
            setMessage("Error deleting ticket");
        }
    };

    const handleClose = async (id) => {
        try {
            await closeTicket(user.token, id);
            setTickets(tickets.map(t => t._id === id ? { ...t, closed: true, status: "closed" } : t));
        } catch {
            setMessage("Error closing ticket");
        }
    };

    return (
        <div>
            <h4 className="fw-bold mb-3"><span className="fs-4">My</span> <span className="text-danger fs-3">Tickets</span></h4>
            {loading ? (
                <Loading height="300px" />
            ) : (
                <ul className="list-group">
                    {tickets.map(ticket => (
                        <li key={ticket._id} className={`list-group-item d-flex justify-content-between align-items-center my-tickets ${!ticket.isReadForUser ? "bg-light border-primary" : ""}`}>
                            <span onClick={() => onSelect(ticket._id)} style={{ cursor: "pointer", position: "relative" }}>
                                <b>{ticket.subject}</b> - {ticket.status === "closed" ? "(Closed)" : "(Open)"}
                                {!ticket.isReadForUser && <span className="badge bg-primary ms-2">Unread</span>}
                                {ticket.notificationForUser && <span className="badge bg-danger ms-2">New Reply</span>}
                            </span>
                            <div>
                                {!ticket.closed && <button className="btn btn-sm btn-warning me-2" onClick={() => handleClose(ticket._id)}>Close</button>}
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(ticket._id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {message && <div className="alert alert-danger mt-2">{message}</div>}
        </div>
    );
}

import { useEffect, useState } from "react";
import Loading from "../../common/Loading";
import { useAuth } from "../../../context/AuthContext";
import { getUserTickets, deleteTicket, closeTicket } from "../../../api/ticket";
import { useTranslation } from "react-i18next";

export default function TicketList({ onSelect }) {
    const { user } = useAuth();
    const { t } = useTranslation();
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
                setMessage(t("ticket_list_error"));
            }
            setLoading(false);
        };
        fetchTickets();
    }, [user.token, t]);

    const handleDelete = async (id) => {
        if (!window.confirm(t("ticket_list_delete_confirm"))) return;
        try {
            await deleteTicket(user.token, id);
            setTickets(tickets.filter(t => t._id !== id));
        } catch {
            setMessage(t("ticket_list_delete_error"));
        }
    };

    const handleClose = async (id) => {
        try {
            await closeTicket(user.token, id);
            setTickets(tickets.map(t => t._id === id ? { ...t, closed: true, status: "closed" } : t));
        } catch {
            setMessage(t("ticket_list_close_error"));
        }
    };

    return (
        <div>
            <h5 className="fw-bold mb-3 my-tickets-title">{t("ticket_list_title")}</h5>
            {loading ? (
                <Loading height="300px" />
            ) : (
                <ul className="list-group">
                    {tickets.map(ticket => (
                        <li key={ticket._id} className={`list-group-item d-flex justify-content-between align-items-center my-tickets ${!ticket.isReadForUser ? "bg-light border-primary" : ""}`}>
                            <span onClick={() => onSelect(ticket._id)} style={{ cursor: "pointer", position: "relative" }}>
                                <b>{ticket.subject}</b> - {ticket.status === "closed" ? t("ticket_list_closed") : t("ticket_list_open")}
                                {!ticket.isReadForUser && <span className="badge bg-primary ms-2">{t("ticket_list_unread")}</span>}
                                {ticket.notificationForUser && <span className="badge bg-danger ms-2">{t("ticket_list_new_reply")}</span>}
                            </span>
                            <div>
                                {!ticket.closed && <button className="btn btn-sm btn-warning me-2" onClick={() => handleClose(ticket._id)}>{t("ticket_list_close")}</button>}
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(ticket._id)}>{t("ticket_list_delete")}</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {message && <div className="alert alert-danger mt-2">{message}</div>}
        </div>
    );
}

import { useState } from "react";
import AdminTicketList from "./AdminTicketList";
import AdminTicketChat from "./AdminTicketChat";

export default function AdminTickets() {
    const [activeTicketId, setActiveTicketId] = useState(null);
    return (
        <div>
            <h4 className="fw-bold mb-3 text-primary">مدیریت تیکت‌ها</h4>
            {!activeTicketId ? (
                <AdminTicketList onSelect={setActiveTicketId} />
            ) : (
                <AdminTicketChat ticketId={activeTicketId} onBack={() => setActiveTicketId(null)} />
            )}
        </div>
    );
}

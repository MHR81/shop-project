import { useState } from "react";
import SupportSidebar from "./SupportSidebar";
import SupportTicketList from "./Tickets/SupportTicketList";
import SupportTicketChat from "./Tickets/SupportTicketChat";

export default function SupportDashboard() {
    const [selectedId, setSelectedId] = useState(null);
    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-3 mb-4 mb-md-0">
                    <SupportSidebar activeTab="tickets" setActiveTab={() => {}} />
                </div>
                <div className="col-md-9">
                    <div className="dashboard-card card shadow-sm rounded-3">
                        <div className="card-body">
                            {!selectedId ? (
                                <SupportTicketList onSelect={setSelectedId} />
                            ) : (
                                <SupportTicketChat ticketId={selectedId} onBack={() => setSelectedId(null)} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

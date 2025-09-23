// SupportDashboard.jsx
import { useState } from "react";
import SupportSidebar from "./SupportSidebar";
import SupportProfile from "./SupportProfile";
import SupportTicketList from "./Tickets/SupportTicketList";
import SupportTicketChat from "./Tickets/SupportTicketChat";
import SupportChangePassword from "./ChangePassword";

function SupportDashboardInfo() {
    return (
        <div>
            <h4 className="fw-bold mb-3 text-primary fs-3">Support Dashboard</h4>
            <ul className="list-unstyled mb-4">
                <li>• View and reply to user tickets</li>
                <li>• Change password</li>
                <li>• Logout</li>
            </ul>
            <div className="alert alert-info">To get started, select an option from the panel.</div>
        </div>
    );
}

export default function SupportDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [selectedId, setSelectedId] = useState(null);

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-3 mb-4 mb-md-0">
                    <SupportSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="col-md-9">
                    <div className="card shadow-sm rounded-3">
                        <div className="card-body">
                            {activeTab === "dashboard" && <SupportDashboardInfo />}
                            {activeTab === "profile" && <SupportProfile />}
                            {activeTab === "tickets" &&
                                (!selectedId ? (
                                    <SupportTicketList onSelect={setSelectedId} />
                                ) : (
                                    <SupportTicketChat ticketId={selectedId} onBack={() => setSelectedId(null)} />
                                ))}
                            {activeTab === "changePassword" && <SupportChangePassword />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

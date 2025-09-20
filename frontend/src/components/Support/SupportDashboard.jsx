import { useState } from "react";
import SupportSidebar from "./SupportSidebar";
import SupportTickets from "./SupportTickets";

export default function SupportDashboard() {
    const [activeTab, setActiveTab] = useState("tickets");

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-3 mb-4 mb-md-0">
                    <SupportSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="col-md-9">
                    <div className="dashboard-card card shadow-sm rounded-3">
                        <div className="card-body">
                            {activeTab === "tickets" && <SupportTickets />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

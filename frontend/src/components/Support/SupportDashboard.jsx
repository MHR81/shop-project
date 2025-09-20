
import { useState } from "react";
import SupportSidebar from "./SupportSidebar";
import SupportTicketList from "./Tickets/SupportTicketList";
import SupportTicketChat from "./Tickets/SupportTicketChat";
import SupportChangePassword from "./ChangePassword";
function SupportDashboardInfo() {
    return (
        <div>
            <h4 className="fw-bold mb-3 text-primary fs-3">داشبورد ساپورت</h4>
            <ul className="list-unstyled mb-4">
                <li>• مشاهده و پاسخ به تیکت‌های کاربران</li>
                <li>• تغییر رمز عبور</li>
                <li>• خروج از حساب کاربری</li>
            </ul>
            <div className="alert alert-info">برای شروع، یکی از گزینه‌های پنل را انتخاب کنید.</div>
        </div>
    );
}

export default function SupportDashboard() {
    const [activeTab, setActiveTab] = useState("tickets");
    const [selectedId, setSelectedId] = useState(null);
    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-3 mb-4 mb-md-0">
                    <SupportSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="col-md-9">
                    <div className="dashboard-card card shadow-sm rounded-3">
                        <div className="card-body">
                            {activeTab === "dashboard" ? (
                                <SupportDashboardInfo />
                            ) : activeTab === "tickets" ? (
                                !selectedId ? (
                                    <SupportTicketList onSelect={setSelectedId} />
                                ) : (
                                    <SupportTicketChat ticketId={selectedId} onBack={() => setSelectedId(null)} />
                                )
                            ) : activeTab === "changePassword" ? (
                                <SupportChangePassword />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

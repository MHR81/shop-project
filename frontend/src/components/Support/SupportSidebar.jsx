import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function SupportSidebar({ activeTab, setActiveTab }) {
    const navigate = useNavigate();
    const { logoutUser } = useAuth();
    const activeClass = "active bg-warning text-dark border-warning";

    // مقدار تب فعال را از localStorage بخوان و هنگام mount ست کن
    React.useEffect(() => {
        const savedTab = localStorage.getItem("supportSidebarActiveTab");
        if (savedTab && setActiveTab) setActiveTab(savedTab);
    }, [setActiveTab]);

    // هر بار که تب تغییر کرد، مقدار جدید را ذخیره کن
    React.useEffect(() => {
        if (activeTab) localStorage.setItem("supportSidebarActiveTab", activeTab);
    }, [activeTab]);

    const handleLogout = () => {
        logoutUser();
        navigate("/auth");
        localStorage.removeItem("supportSidebarActiveTab");
    };

    return (
        <div className="list-group shadow-sm">
            <button className={`dashboard-sidebar list-group-item list-group-item-action${activeTab === "dashboard" ? " " + activeClass : ""}`} onClick={() => setActiveTab("dashboard")}> 
                <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </button>
            <button className={`dashboard-sidebar list-group-item list-group-item-action${activeTab === "profile" ? " " + activeClass : ""}`} onClick={() => setActiveTab("profile")}> 
                <i className="bi bi-person-circle me-2"></i>Profile
            </button>
            <button className={`dashboard-sidebar list-group-item list-group-item-action${activeTab === "tickets" ? " " + activeClass : ""}`} onClick={() => setActiveTab("tickets")}> 
                <i className="bi bi-ticket-detailed me-2"></i>Tickets
            </button>
            <button className={`dashboard-sidebar list-group-item list-group-item-action${activeTab === "changePassword" ? " " + activeClass : ""}`} onClick={() => setActiveTab("changePassword")}> 
                <i className="bi bi-key me-2"></i>Change Password
            </button>
            <button className="dashboard-sidebar list-group-item list-group-item-action text-warning" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>Logout
            </button>
        </div>
    );
}

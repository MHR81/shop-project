import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminSidebar({ activeTab, setActiveTab }) {
    React.useEffect(() => {
        const savedTab = localStorage.getItem("adminSidebarActiveTab");
        if (savedTab && setActiveTab) setActiveTab(savedTab);
    }, [setActiveTab]);

    React.useEffect(() => {
        if (activeTab) localStorage.setItem("adminSidebarActiveTab", activeTab);
    }, [activeTab]);

    // هنگام خروج مقدار را حذف کن
    const navigate = useNavigate();
    const { logoutUser } = useAuth();
    const activeClass = "active bg-danger text-white border-danger";

    const handleLogout = () => {
        logoutUser();
        navigate("/auth");
        localStorage.removeItem("adminSidebarActiveTab");
    };

    return (
        <div className="list-group shadow-sm">
            <button className={`dashboard-sidebar list-group-item list-group-item-action${activeTab === "dashboard" ? " " + activeClass : ""}`} onClick={() => setActiveTab("dashboard")}>
                <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </button>
            <button className={`dashboard-sidebar list-group-item list-group-item-action${activeTab === "profile" ? " " + activeClass : ""}`} onClick={() => setActiveTab("profile")}>
                <i className="bi bi-person me-2"></i>Profile
            </button>
            <button className={`dashboard-sidebar list-group-item list-group-item-action${activeTab === "products" ? " " + activeClass : ""}`} onClick={() => setActiveTab("products")}> 
                <i className="bi bi-box-seam me-2"></i>Products
            </button>
            <button className={`dashboard-sidebar list-group-item list-group-item-action${activeTab === "categories" ? " " + activeClass : ""}`} onClick={() => setActiveTab("categories")}> 
                <i className="bi bi-tags me-2"></i>Categories
            </button>
            <button className={`dashboard-sidebar list-group-item list-group-item-action${activeTab === "orders" ? " " + activeClass : ""}`} onClick={() => setActiveTab("orders")}>
                <i className="bi bi-bag-check me-2"></i>Orders
            </button>
            <button className={`dashboard-sidebar list-group-item list-group-item-action${activeTab === "users" ? " " + activeClass : ""}`} onClick={() => setActiveTab("users")}> 
                <i className="bi bi-people me-2"></i>Users
            </button>
            <button className={`dashboard-sidebar list-group-item list-group-item-action${activeTab === "tickets" ? " " + activeClass : ""}`} onClick={() => setActiveTab("tickets")}> 
                <i className="bi bi-ticket-perforated me-2"></i>Tickets
            </button>
            <button className={`dashboard-sidebar list-group-item list-group-item-action${activeTab === "changePassword" ? " " + activeClass : ""}`} onClick={() => setActiveTab("changePassword")}> 
                <i className="bi bi-key me-2"></i>Change Password
            </button>
            <button className="dashboard-sidebar list-group-item list-group-item-action text-danger" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>Logout
            </button>
        </div>
    );
}
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminProfile from "./AdminProfile";
import AdminProducts from "./AdminProducts";
import AdminCategories from "./AdminCategories";
import AdminOrders from "./AdminOrders";
import AdminUsers from "./AdminUsers";
import AdminChangePassword from "./AdminChangePassword";
import AdminTickets from "./AdminTickets";
import Dashboard from "./Dashboard"

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("");

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-3 mb-4 mb-md-0">
                    <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="col-md-9">
                    <div className="dashboard-card card shadow-sm rounded-3">
                        <div className="card-body">
                            {activeTab === "dashboard" && <Dashboard />}
                            {activeTab === "profile" && <AdminProfile />}
                            {activeTab === "products" && <AdminProducts />}
                            {activeTab === "categories" && <AdminCategories />}
                            {activeTab === "orders" && <AdminOrders />}
                            {activeTab === "users" && <AdminUsers />}
                            {activeTab === "tickets" && <AdminTickets />}
                            {activeTab === "changePassword" && <AdminChangePassword />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

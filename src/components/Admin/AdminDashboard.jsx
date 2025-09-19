import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminProfile from "./AdminProfile";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminUsers from "./AdminUsers";
import AdminChangePassword from "./AdminChangePassword";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-3 mb-4 mb-md-0">
                    <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="col-md-9">
                    <div className="dashboard-card card shadow-sm rounded-3">
                        <div className="card-body">
                            {activeTab === "dashboard" && <h3 className="fw-bold text-danger mb-4">Admin Dashboard</h3>}
                            {activeTab === "profile" && <AdminProfile />}
                            {activeTab === "products" && <AdminProducts />}
                            {activeTab === "orders" && <AdminOrders />}
                            {activeTab === "users" && <AdminUsers />}
                            {activeTab === "changePassword" && <AdminChangePassword />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


export default function Sidebar({ activeTab, setActiveTab }) {
    const navigate = useNavigate();
    const { logoutUser } = useAuth();

    const handleLogout = () => {
        logoutUser();
        navigate("/auth");
    };

    // کلاس فعال را به قرمز تغییر می‌دهیم
    const activeClass = "active bg-danger text-white border-danger";

    return (
        <div className="dashboard-sidebar list-group shadow-sm">
            <button
                className={`dashboard-sidebar list-group-item list-group-item-action${
                    activeTab === "profile" ? " " + activeClass : ""
                }`}
                onClick={() => setActiveTab("profile")}
            >
                <i className="bi bi-person me-2"></i>Profile
            </button>
            <button
                className={`dashboard-sidebar list-group-item list-group-item-action${
                    activeTab === "cart" ? " " + activeClass : ""
                }`}
                onClick={() => setActiveTab("cart")}
            >
                <i className="bi bi-cart me-2"></i>Cart
            </button>
            <button
                className={`dashboard-sidebar list-group-item list-group-item-action${
                    activeTab === "orders" ? " " + activeClass : ""
                }`}
                onClick={() => setActiveTab("orders")}
            >
                <i className="bi bi-bag-check me-2"></i>Orders
            </button>
            <button
                className={`dashboard-sidebar list-group-item list-group-item-action${
                    activeTab === "changePassword" ? " " + activeClass : ""
                }`}
                onClick={() => setActiveTab("changePassword")}
            >
                <i className="bi bi-key me-2"></i>Change Password
            </button>
            <button
                className="dashboard-sidebar list-group-item list-group-item-action text-danger"
                onClick={handleLogout}
            >
                <i className="bi bi-box-arrow-right me-2"></i>Logout
            </button>
        </div>
    );
}
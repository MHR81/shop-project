import Login from '../components/Authentication/Login.jsx';
import Breadcrumb from "../components/common/Breadcrumb.jsx";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { setTestRole } from "../utils/setTestRole";

export default function Auth() {
    const breadcrumbItems = [
        { label: "Home", to: "/" },
        { label: "Login", active: true }
    ];
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (token) {
            if (role === "admin") {
                navigate("/admin");
            } else {
                navigate("/user");
            }
        }
    }, [navigate]);

    return (
        <>
            <div className="container">
                <Breadcrumb items={breadcrumbItems} />
            </div>
            <Login />

            {/* تست رول ها (بعدا پاک شود) */}
            <div className="container my-4" style={{ maxWidth: 400 }}>
                <div className="card shadow border-0">
                    <div className="card-body">
                        <h6 className="text-center mb-3 text-secondary">تست نقش‌ها (فقط برای توسعه)</h6>
                        <div className="d-flex justify-content-center mb-3 gap-2">
                            <button
                                className="btn btn-outline-danger"
                                onClick={() => setTestRole("admin")}
                            >
                                <i className="bi bi-person-gear me-1"></i> رول ادمین
                            </button>
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => setTestRole("user")}
                            >
                                <i className="bi bi-person me-1"></i> رول یوزر
                            </button>
                        </div>
                        <div className="d-flex justify-content-center gap-2">
                            <Link to="/admin" className="btn btn-light border">
                                <i className="bi bi-shield-lock me-1"></i> پنل ادمین
                            </Link>
                            <Link to="/user" className="btn btn-light border">
                                <i className="bi bi-person-circle me-1"></i> پنل یوزر
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* تست رول ها (بعدا پاک شود) */}
        </>
    );
}
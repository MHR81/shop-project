import PageTransition from "../components/common/PageTransition";
import Login from '../components/Authentication/Login.jsx';
import Breadcrumb from "../components/common/Breadcrumb.jsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ...existing code...

export default function Auth() {
    
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            try {
                const user = JSON.parse(userInfo);
                if (user.role === "admin") {
                    navigate("/admin");
                }
                if (user.role === "support") {
                    navigate("/support");
                } else {
                    navigate("/user");
                }
            } catch { }
        }
    }, [navigate]);

    // پاک‌سازی توکن و رول تستی هنگام ورود به صفحه Auth
    useEffect(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    }, []);
    const breadcrumbItems = [
        { label: "Home", to: "/" },
        { label: "Login", active: true }
    ];


    return (
        <PageTransition>
            <div className="container">
                <Breadcrumb items={breadcrumbItems} />
            </div>
            <Login />
        </PageTransition>
    );
}
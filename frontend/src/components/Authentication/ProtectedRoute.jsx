import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, loginUser } = useAuth();
    const location = useLocation();
    let currentUser = user;
    if (!currentUser) {
        const stored = localStorage.getItem("userInfo");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                loginUser(parsed);
                currentUser = parsed;
            } catch {}
        }
    }
    if (!currentUser || !currentUser.token) {
        // کاربر وارد نشده → به صفحه لاگین میره
        return <Navigate to="/auth" replace state={{ from: location }} />;
    }
    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        // نقش اجازه دسترسی نداره → NotFound
        return <Navigate to="/notfound" replace state={{ from: location }} />;
    }
    return children;
}

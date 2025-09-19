import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const location = useLocation();

    if (!token) {
        return <Navigate to="/auth" replace />;
    }

    // If the role is not allowed, navigate to the NotFound page or appropriate page
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/NotFound" replace state={{ from: location }} />;
    }

    return children;
}
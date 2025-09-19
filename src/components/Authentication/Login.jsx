import { useState } from "react";
import Register from "./Register.jsx";
import ForgetPass from "./ForgetPass.jsx";
import { useNavigate } from "react-router-dom";
import Loading from "../common/Loading.jsx";
import { loginUser } from "../../api/auth";
import AuthLayout from "./AuthLayout.jsx";

export default function Login() {
    const [showRegister, setShowRegister] = useState(false);
    const [showForgetPass, setShowForgetPass] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    if (showRegister) return <Register />;
    if (showForgetPass) return <ForgetPass />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const data = await loginUser(email, password);
            if (data.token) {
                localStorage.setItem("token", data.token);

                let role = "user";
                if (email === "admin@admin.com") role = "admin";
                localStorage.setItem("role", role);

                navigate(role === "admin" ? "/admin" : "/user");
            } else {
                setError("Login failed!");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Network error!");
        }
        setLoading(false);
    };

    return (
        <AuthLayout title="Login">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">
                        <i className="bi bi-envelope"></i> Email
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">
                        <i className="bi bi-lock"></i> Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <p className="text-start">
                    <button
                        type="button"
                        className="btn btn-link text-decoration-none"
                        onClick={() => setShowForgetPass(true)}
                    >
                        Forgot Password?
                    </button>
                </p>
                {error && <div className="alert alert-danger py-2">{error}</div>}
                <button
                    type="submit"
                    className="btn btn-danger w-100"
                    disabled={loading}
                >
                    {loading ? <Loading height="24px" /> : "Login"}
                </button>
            </form>
            <button
                className="btn btn-link w-100 mt-3 text-decoration-none text-primary"
                onClick={() => setShowRegister(true)}
            >
                Don't have an account? Register
            </button>
        </AuthLayout>
    );
}

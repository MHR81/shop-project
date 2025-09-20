import { useState } from "react";
import Register from "./Register.jsx";
import ForgetPass from "./ForgetPass.jsx";
import { useNavigate } from "react-router-dom";
import Loading from "../common/Loading.jsx";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "./AuthLayout.jsx";
import PasswordInput from "../common/PasswordInput.jsx";

export default function Login() {
    const [showRegister, setShowRegister] = useState(false);
    const [showForgetPass, setShowForgetPass] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { loginUser } = useAuth();

    if (showRegister) return <Register />;
    if (showForgetPass) return <ForgetPass />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const data = await loginUser(email, password);
            if (data.token) {
                navigate(data.role === "admin" ? "/admin" : data.role === "user" ? "/user" : "/support");
            } else {
                setError("Login failed!");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Network error!");
        }
        setLoading(false);
    };

    return (
        <AuthLayout title="Login">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label"><i className="bi bi-envelope"></i> Email</label>
                    <input type="email" className="form-control" placeholder="Enter your email"
                        value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label"><i className="bi bi-lock"></i> Password</label>
                    <PasswordInput value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" />
                </div>
                <p className="text-start">
                    <button type="button" className="btn btn-link text-decoration-none"
                        onClick={() => setShowForgetPass(true)}>Forgot Password?</button>
                </p>
                {error && <div className="alert alert-danger py-2">{error}</div>}
                <button type="submit" className="btn btn-danger w-100" disabled={loading}>
                    {loading ? <Loading height="24px" /> : "Login"}
                </button>
            </form>
            <button className="btn btn-link w-100 mt-3 text-decoration-none text-primary"
                onClick={() => setShowRegister(true)}>Don't have an account? Register</button>
        </AuthLayout>
    );
}

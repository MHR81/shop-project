import { useState } from "react";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import AuthLayout from "./AuthLayout.jsx";
import { resetPassword } from "../../api/auth";
import Loading from "../common/Loading.jsx";

export default function ForgetPass() {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (showLogin) return <Login />;
    if (showRegister) return <Register />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const data = await resetPassword(email);
            setMessage(data.message || "Check your email to reset password!");
        } catch (err) {
            setError(err.response?.data?.message || "Network error!");
        }

        setLoading(false);
    };

    return (
        <AuthLayout title="Forgot Password">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" placeholder="Enter your email"
                        value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                {message && <div className="alert alert-success py-2">{message}</div>}
                {error && <div className="alert alert-danger py-2">{error}</div>}
                <button type="submit" className="btn btn-warning w-100" disabled={loading}>
                    {loading ? <Loading height="24px" /> : "Reset Password"}
                </button>
            </form>
            <div className="d-flex justify-content-center gap-2 mt-3 pt-5 pb-2">
                <button className="btn btn-sm btn-outline-danger w-25" onClick={() => setShowRegister(true)}>Register</button>
                <button className="btn btn-sm btn-outline-danger w-25" onClick={() => setShowLogin(true)}>Login</button>
            </div>
        </AuthLayout>
    );
}

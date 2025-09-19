import { useState } from "react";
import Login from "./Login.jsx";
import AuthLayout from "./AuthLayout.jsx";
import { registerUser } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [showLogin, setShowLogin] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    if (showLogin) return <Login />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const data = await registerUser(username, email, password);
            if (data.token) {
                // دریافت اطلاعات کامل پروفایل بعد از ثبت‌نام
                const userData = { token: data.token, role: data.role, email, name: username, username };
                localStorage.setItem("userInfo", JSON.stringify(userData));
                // دریافت پروفایل کامل و ست کردن در context
                const profileRes = await fetch(`${process.env.REACT_APP_AUTH_URL}/profile`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${data.token}` }
                });
                if (profileRes.ok) {
                    const profile = await profileRes.json();
                    localStorage.setItem("userInfo", JSON.stringify({ ...profile, token: data.token }));
                }
                // فراخوانی loginUser با ایمیل و پسورد برای ست شدن context
                await loginUser(email, password);
                navigate(data.role === "admin" ? "/admin" : "/user");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Network error!");
        }
        setLoading(false);
    };

    return (
        <AuthLayout title="Register">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label"><i className="bi bi-person"></i> Username</label>
                    <input type="text" className="form-control" placeholder="Enter your username"
                        value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
                </div>
                <div className="mb-3">
                    <label className="form-label"><i className="bi bi-envelope"></i> Email</label>
                    <input type="email" className="form-control" placeholder="Enter your email"
                        value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                </div>
                <div className="mb-3">
                    <label className="form-label"><i className="bi bi-lock"></i> Password</label>
                    <input type="password" className="form-control" placeholder="Enter your password"
                        value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
                </div>
                {error && <div className="alert alert-danger py-2">{error}</div>}
                <button type="submit" className="btn btn-danger w-100" disabled={loading}>
                    {loading ? "Loading..." : "Register"}
                </button>
            </form>
            <button className="btn btn-link w-100 mt-3 text-decoration-none text-primary"
                onClick={() => setShowLogin(true)}>Already have an account? Login</button>
        </AuthLayout>
    );
}

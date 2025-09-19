import { useState } from "react";
import Login from "./Login.jsx";
import ForgetPass from "./ForgetPass.jsx";
import AuthLayout from "./AuthLayout.jsx";

export default function Register() {
    const [showLogin, setShowLogin] = useState(false);
    const [showForgetPass, setShowForgetPass] = useState(false);

    if (showLogin) return <Login />;
    if (showForgetPass) return <ForgetPass />;

    return (
        <AuthLayout title="Register">
            <form>
                <div className="mb-3">
                    <label className="form-label">
                        <i className="bi bi-person"></i> Username
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your username"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">
                        <i className="bi bi-envelope"></i> Email
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
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
                    />
                </div>
                <p className="text-start">
                    <button
                        className="btn btn-link text-decoration-none"
                        onClick={() => setShowForgetPass(true)}
                    >
                        Forgot Password?
                    </button>
                </p>
                <button type="submit" className="btn btn-danger w-100">
                    Register
                </button>
            </form>
            <button
                className="btn btn-link w-100 mt-3 text-decoration-none text-primary"
                onClick={() => setShowLogin(true)}
            >
                Already have an account? Login
            </button>
        </AuthLayout>
    );
}

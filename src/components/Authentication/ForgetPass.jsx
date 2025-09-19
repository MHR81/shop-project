import { useState } from "react";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import AuthLayout from "./AuthLayout.jsx";

export default function ForgetPass() {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    if (showLogin) return <Login />;
    if (showRegister) return <Register />;

    return (
        <AuthLayout title="Forgot Password">
            <form>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                    />
                </div>
                <button type="submit" className="btn btn-warning w-100">
                    Reset Password
                </button>
            </form>
            <div className="d-flex justify-content-center gap-2 mt-3 pt-5 pb-2">
                <button
                    className="btn btn-sm btn-outline-danger w-25"
                    onClick={() => setShowRegister(true)}
                >
                    Register
                </button>
                <button
                    className="btn btn-sm btn-outline-danger w-25"
                    onClick={() => setShowLogin(true)}
                >
                    Login
                </button>
            </div>
        </AuthLayout>
    );
}

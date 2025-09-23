import { useState } from "react";
import { changePassword } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const { user } = useAuth();

    const handleSubmit = async e => {
        e.preventDefault();
        setMessage("");
        if (!currentPassword || !newPassword || !confirmPassword) {
            setMessage("Please fill in all fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setMessage("New password and confirmation do not match.");
            return;
        }
        if (newPassword.length < 6) {
            setMessage("New password must be at least 6 characters.");
            return;
        }
        setLoading(true);
        try {
            await changePassword(user.token, currentPassword, newPassword);
            setMessage("Password changed successfully.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setMessage(err?.response?.data?.message || "Error changing password");
        }
        setLoading(false);
    };

    return (
        <div>
            <h4 className="fw-bold mb-3"><span className="fs-4">Change</span> <span className="text-danger fs-3">Password</span></h4>
            <form style={{ maxWidth: 400 }} onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input type="password" className="form-control" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} disabled={loading} />
                </div>
                <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input type="password" className="form-control" value={newPassword} onChange={e => setNewPassword(e.target.value)} disabled={loading} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <input type="password" className="form-control" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={loading} />
                </div>
                <button type="submit" className="btn btn-warning" disabled={loading}>Change Password</button>
            </form>
            {message && <div className={`mt-3 alert ${message.includes("successfully") ? "alert-success" : "alert-danger"}`}>{message}</div>}
        </div>
    );
}
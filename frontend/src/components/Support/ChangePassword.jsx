import { useState } from "react";
import { changePassword } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

export default function SupportChangePassword() {
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
            setMessage("لطفاً همه فیلدها را کامل وارد کنید.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setMessage("رمز جدید و تکرار آن یکسان نیستند.");
            return;
        }
        if (newPassword.length < 6) {
            setMessage("رمز جدید باید حداقل ۶ کاراکتر باشد.");
            return;
        }
        setLoading(true);
        try {
            await changePassword(user.token, currentPassword, newPassword);
            setMessage("رمز عبور با موفقیت تغییر کرد.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setMessage(err?.response?.data?.message || "خطا در تغییر رمز عبور");
        }
        setLoading(false);
    };

    return (
        <div>
            <h4 className="fw-bold mb-3 text-danger fs-3">تغییر رمز عبور</h4>
            <form style={{ maxWidth: 400 }} onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">رمز فعلی</label>
                    <input type="password" className="form-control" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} disabled={loading} />
                </div>
                <div className="mb-3">
                    <label className="form-label">رمز جدید</label>
                    <input type="password" className="form-control" value={newPassword} onChange={e => setNewPassword(e.target.value)} disabled={loading} />
                </div>
                <div className="mb-3">
                    <label className="form-label">تکرار رمز جدید</label>
                    <input type="password" className="form-control" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={loading} />
                </div>
                <button type="submit" className="btn btn-warning" disabled={loading}>تغییر رمز عبور</button>
            </form>
            {message && <div className={`mt-3 alert ${message.includes("موفقیت") ? "alert-success" : "alert-danger"}`}>{message}</div>}
        </div>
    );
}

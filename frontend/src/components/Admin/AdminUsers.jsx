import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { createAdmin } from "../../api/auth";

export default function AdminUsers() {
    const { user } = useAuth();
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
    console.log("ارسال به createAdmin:", form);
        e.preventDefault();
        setMessage("");
        if (!form.name || !form.username || !form.email || !form.password) {
            setMessage("لطفاً همه فیلدها را کامل وارد کنید.");
            return;
        }
        if (form.name.trim().length === 0) {
            setMessage("نام نمی‌تواند فقط فاصله باشد یا خالی باشد.");
            return;
        }
        setLoading(true);
        try {
            await createAdmin(user.token, form);
            setMessage("ادمین جدید با موفقیت ساخته شد.");
            setForm({ name: "", username: "", email: "", password: "" });
        } catch (err) {
            setMessage("خطا در ساخت ادمین: " + (err?.response?.data?.message || "خطای سرور"));
        }
        setLoading(false);
    };

    return (
        <div>
            <h4 className="fw-bold mb-3 text-danger">Manage Users</h4>
            <div className="mb-3">
                <h5 className="fw-bold">ساخت ادمین جدید</h5>
                <form onSubmit={handleSubmit} className="row g-2">
                    <div className="col-md-3">
                        <input className="form-control" name="name" value={form.name} onChange={handleChange} placeholder="نام" required autoComplete="name" type="text" />
                    </div>
                    <div className="col-md-3">
                        <input className="form-control" name="username" value={form.username} onChange={handleChange} placeholder="نام کاربری" required autoComplete="username" type="text" />
                    </div>
                    <div className="col-md-3">
                        <input className="form-control" name="email" value={form.email} onChange={handleChange} placeholder="ایمیل" required autoComplete="email" type="email" />
                    </div>
                    <div className="col-md-3">
                        <input className="form-control" name="password" value={form.password} onChange={handleChange} placeholder="رمز عبور" required autoComplete="new-password" type="password" />
                    </div>
                    <div className="col-12">
                        <button className="btn btn-danger" type="submit" disabled={loading}>ساخت ادمین</button>
                    </div>
                </form>
                {message && <div className={`mt-3 alert ${message.includes("موفقیت") ? "alert-success" : "alert-danger"}`}>{message}</div>}
            </div>
            <div className="alert alert-danger">User management (list/search/delete/change role) will be implemented here.</div>
        </div>
    );
}
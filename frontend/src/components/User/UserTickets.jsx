import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { createTicket } from "../../api/auth";

export default function UserTickets() {
    const { user } = useAuth();
    const [form, setForm] = useState({ subject: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setMessage("");
        if (!form.subject || !form.message) {
            setMessage("لطفاً موضوع و پیام را وارد کنید.");
            return;
        }
        setLoading(true);
        try {
            await createTicket(user.token, form);
            setMessage("تیکت با موفقیت ارسال شد.");
            setForm({ subject: "", message: "" });
        } catch (err) {
            setMessage("خطا در ارسال تیکت: " + (err?.response?.data?.message || "خطای سرور"));
        }
        setLoading(false);
    };

    return (
        <div>
            <h5 className="fw-bold mb-3 text-danger">ارسال تیکت پشتیبانی</h5>
            <form onSubmit={handleSubmit} className="row g-2">
                <div className="col-md-6">
                    <input className="form-control" name="subject" value={form.subject} onChange={handleChange} placeholder="موضوع" required type="text" />
                </div>
                <div className="col-md-6">
                    <textarea className="form-control" name="message" value={form.message} onChange={handleChange} placeholder="پیام" required rows={3} />
                </div>
                <div className="col-12">
                    <button className="btn btn-danger" type="submit" disabled={loading}>ارسال تیکت</button>
                </div>
            </form>
            {message && <div className={`mt-3 alert ${message.includes("موفقیت") ? "alert-success" : "alert-danger"}`}>{message}</div>}
        </div>
    );
}

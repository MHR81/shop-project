import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { createTicket } from "../../../api/ticket";

export default function TicketNew({ onCreated }) {
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
            setMessage("تیکت با موفقیت ثبت شد.");
            setForm({ subject: "", message: "" });
            if (onCreated) onCreated();
        } catch (err) {
            setMessage("خطا در ثبت تیکت");
        }
        setLoading(false);
    };

    return (
        <div className="mb-4">
            <h5 className="fw-bold mb-2 new-ticket-title">ثبت تیکت جدید</h5>
            <form onSubmit={handleSubmit} className="row g-2">
                <div className="col-md-6">
                    <input className="form-control new-ticket" name="subject" value={form.subject} onChange={handleChange} placeholder="موضوع" required type="text" />
                </div>
                <div className="col-md-6">
                    <textarea className="form-control new-ticket" name="message" value={form.message} onChange={handleChange} placeholder="پیام اولیه" required rows={2} />
                </div>
                <div className="col-12">
                    <button className="btn btn-success" type="submit" disabled={loading}>ثبت تیکت</button>
                </div>
            </form>
            {message && <div className={`mt-2 alert ${message.includes("موفقیت") ? "alert-success" : "alert-danger"}`}>{message}</div>}
        </div>
    );
}

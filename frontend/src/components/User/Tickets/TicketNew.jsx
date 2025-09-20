import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { createTicket } from "../../../api/ticket";
import { useTranslation } from "react-i18next";

const TicketNew = ({ onCreated }) => {
    const { user } = useAuth();
    const { t } = useTranslation();
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
            setMessage(t("ticket_required"));
            return;
        }
        setLoading(true);
        try {
            await createTicket(user.token, form);
            setMessage(t("ticket_success"));
            setForm({ subject: "", message: "" });
            if (onCreated) onCreated();
        } catch (err) {
            setMessage(t("ticket_error"));
        }
        setLoading(false);
    };

    return (
        <div className="mb-4">
            <h5 className="fw-bold mb-2 new-ticket-title">{t("ticket_new_title")}</h5>
            <form onSubmit={handleSubmit} className="row g-2">
                <div className="col-md-6">
                    <input className="form-control new-ticket" name="subject" value={form.subject} onChange={handleChange} placeholder={t("ticket_subject")}
                        required type="text" />
                </div>
                <div className="col-md-6">
                    <textarea className="form-control new-ticket" name="message" value={form.message} onChange={handleChange} placeholder={t("ticket_message")}
                        required rows={2} />
                </div>
                <div className="col-12">
                    <button className="btn btn-success" type="submit" disabled={loading}>{t("ticket_submit")}</button>
                </div>
            </form>
            {message && <div className={`mt-2 alert ${message.includes(t("ticket_success")) ? "alert-success" : "alert-danger"}`}>{message}</div>}
        </div>
    );
};

export default TicketNew;


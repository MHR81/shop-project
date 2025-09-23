import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { createTicket } from "../../../api/ticket";

const TicketNew = ({ onCreated }) => {
    const { user } = useAuth();
    // Removed unused t from useTranslation
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
            setMessage("Please enter subject and message.");
            return;
        }
        setLoading(true);
        try {
            await createTicket(user.token, form);
            setMessage("Ticket submitted successfully.");
            setForm({ subject: "", message: "" });
            if (onCreated) onCreated();
        } catch (err) {
            setMessage("Error submitting ticket");
        }
        setLoading(false);
    };

    return (
        <div className="mb-4">
            <h4 className="fw-bold mb-3"><span className="fs-4">New</span> <span className="text-danger fs-3">Ticket</span></h4>
            <form onSubmit={handleSubmit} className="row g-2">
                <div className="col-md-6">
                    <input className="form-control new-ticket" name="subject" value={form.subject} onChange={handleChange} placeholder="Subject"
                        required type="text" />
                </div>
                <div className="col-md-6">
                    <textarea className="form-control new-ticket" name="message" value={form.message} onChange={handleChange} placeholder="Initial Message"
                        required rows={2} />
                </div>
                <div className="col-12">
                    <button className="btn btn-success" type="submit" disabled={loading}>Submit Ticket</button>
                </div>
            </form>
            {message && <div className={`mt-2 alert ${message.includes("Ticket submitted successfully.") ? "alert-success" : "alert-danger"}`}>{message}</div>}
        </div>
    );
};

export default TicketNew;


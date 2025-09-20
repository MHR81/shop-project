import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { createAdmin, createSupport } from "../../api/auth";
import { getAllUsers, updateUser, deleteUser } from "../../api/users";

export default function AdminUsers() {
    const { user } = useAuth();
    const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
    const [supportForm, setSupportForm] = useState({ name: "", username: "", email: "", password: "" });
    const [supportLoading, setSupportLoading] = useState(false);
    const [supportMessage, setSupportMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
    const [userLoading, setUserLoading] = useState(true);
    const [userMessage, setUserMessage] = useState("");
    // حذف متغیرهای بلااستفاده
    // لیست کاربران
    const fetchUsers = async () => {
        setUserLoading(true);
        try {
            const data = await getAllUsers(user.token);
            setUsers(data);
        } catch {
            setUserMessage("خطا در دریافت کاربران");
        }
        setUserLoading(false);
    };

    // تغییر نقش کاربر
    const handleRoleChange = async (id, role) => {
        try {
            await updateUser(user.token, id, { role });
            fetchUsers();
        } catch {
            setUserMessage("خطا در تغییر نقش کاربر");
        }
    };

    // حذف کاربر
    const handleDeleteUser = async id => {
        if (!window.confirm("آیا مطمئن هستید؟")) return;
        try {
            await deleteUser(user.token, id);
            fetchUsers();
        } catch {
            setUserMessage("خطا در حذف کاربر");
        }
    };

    // بارگذاری لیست کاربران هنگام ورود
    useState(() => { fetchUsers(); }, [user.token]);

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

    // فرم ساخت ساپورت
    const handleSupportChange = e => {
        const { name, value } = e.target;
        setSupportForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSupportSubmit = async e => {
        e.preventDefault();
        setSupportMessage("");
        if (!supportForm.name || !supportForm.username || !supportForm.email || !supportForm.password) {
            setSupportMessage("لطفاً همه فیلدها را کامل وارد کنید.");
            return;
        }
        if (supportForm.name.trim().length === 0) {
            setSupportMessage("نام نمی‌تواند فقط فاصله باشد یا خالی باشد.");
            return;
        }
        setSupportLoading(true);
        try {
            await createSupport(user.token, supportForm);
            setSupportMessage("ساپورت جدید با موفقیت ساخته شد.");
            setSupportForm({ name: "", username: "", email: "", password: "" });
        } catch (err) {
            setSupportMessage("خطا در ساخت ساپورت: " + (err?.response?.data?.message || "خطای سرور"));
        }
        setSupportLoading(false);
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
            <div className="mb-3">
                <h5 className="fw-bold">ساخت ساپورت جدید</h5>
                <form onSubmit={handleSupportSubmit} className="row g-2">
                    <div className="col-md-3">
                        <input className="form-control" name="name" value={supportForm.name} onChange={handleSupportChange} placeholder="نام" required autoComplete="name" type="text" />
                    </div>
                    <div className="col-md-3">
                        <input className="form-control" name="username" value={supportForm.username} onChange={handleSupportChange} placeholder="نام کاربری" required autoComplete="username" type="text" />
                    </div>
                    <div className="col-md-3">
                        <input className="form-control" name="email" value={supportForm.email} onChange={handleSupportChange} placeholder="ایمیل" required autoComplete="email" type="email" />
                    </div>
                    <div className="col-md-3">
                        <input className="form-control" name="password" value={supportForm.password} onChange={handleSupportChange} placeholder="رمز عبور" required autoComplete="new-password" type="password" />
                    </div>
                    <div className="col-12">
                        <button className="btn btn-warning" type="submit" disabled={supportLoading}>ساخت ساپورت</button>
                    </div>
                </form>
                {supportMessage && <div className={`mt-3 alert ${supportMessage.includes("موفقیت") ? "alert-success" : "alert-danger"}`}>{supportMessage}</div>}
            </div>
            <h5 className="fw-bold mt-4">لیست کاربران</h5>
            {userLoading ? <div>در حال بارگذاری...</div> : (
                <ul className="list-group">
                    {users.map(u => (
                        <li key={u._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>{u.name} - {u.email} - نقش: <b>{u.role}</b></span>
                            <div>
                                <select className="form-select form-select-sm d-inline-block w-auto me-2" value={u.role} onChange={e => handleRoleChange(u._id, e.target.value)}>
                                    <option value="user">یوزر</option>
                                    <option value="admin">ادمین</option>
                                    <option value="support">ساپورت</option>
                                </select>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteUser(u._id)}>حذف</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {userMessage && <div className="alert alert-danger mt-2">{userMessage}</div>}
        </div>
    );
}
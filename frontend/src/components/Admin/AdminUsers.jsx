import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { createAdmin, createSupport } from "../../api/auth";
import { getAllUsers, updateUser, deleteUser } from "../../api/users";
import { getUserLogs } from "../../api/logs";
import Loading from "../common/Loading";

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
    const [activeTab, setActiveTab] = useState("admin");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [userLogs, setUserLogs] = useState([]);
    const [logsLoading, setLogsLoading] = useState(false);
    // لیست کاربران
    const fetchUsers = useCallback(async () => {
        setUserLoading(true);
        try {
            const data = await getAllUsers(user.token);
            setUsers(data);
        } catch {
            setUserMessage("خطا در دریافت کاربران");
        }
        setUserLoading(false);
    }, [user.token]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    // دسته‌بندی کاربران
    const admins = users.filter(u => u.role === "admin");
    const supports = users.filter(u => u.role === "support");
    const normalUsers = users.filter(u => u.role === "user");

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

    // نمایش جزئیات کاربر
    const handleShowDetails = async user => {
        setSelectedUser(user);
        setShowDetails(true);
        setLogsLoading(true);
        try {
            const logs = await getUserLogs(user.token || user.token, user._id);
            setUserLogs(logs);
        } catch {
            setUserLogs([]);
        }
        setLogsLoading(false);
    };
    const handleCloseDetails = () => {
        setSelectedUser(null);
        setShowDetails(false);
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
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
            fetchUsers();
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
            fetchUsers();
        } catch (err) {
            setSupportMessage("خطا در ساخت ساپورت: " + (err?.response?.data?.message || "خطای سرور"));
        }
        setSupportLoading(false);
    };

    return (
        <div>
            <h4 className="fw-bold mb-3 text-danger">مدیریت کاربران</h4>
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
            <div className="mb-4">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === "admin" ? "active" : ""}`} onClick={() => setActiveTab("admin")}>ادمین‌ها</button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === "support" ? "active" : ""}`} onClick={() => setActiveTab("support")}>ساپورت‌ها</button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === "user" ? "active" : ""}`} onClick={() => setActiveTab("user")}>کاربران</button>
                    </li>
                </ul>
            </div>
            <h5 className="fw-bold mt-4">لیست {activeTab === "admin" ? "ادمین‌ها" : activeTab === "support" ? "ساپورت‌ها" : "کاربران"}</h5>
            {userLoading ? <Loading height="100px" /> : (
                <ul className="list-group">
                    {(activeTab === "admin" ? admins : activeTab === "support" ? supports : normalUsers).map(u => (
                        <li key={u._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span style={{ cursor: "pointer" }} onClick={() => handleShowDetails(u)}>{u.name} - {u.email} - نقش: <b>{u.role}</b></span>
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
            {/* نمایش جزئیات کاربر */}
            {showDetails && selectedUser && (
                <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.2)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">جزئیات کاربر</h5>
                                <button type="button" className="btn-close" onClick={handleCloseDetails}></button>
                            </div>
                            <div className="modal-body">
                                <p><b>نام:</b> {selectedUser.name}</p>
                                <p><b>ایمیل:</b> {selectedUser.email}</p>
                                <p><b>نام کاربری:</b> {selectedUser.username}</p>
                                <p><b>نقش:</b> {selectedUser.role}</p>
                                <p><b>استان:</b> {selectedUser.province || "-"}</p>
                                <p><b>شهر:</b> {selectedUser.city || "-"}</p>
                                <p><b>آدرس:</b> {selectedUser.address || "-"}</p>
                                <p><b>کد پستی:</b> {selectedUser.postCode || "-"}</p>
                                <p><b>موبایل:</b> {selectedUser.mobile || "-"}</p>
                                {/* نمایش لاگ‌ها */}
                                <div className="mt-3">
                                    <h6 className="fw-bold">لاگ‌های کاربر</h6>
                                    {logsLoading ? <Loading height="40px" /> : (
                                        <ul className="list-group">
                                            {userLogs.length === 0 ? (
                                                <li className="list-group-item">لاگی ثبت نشده است.</li>
                                            ) : (
                                                userLogs.map(log => (
                                                    <li key={log._id} className="list-group-item">
                                                        <b>{log.action}</b>: {log.details} <span className="text-muted">{new Date(log.createdAt).toLocaleString()}</span>
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseDetails}>بستن</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
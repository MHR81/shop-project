import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProfile, updateProfile, changePassword } from "../../api/auth";
import Loading from "../common/Loading";

export default function AdminProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState({});
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
    const initialProfileRef = useRef(null);

    useEffect(() => {
        if (user?.token) {
            setLoading(true);
            getProfile(user.token)
                .then((data) => {
                    setProfile(data);
                    initialProfileRef.current = JSON.parse(JSON.stringify(data || {}));
                })
                .catch(() => setMessage("خطا در دریافت اطلاعات ادمین"))
                .finally(() => setLoading(false));
        }
    }, [user?.token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const isDirty = () => {
        try {
            const before = JSON.stringify(initialProfileRef.current || {});
            const after = JSON.stringify(profile || {});
            return before !== after;
        } catch {
            return true;
        }
    };

    const handleSave = async () => {
        if (!isDirty()) {
            setMessage("هیچ تغییری برای ذخیره وجود ندارد.");
            return;
        }
        setLoading(true);
        setMessage("");
        try {
            const result = await updateProfile(user.token, profile);
            if (result && (result._id || result.id)) {
                setMessage("پروفایل با موفقیت ذخیره شد.");
                setEdit(false);
                initialProfileRef.current = JSON.parse(JSON.stringify(profile || {}));
            } else {
                setMessage("پروفایل ذخیره شد اما پاسخی غیرمنتظره دریافت شد.");
            }
        } catch (err) {
            setMessage(err?.response?.data?.message || "خطا در ذخیره پروفایل.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            await changePassword(user.token, passwords.currentPassword, passwords.newPassword);
            setMessage("رمز عبور با موفقیت تغییر کرد.");
            setPasswords({ currentPassword: "", newPassword: "" });
        } catch (err) {
            setMessage(err?.response?.data?.message || "خطا در تغییر رمز عبور.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h4 className="fw-bold mb-3"><span className="fs-4">Admin</span> <span className="text-danger fs-3">Profile</span></h4>
            {loading && <Loading height="100px" />}
            {message && <div className="alert alert-info mt-2">{message}</div>}
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Name</label>
                        <input className="form-control" name="name" value={profile.name || ""} onChange={handleChange} disabled={!edit} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Username</label>
                        <input className="form-control" name="username" value={profile.username || ""} onChange={handleChange} disabled={!edit} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input className="form-control" name="email" type="email" value={profile.email || ""} disabled />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Mobile</label>
                        <input className="form-control" name="mobile" value={profile.mobile || ""} onChange={handleChange} disabled={!edit} />
                    </div>
                </div>
                <div className="mt-3">
                    {!edit ? (
                        <button type="button" className="btn btn-outline-primary" onClick={() => setEdit(true)}>
                            Edit Profile
                        </button>
                    ) : (
                        <>
                            <button type="button" className="btn btn-success me-2" onClick={handleSave} disabled={loading}>
                                Save
                            </button>
                            <button type="button" className="btn btn-outline-secondary" onClick={() => {
                                if (initialProfileRef.current) {
                                    setProfile(JSON.parse(JSON.stringify(initialProfileRef.current)));
                                }
                                setEdit(false);
                                setMessage("");
                            }}>
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </form>
            <hr className="my-4" />
            <h5 className="fw-bold mb-3">Change Password</h5>
            <form onSubmit={handlePasswordChange} className="row g-3">
                <div className="col-md-6">
                    <input className="form-control" type="password" placeholder="Current Password" value={passwords.currentPassword} onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))} required />
                </div>
                <div className="col-md-6">
                    <input className="form-control" type="password" placeholder="New Password" value={passwords.newPassword} onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} required />
                </div>
                <div className="col-12">
                    <button className="btn btn-warning" type="submit" disabled={loading}>Change Password</button>
                </div>
            </form>
        </div>
    );
}
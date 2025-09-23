import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProfile, updateProfile } from "../../api/auth";
import Loading from "../common/Loading";

export default function AdminProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const initialProfileRef = useRef(null);

    // Load profile
    useEffect(() => {
        async function fetchProfile() {
            if (!user?.token) return;
            setLoading(true);
            try {
                const data = await getProfile(user.token);
                const fullName = [data.name, data.lastName].filter(Boolean).join(" ");
                const profileData = {
                    avatar: data.avatar || "https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff",
                    fullName,
                    name: data.name || "",
                    lastName: data.lastName || "",
                    username: data.username || "",
                    email: data.email || "",
                    role: data.role || "",
                    address: data.address || "",
                    mobile: data.mobile || "",
                    province: data.province || "",
                    city: data.city || "",
                    postCode: data.postCode || "",
                    adminType: data.mainAdmin ? "Super Admin: ✅" : "Super Admin: 🚫"
                };
                setProfile(profileData);
                initialProfileRef.current = JSON.parse(JSON.stringify(profileData));
            } catch {
                setMessage("خطا در دریافت پروفایل.");
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, [user?.token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = ev => setProfile(prev => ({ ...prev, avatar: ev.target.result }));
            reader.readAsDataURL(file);
        }
    };

    const isDirty = () => JSON.stringify(initialProfileRef.current) !== JSON.stringify(profile);

    const handleSave = async () => {
        if (!isDirty()) {
            setMessage("هیچ تغییری برای ذخیره وجود ندارد.");
            return;
        }
        setLoading(true);
        setMessage("");
        try {
            // فقط فیلدهای مورد نیاز بک‌اند را ارسال کن
            const payload = {
                avatar: profile.avatar,
                name: profile.name,
                lastName: profile.lastName,
                username: profile.username,
                email: profile.email,
                address: profile.address,
                province: profile.province,
                city: profile.city,
                postCode: profile.postCode,
                mobile: profile.mobile
            };
            console.log('Payload sent to backend:', payload);
            await updateProfile(user.token, payload);
            // دریافت مجدد پروفایل از بک‌اند
            const updated = await getProfile(user.token);
            setProfile(updated);
            setMessage("پروفایل با موفقیت ذخیره شد.");
            setEdit(false);
            initialProfileRef.current = JSON.parse(JSON.stringify(updated));
        } catch {
            setMessage("خطا در ذخیره پروفایل.");
        } finally {
            setLoading(false);
        }
    };

    if (!profile) return <Loading height="100px" />;

    return (
        <div className="card shadow-sm border-0 p-3 rounded-3">
            <div className="d-flex align-items-center mb-3">
                <div className="position-relative me-3">
                    <img
                        src={profile.avatar}
                        alt={profile.fullName}
                        className="rounded-circle border border-2"
                        style={{ width: 64, height: 64, objectFit: "cover" }}
                    />
                    {edit && (
                        <label className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-1" style={{ cursor: "pointer" }}>
                            <i className="bi bi-pencil"></i>
                            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
                        </label>
                    )}
                </div>
                <div>
                    <h5 className="fw-semibold mb-1">
                        {edit ? (
                            <>
                                <input
                                    className="form-control form-control-sm mb-1"
                                    name="name"
                                    value={profile.name || ""}
                                    onChange={handleChange}
                                    placeholder="Name"
                                />
                                <input
                                    className="form-control form-control-sm"
                                    name="lastName"
                                    value={profile.lastName || ""}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                />
                            </>
                        ) : (
                            <span>{profile.name} {profile.lastName}</span>
                        )}
                    </h5>
                    <div className="mt-1">
                        <span className="badge bg-light text-dark me-1"><i className="bi bi-person"></i> {profile.username}</span>
                        <span className="badge bg-danger text-dark"><i className="bi bi-envelope"></i> {profile.email}</span>
                    </div>
                </div>
            </div>

            {message && <div className="alert alert-info py-2 small mt-2 mb-2">{message}</div>}

            <div className="row">
                <div className="col-md-6 mb-2">
                    <label className="form-label small">Mobile</label>
                    <input
                        className="form-control form-control-sm"
                        name="mobile"
                        value={profile.mobile || ""}
                        onChange={handleChange}
                        disabled={!edit}
                    />
                </div>
            </div>

            <div className="mt-2">
                {!edit ? (
                    <button className="btn btn-outline-danger btn-sm" onClick={() => setEdit(true)}>Edit Profile</button>
                ) : (
                    <>
                        <button className="btn btn-success btn-sm me-2" onClick={handleSave} disabled={loading}>Save</button>
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => {
                                setProfile(JSON.parse(JSON.stringify(initialProfileRef.current)));
                                setEdit(false);
                                setMessage("");
                            }}
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

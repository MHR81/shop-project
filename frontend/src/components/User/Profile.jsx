// src/components/User/Profile.jsx
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../api/auth";
import { getProvinces, getCitiesByProvinceName } from "../../api/location";
import Loading from "../common/Loading";

/*
  نسخهٔ اصلاح‌شده:
  - جلوگیری از submit خودکار
  - فقط با کلیک Save درخواست می‌زند
  - بررسی isDirty قبل از ارسال
  - لاگ برای دیباگ
*/

export default function Profile({ profile, setProfile, edit, setEdit }) {
    const { user } = useAuth(); // برای توکن یا اطلاعات کاربر
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const initialProfileRef = useRef(null); // برای مقایسهٔ قبل/بعد

    // وقتی وارد حالت ویرایش میشیم، snapshot می‌گیریم تا بعداً مقایسه کنیم
    useEffect(() => {
        if (edit) {
            // کلون ساده (برای دادهٔ ساده کفایت می‌کنه)
            initialProfileRef.current = JSON.parse(JSON.stringify(profile || {}));
            console.log("🔁 edit=true — initialProfile snapshot taken", initialProfileRef.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [edit]);

    // بارگذاری استان‌ها (یکبار)
    useEffect(() => {
        setLoading(true);
        getProvinces()
            .then((res) => {
                setProvinces(res || []);
            })
            .catch((_) => {
                setProvinces([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // وقتی استان تغییر کنه، شهرها رو بگیر
    const province = profile?.province;
    useEffect(() => {
        if (province) {
            setLoading(true);
            getCitiesByProvinceName(province)
                .then((res) => setCities(res || []))
                .catch(() => setCities([]))
                .finally(() => setLoading(false));
        } else {
            setCities([]);
        }
    }, [province]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleProvinceChange = (e) => {
        const value = e.target.value;
        setProfile((prev) => ({ ...prev, province: value, city: "" }));
    };

    const handleSendSMS = () => {
        setProfile((prev) => ({ ...prev, smsSent: true, mobileVerified: false }));
    };

    const handleVerifyCode = () => {
        setProfile((prev) => ({ ...prev, mobileVerified: true, smsSent: false, enteredCode: "" }));
    };

    // shallow/deep comparison: اینجا از JSON.stringify برای سادگی استفاده کردیم
    const isDirty = () => {
        try {
            const before = JSON.stringify(initialProfileRef.current || {});
            const after = JSON.stringify(profile || {});
            return before !== after;
        } catch {
            return true; // اگر خطا بود فرض میکنیم تغییر هست
        }
    };

    // Save فقط وقتی کاربر صریحاً کلیک کنه
    const handleSave = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        console.log("Profile.jsx: ✅ handleSave اجرا شد. profile:", profile);

        // اگر کاربر توکن نداره یا اجازه نیست
        if (!user?.token) {
            setMessage("Authentication required. لطفاً دوباره وارد شوید.");
            return;
        }

        // اگر هیچ تغییری نیست، ارسال نکن
        if (!isDirty()) {
            console.log("Profile.jsx: هیچ تغییری برای ذخیره وجود ندارد — ارسال انجام نشد.");
            setMessage("هیچ تغییری برای ذخیره وجود ندارد.");
            // نخواهیم setEdit(false) انجام بدیم تا کاربر بتونه تغییر بده
            return;
        }

        setLoading(true);
        setMessage("");
        try {
            const result = await updateProfile(user.token, profile);
            console.log("Profile.jsx: 📩 پاسخ سرور از updateProfile:", result);
            if (result && (result._id || result.id)) {
                setMessage("پروفایل با موفقیت ذخیره شد.");
                // اگر میخوای بعد از ذخیره، حالت ویرایش بسته شود:
                setEdit(false);
                // به‌روز رسانی snapshot برای بار بعد
                initialProfileRef.current = JSON.parse(JSON.stringify(profile || {}));
            } else {
                setMessage("پروفایل ذخیره شد اما پاسخی غیرمنتظره دریافت شد.");
            }
        } catch (err) {
            console.error("Profile.jsx: خطا در updateProfile:", err);
            setMessage(err?.response?.data?.message || "خطا در ذخیره پروفایل. لطفاً بعداً تلاش کنید.");
        } finally {
            setLoading(false);
        }
    };

    // فرم را preventDefault میکنیم تا Enter یا submit تصادفی باعث ارسال نشود.
    // Save را صراحتاً با کلیک روی دکمهٔ Save انجام میدهیم.
    return (
        <div>
            <h4 className="fw-bold mb-3">
                <span className="fs-4">My</span> <span className="text-danger fs-3">Profile</span>
            </h4>

            {loading && <Loading height="100px" />}

            {message && <div className="alert alert-info mt-2">{message}</div>}

            <form onSubmit={(e) => e.preventDefault()}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Name</label>
                        <input
                            className="form-control"
                            name="name"
                            value={profile.name || ""}
                            onChange={handleChange}
                            disabled={!edit}
                            autoComplete="name"
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">Last Name</label>
                        <input
                            className="form-control"
                            name="lastName"
                            value={profile.lastName || ""}
                            onChange={handleChange}
                            disabled={!edit}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">Username</label>
                        <input
                            className="form-control"
                            name="username"
                            value={profile.username || ""}
                            onChange={handleChange}
                            disabled={!edit}
                            autoComplete="username"
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input
                            className="form-control"
                            name="email"
                            type="email"
                            value={profile.email || ""}
                            onChange={handleChange}
                            disabled={true}
                            autoComplete="email"
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">استان</label>
                        <select
                            className="form-select"
                            name="province"
                            value={profile.province || ""}
                            onChange={handleProvinceChange}
                            disabled={!edit}
                        >
                            <option value="">انتخاب کنید</option>
                            {provinces.map((p) => (
                                <option key={p.id || p.name} value={p.name}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">شهر</label>
                        <select
                            className="form-select"
                            name="city"
                            value={profile.city || ""}
                            onChange={handleChange}
                            disabled={!edit || !profile.province}
                        >
                            <option value="">انتخاب کنید</option>
                            {cities.map((c) => (
                                <option key={c.id || c.name} value={c.name}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-12 mb-3">
                        <label className="form-label">Address</label>
                        <input
                            className="form-control"
                            name="address"
                            value={profile.address || ""}
                            onChange={handleChange}
                            disabled={!edit}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">Post Code</label>
                        <input
                            className="form-control"
                            name="postCode"
                            value={profile.postCode || ""}
                            onChange={handleChange}
                            disabled={!edit}
                        /></div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">Mobile</label>
                        <div className="input-group">
                            <input
                                className="form-control"
                                name="mobile"
                                value={profile.mobile || ""}
                                onChange={handleChange}
                                disabled={!edit || profile.smsSent}
                                autoComplete="tel"
                            />
                            {edit && (
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    disabled={profile.smsSent || !profile.mobile}
                                    onClick={handleSendSMS}
                                >
                                    Send SMS
                                </button>
                            )}
                        </div>

                        {edit && profile.smsSent && (
                            <div className="mt-2">
                                <input
                                    className="form-control d-inline w-auto"
                                    placeholder="Enter code"
                                    value={profile.enteredCode || ""}
                                    onChange={(e) => setProfile((prev) => ({ ...prev, enteredCode: e.target.value }))}
                                    style={{ width: 120, display: "inline-block" }}
                                />
                                <button type="button" className="btn btn-success ms-2" onClick={handleVerifyCode}>
                                    Verify
                                </button>
                                <span className="ms-2 text-muted">کد نمایشی است</span>
                            </div>
                        )}

                        {profile.mobileVerified && <span className="badge bg-success ms-2">Verified</span>}
                    </div>
                </div>

                <div className="mt-3">
                    {!edit ? (
                        <button type="button" className="btn btn-outline-primary" onClick={() => setEdit(true)}>
                            Edit Profile
                        </button>
                    ) : (
                        <>
                            {/* Save: صراحتاً onClick => handleSave (type=button) تا submit تصادفی نباشه */}
                            <button
                                type="button"
                                className="btn btn-success me-2"
                                onClick={handleSave}
                                disabled={loading}
                            >
                                Save
                            </button>
                            <button type="button" className="btn btn-outline-secondary" onClick={() => {
                                // بازگردانی به snapshot اولیه (اصلاح محلی)
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
        </div>
    );
}
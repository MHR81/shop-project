import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../api/auth";
import { getCountries, getProvinces, getCities } from "../../api/location";
import Loading from "../common/Loading";
import { useEffect, useState } from "react";


export default function Profile({ profile, setProfile, edit, setEdit }) {
    const { user } = useAuth();
    const [countries, setCountries] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        setLoading(true);
        getCountries().then(setCountries).catch(()=>{});
        getProvinces().then(setProvinces).catch(()=>{});
        setLoading(false);
    }, []);

    useEffect(() => {
        if (profile.province) {
            setLoading(true);
            getCities(profile.province).then(setCities).catch(()=>{});
            setLoading(false);
        } else {
            setCities([]);
        }
    }, [profile.province]);

    const handleChange = e => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleProvinceChange = e => {
        setProfile(prev => ({
            ...prev,
            province: e.target.value,
            city: ""
        }));
    };

    const handleCountryChange = e => {
        setProfile(prev => ({
            ...prev,
            country: e.target.value
        }));
    };

    const handleSendSMS = () => {
        setProfile(prev => ({
            ...prev,
            smsSent: true,
            mobileVerified: false
        }));
    };

    const handleVerifyCode = () => {
        setProfile(prev => ({
            ...prev,
            mobileVerified: true,
            smsSent: false,
            enteredCode: ""
        }));
    };

    const handleSave = async e => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        if (user && user.token) {
            try {
                await updateProfile(user.token, profile);
                setEdit(false);
                setMessage("پروفایل با موفقیت ذخیره شد.");
            } catch (err) {
                setMessage("خطا در ذخیره پروفایل");
            }
        }
        setLoading(false);
    };

    return (
        <div>
            <h4 className="fw-bold mb-3">
                <span className="fs-4">My</span> <span className="text-danger fs-3">Profile</span>
            </h4>
            {loading && <Loading height="100px" />}
            {message && <div className="alert alert-info mt-2">{message}</div>}
            <form onSubmit={handleSave}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Name</label>
                        <input
                            className="form-control"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            disabled={!edit}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Last Name</label>
                        <input
                            className="form-control"
                            name="lastName"
                            value={profile.lastName}
                            onChange={handleChange}
                            disabled={!edit}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Username</label>
                        <input
                            className="form-control"
                            name="username"
                            value={profile.username}
                            onChange={handleChange}
                            disabled={!edit}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input
                            className="form-control"
                            name="email"
                            type="email"
                            value={profile.email}
                            onChange={handleChange}
                            disabled={!edit}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">کشور</label>
                        <select
                            className="form-select"
                            name="country"
                            value={profile.country || ""}
                            onChange={handleCountryChange}
                            disabled={!edit}
                        >
                            <option value="">انتخاب کنید</option>
                            {countries.map(c => (
                                <option key={c.code} value={c.name}>{c.name}</option>
                            ))}
                        </select>
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
                            {provinces.map(p => (
                                <option key={p} value={p}>{p}</option>
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
                            {cities.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-12 mb-3">
                        <label className="form-label">Address</label>
                        <input
                            className="form-control"
                            name="address"
                            value={profile.address}
                            onChange={handleChange}
                            disabled={!edit}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Post Code</label>
                        <input
                            className="form-control"
                            name="postCode"
                            value={profile.postCode}
                            onChange={handleChange}
                            disabled={!edit}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Mobile</label>
                        <div className="input-group">
                            <input
                                className="form-control"
                                name="mobile"
                                value={profile.mobile}
                                onChange={handleChange}
                                disabled={!edit || profile.smsSent}
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
                                    value={profile.enteredCode}
                                    onChange={e => setProfile(prev => ({ ...prev, enteredCode: e.target.value }))}
                                    style={{ width: 120, display: "inline-block" }}
                                />
                                <button
                                    type="button"
                                    className="btn btn-success ms-2"
                                    onClick={handleVerifyCode}
                                >
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
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => setEdit(true)}
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <>
                            <button type="submit" className="btn btn-success me-2">Save</button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setEdit(false)}
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
}
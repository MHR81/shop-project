import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProfile } from "../../api/auth";
import Sidebar from "./Sidebar";
import Profile from "./Profile";
import CartTab from "./CartTab";
import Orders from "./Orders";
import ChangePassword from "./ChangePassword";
import UserTickets from "./UserTickets";

const initialProfile = {
    name: "",
    lastName: "",
    username: "",
    email: "",
    province: "",
    city: "",
    address: "",
    postCode: "",
    mobile: "",
    mobileVerified: false,
    smsSent: false,
    smsCode: "",
    enteredCode: ""
};

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState("profile");
    const [profile, setProfile] = useState(initialProfile);
    const [edit, setEdit] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            if (user && user.token) {
                try {
                    const data = await getProfile(user.token);
                    setProfile(prev => ({ ...prev, ...data }));
                } catch (err) {
                    // handle error (e.g. show toast)
                }
            }
        };
        fetchProfile();
        // فقط زمانی که یوزر تغییر کند، حالت ویرایش را false کن
        // نه هر بار رندر یا سوییچ تب
        setEdit(false);
    }, [user]);

    return (
        <div className="container my-5 user-dashboard">
            <div className="row">
                <div className="col-md-3 mb-4 mb-md-0">
                    <Sidebar activeTab={activeTab} setActiveTab={tab => {
                        setActiveTab(tab);
                        if (tab !== "profile") setEdit(false);
                    }} />
                </div>
                <div className="col-md-9">
                    <div className="dashboard-card card shadow-sm rounded-3">
                        <div className="card-body ">
                            <div style={{ display: activeTab === "profile" ? "block" : "none" }}>
                                <Profile profile={profile} setProfile={setProfile} edit={edit} setEdit={setEdit} />
                            </div>
                            <div style={{ display: activeTab === "cart" ? "block" : "none" }}>
                                <CartTab />
                            </div>
                            <div style={{ display: activeTab === "orders" ? "block" : "none" }}>
                                <Orders />
                            </div>
                            <div style={{ display: activeTab === "changePassword" ? "block" : "none" }}>
                                <ChangePassword />
                            </div>
                            <div style={{ display: activeTab === "tickets" ? "block" : "none" }}>
                                <UserTickets />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProfile } from "../../api/auth";
import Sidebar from "./Sidebar";
import Profile from "./UserProfile";
import CartTab from "./CartTab";
import Orders from "./Orders";
import ChangePassword from "./ChangePassword";
import UserTickets from "./UserTickets";

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState("profile");
    const [profile, setProfile] = useState(null);
    const [edit, setEdit] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            if (user?.token) {
                try {
                    const data = await getProfile(user.token);
                    setProfile(data || {}); // حتی اگه null باشه -> {}
                } catch (err) {
                    // TODO: هندل ارور (toast یا پیام خطا)
                }
            }
        };
        fetchProfile();
        setEdit(false);
    }, [user]);

    return (
        <div className="container my-5 user-dashboard">
            <div className="row">
                <div className="col-md-3 mb-4 mb-md-0">
                    <Sidebar
                        activeTab={activeTab}
                        setActiveTab={(tab) => {
                            setActiveTab(tab);
                            if (tab !== "profile") setEdit(false);
                        }}
                    />
                </div>
                <div className="col-md-9">
                    <div className="card shadow-sm rounded-3 ">
                        <div className="card-body">
                            {activeTab === "profile" && profile && (
                                <Profile
                                    profile={profile}
                                    setProfile={setProfile}
                                    edit={edit}
                                    setEdit={setEdit}
                                />
                            )}
                            {activeTab === "cart" && <CartTab />}
                            {activeTab === "orders" && <Orders />}
                            {activeTab === "changePassword" && <ChangePassword />}
                            {activeTab === "tickets" && <UserTickets />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

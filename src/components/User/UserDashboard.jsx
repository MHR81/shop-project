import { useState } from "react";
import Sidebar from "./Sidebar";
import Profile from "./Profile";
import CartTab from "./CartTab";
import Orders from "./Orders";
import ChangePassword from "./ChangePassword";

const initialProfile = {
    name: "John",
    lastName: "Doe",
    username: "johndoe",
    email: "john@example.com",
    province: "",
    city: "",
    address: "",
    postCode: "",
    mobile: "09121234567",
    mobileVerified: true,
    smsSent: false,
    smsCode: "",
    enteredCode: ""
};

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState("profile");
    const [profile, setProfile] = useState(initialProfile);
    const [edit, setEdit] = useState(false);

    return (
        <div className="container my-5 user-dashboard">
            <div className="row">
                <div className="col-md-3 mb-4 mb-md-0">
                    <Sidebar activeTab={activeTab} setActiveTab={tab => {
                        setActiveTab(tab);
                        if (tab !== "profile") setEdit(false); // خروج از حالت ویرایش هنگام تعویض تب
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

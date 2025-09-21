import React from "react";
import PageTransition from "../components/common/PageTransition";
import Breadcrumb from "../components/common/Breadcrumb.jsx";
import SupportDashboard from "../components/Support/SupportDashboard.jsx";
export default function Support() {
    const breadcrumbItems = [
        { label: "Home", to: "/" },
        { label: "Support", active: true }
    ];
    return (
        <PageTransition>
            <div className="container">
                <Breadcrumb items={breadcrumbItems} />
                <h1 className="fw-bold fs-3 text">
                    <i className="bi bi-headset text-warning"></i> Support Dashboard
                </h1>
                <SupportDashboard />
            </div>
        </PageTransition>
    );
}

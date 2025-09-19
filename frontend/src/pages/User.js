import PageTransition from "../components/common/PageTransition";
import Breadcrumb from "../components/common/Breadcrumb.jsx";
import UserDashboard from "../components/User/UserDashboard.jsx"

export default function User() {
    const breadcrumbItems = [
        { label: "Home", to: "/" },
        { label: "User", active: true }
    ];

    return (
        <PageTransition>
            <div className="container">
                <Breadcrumb items={breadcrumbItems} />
                <h1 className="fw-bold fs-3 text">
                    <i className="bi bi-person text-danger"></i> User Dashboard
                </h1>
            </div>
            <div className="container">
                <UserDashboard />
            </div>
        </PageTransition>
    );
}
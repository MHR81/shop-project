import PageTransition from "../components/common/PageTransition";
import Breadcrumb from "../components/common/Breadcrumb.jsx";
import AdminDashboard from "../components/Admin/AdminDashboard.jsx"

export default function Admin() {
    const breadcrumbItems = [
        { label: "Home", to: "/" },
        { label: "Admin", active: true }
    ];
    return (
        <PageTransition>
            <div className="container">
                <Breadcrumb items={breadcrumbItems} />
                <h1 className="fw-bold fs-3 text">
                    <i className="bi bi-shield-lock text-danger"></i> Admin Dashboard
                </h1>
                <AdminDashboard />
            </div>
        </PageTransition>
    );
}

import PageTransition from "../components/common/PageTransition";
import Breadcrumb from "../components/common/Breadcrumb.jsx";
import UserDashboard from "../components/User/UserDashboard.jsx";
import { useTranslation } from "react-i18next";

export default function User() {
    const { t } = useTranslation();
    const breadcrumbItems = [
        { label: t("home"), to: "/" },
        { label: t("user"), active: true }
    ];

    return (
        <PageTransition>
            <div className="container">
                <Breadcrumb items={breadcrumbItems} />
                <h1 className="fw-bold fs-3 text">
                    <i className="bi bi-person text-danger"></i> {t("user_dashboard")}
                </h1>
            </div>
            <div className="container">
                <UserDashboard />
            </div>
        </PageTransition>
    );
}
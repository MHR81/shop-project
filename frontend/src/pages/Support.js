import PageTransition from "../components/common/PageTransition";
import Breadcrumb from "../components/common/Breadcrumb.jsx";
import SupportDashboard from "../components/Support/SupportDashboard.jsx";
import { useTranslation } from "react-i18next";

export default function Support() {
    const { t } = useTranslation();
    const breadcrumbItems = [
        { label: t("home"), to: "/" },
        { label: t("support"), active: true }
    ];
    return (
        <PageTransition>
            <div className="container">
                <Breadcrumb items={breadcrumbItems} />
                <h1 className="fw-bold fs-3 text">
                    <i className="bi bi-headset text-warning"></i> {t("support_dashboard")}
                </h1>
                <SupportDashboard />
            </div>
        </PageTransition>
    );
}

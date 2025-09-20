import { useTranslation } from "react-i18next";

export default function Loading({ height = "auto" }) {
    const { t } = useTranslation();
    return (
        <div className="loading-container d-flex justify-content-center align-items-center" style={{ minHeight: height }}>
            <div className="loading-spinner" role="status">
                <span className="visually-hidden">{t("loading")}</span>
            </div>
        </div>
    );
}

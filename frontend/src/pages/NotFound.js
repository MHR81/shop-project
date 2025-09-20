import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFound() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <>
            <div className="notfound-container d-flex flex-column justify-content-center align-items-center text-center vh-100">
                <h1 className="display-1 fw-bold text-danger">404</h1>
                <h2 className="mb-3">{t("404_title")}</h2>
                <p className="lead mb-4">
                    {t("404_message")}
                </p>
                <button
                    className="btn btn-outline-danger btn-lg shadow-sm"
                    onClick={() => navigate(-1)}
                >
                    {t("404_back")}
                </button>
                <div className="fs-1 mt-4">🚧</div>
            </div>
        </>
    )
}

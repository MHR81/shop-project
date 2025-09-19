import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="notfound-container d-flex flex-column justify-content-center align-items-center text-center vh-100">
            <h1 className="display-1 fw-bold text-danger">404</h1>
            <h2 className="mb-3">صفحه پیدا نشد!</h2>
            <p className="lead mb-4">
                متاسفیم، صفحه‌ای که دنبال آن بودید پیدا نشد یا حذف شده است.
            </p>
            <button
                className="btn btn-outline-danger btn-lg shadow-sm"
                onClick={() => navigate(-1)}
            >
                بازگشت به صفحه قبلی
            </button>
            <div className="fs-1 mt-4">🚧</div>
        </div>
    )
}

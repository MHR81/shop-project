import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();
    return (
        <>
            <div className="notfound-container d-flex flex-column justify-content-center align-items-center text-center vh-100">
                <h1 className="display-1 fw-bold text-danger">404</h1>
                <h2 className="mb-3">Page Not Found!</h2>
                <p className="lead mb-4">
                    Sorry, the page you were looking for was not found or has been removed.
                </p>
                <button
                    className="btn btn-outline-danger btn-lg shadow-sm"
                    onClick={() => navigate(-1)}
                >
                    Back to Previous Page
                </button>
                <div className="fs-1 mt-4">🚧</div>
            </div>
        </>
    );
}

export default function Loading({ height = "auto" }) {
    // Removed t from useTranslation
    return (
        <div className="loading-container d-flex justify-content-center align-items-center" style={{ minHeight: height }}>
            <div className="loading-spinner" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}

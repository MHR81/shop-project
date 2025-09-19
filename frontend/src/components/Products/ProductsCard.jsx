import { Link } from "react-router-dom";

export default function ProductsCard({ id, Image, Title, Rate, Price }) {
    return (
        <div className="card products-card shadow-sm border-0 h-100">
            <div className="ratio ratio-4x3">
                <img
                    src={Image}
                    className="card-img-top object-fit-contain p-3"
                    alt={Title}
                    style={{ maxHeight: "200px" }}
                />
            </div>
            <div className="card-body d-flex flex-column">
                <h6 className="card-title text-center mb-3 text-truncate" title={Title}>{Title}</h6>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-warning text-dark">
                        <i className="bi bi-star-fill me-1"></i>{Rate ?? "-"}
                    </span>
                    <span className="fw-bold text-success">{Price}$</span>
                </div>
                <Link
                    to={`/product/${id}`}
                    className="btn btn-outline-danger mt-auto w-100"
                >
                    View Product
                </Link>
            </div>
        </div>
    );
}
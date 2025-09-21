import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ProductsCard({ id, Image, Title, Description, Price, CountInStock, Category }) {
    const { t } = useTranslation();
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
                <h6 className="card-title text-center mb-2 text-truncate" title={Title}>{Title}</h6>
                {Category && <div className="text-center text-secondary small mb-2">{t("category")}: {Category}</div>}
                <div className="mb-2 text-truncate text-muted" style={{ fontSize: 13 }}>{Description}</div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold text-success">${Price}</span>
                    <span className={`badge ${CountInStock > 0 ? "bg-success" : "bg-danger"}`}>
                        {CountInStock > 0 ? `${t("in_stock")} (${CountInStock})` : t("out_of_stock")}
                    </span>
                </div>
                <Link
                    to={`/product/${id}`}
                    className="btn btn-outline-danger mt-auto w-100"
                >
                    {t("view_product")}
                </Link>
                <button
                    className="btn btn-danger mt-2 w-100"
                    disabled={CountInStock === 0}
                    style={{ opacity: CountInStock === 0 ? 0.6 : 1 }}
                >
                    {CountInStock === 0 ? t("out_of_stock") : t("add_to_cart")}
                </button>
            </div>
        </div>
    );
}
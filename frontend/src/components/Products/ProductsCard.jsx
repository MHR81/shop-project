import { Link } from "react-router-dom";
import { useState } from "react";

export default function ProductsCard({ id, Image, Title, Description, Price, CountInStock, Category }) {
    // Removed t from useTranslation
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        if (CountInStock === 0) return;
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const productForCart = {
            id,
            name: Title,
            title: Title,
            images: [Image],
            image: Image,
            price: Price,
            countInStock: CountInStock,
            category: Category,
            quantity: 1
        };
        const existing = cart.find(item => item.id === id);
        if (existing) {
            if (existing.quantity < CountInStock) {
                cart = cart.map(item =>
                    item.id === id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
        } else {
            cart.push(productForCart);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
    };

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
                {Category && <div className="text-center text-secondary small mb-2">Category: {Category}</div>}
                <div className="mb-2 text-truncate text-muted" style={{ fontSize: 13 }}>{Description}</div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold text-success">${Price}</span>
                    <span className={`badge ${CountInStock > 0 ? "bg-success" : "bg-danger"}`}>
                        {CountInStock > 0 ? `In stock (${CountInStock})` : "Out of stock"}
                    </span>
                </div>
                <Link
                    to={`/product/${id}`}
                    className="btn btn-outline-danger mt-auto w-100"
                >
                    View Product
                </Link>
                <button
                    className="btn btn-danger mt-2 w-100"
                    disabled={CountInStock === 0 || added}
                    style={{ opacity: CountInStock === 0 ? 0.6 : 1 }}
                    onClick={handleAddToCart}
                >
                    {CountInStock === 0 ? "Out of stock" : added ? "Added!" : "Add to Cart"}
                </button>
            </div>
        </div>
    );
}
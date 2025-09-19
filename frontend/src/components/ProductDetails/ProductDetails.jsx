import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../common/Loading.jsx";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        fetch(`https://fakestoreapi.com/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const handleAddToCart = () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            cart = cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    if (loading) {
        return <Loading height="300px" />;
    }

    if (!product) {
        return <div className="text-center text-danger my-5">محصول پیدا نشد!</div>;
    }

    return (
        <div className="products-card container my-5 shadow-lg rounded">
            <div className="row align-items-center py-4">
                <div className="col-md-5 text-center mb-4 mb-md-0">
                    <img src={product.image} alt={product.title} className="img-fluid" style={{ maxHeight: "350px" }} />
                </div>
                <div className="col-md-7">
                    <h2 className="fw-bold mb-3">{product.title}</h2>
                    <p className="mb-2">
                        <span className="badge bg-secondary fs-6">
                            {product.category?.charAt(0).toUpperCase() + product.category?.slice(1)}
                        </span>
                    </p>
                    <p className="mb-3">{product.description}</p>
                    <div className="mb-3">
                        <span className="badge bg-warning text-dark me-2">
                            <i className="bi bi-star-fill"></i> {product.rating?.rate ?? "-"}
                        </span>
                        <span className="fw-bold text-success fs-5">{product.price}$</span>
                    </div>
                    <button
                        className="btn btn-danger px-4"
                        onClick={handleAddToCart}
                        disabled={added}
                    >
                        {added ? "Added!" : "Add to Cart"}
                    </button>
                </div>
            </div>
        </div>
    );
}
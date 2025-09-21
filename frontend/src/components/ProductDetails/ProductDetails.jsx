import { useEffect, useState } from "react";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import Loading from "../common/Loading.jsx";

export default function ProductDetails() {
    const [showModal, setShowModal] = useState(false);
    const [currentImg, setCurrentImg] = useState(0);
    const sliderRef = useRef(null);
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const handleAddToCart = () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        // Prepare product info for cart (sync with backend model)
        const productForCart = {
            id: product._id,
            name: product.name,
            title: product.name,
            images: product.images,
            image: product.image,
            price: product.price,
            countInStock: product.countInStock,
            category: product.category,
            quantity: 1
        };
        const existing = cart.find(item => item.id === productForCart.id);
        if (existing) {
            cart = cart.map(item =>
                item.id === productForCart.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            cart.push(productForCart);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    if (loading) {
        return <Loading height="300px" />;
    }

    if (!product) {
        return <div className="text-center text-danger my-5">Product not found!</div>;
    }

    return (
        <>
            {/* Fullscreen Modal */}
            {showModal && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75"
                    style={{ zIndex: 9999 }}
                    onClick={() => setShowModal(false)}
                >
                    {/* Previous Button */}
                    {Array.isArray(product.images) && product.images.length > 1 && (
                        <button
                            className="btn btn-light position-absolute top-50 start-0 translate-middle-y"
                            style={{ zIndex: 10000, borderRadius: "50%", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
                            onClick={e => {
                                e.stopPropagation();
                                setCurrentImg((currentImg - 1 + product.images.length) % product.images.length);
                            }}
                            aria-label="قبلی"
                        >
                            <i className="bi bi-chevron-left fs-2"></i>
                        </button>
                    )}
                    {/* Next Button */}
                    {Array.isArray(product.images) && product.images.length > 1 && (
                        <button
                            className="btn btn-light position-absolute top-50 end-0 translate-middle-y"
                            style={{ zIndex: 10000, borderRadius: "50%", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
                            onClick={e => {
                                e.stopPropagation();
                                setCurrentImg((currentImg + 1) % product.images.length);
                            }}
                            aria-label="بعدی"
                        >
                            <i className="bi bi-chevron-right fs-2"></i>
                        </button>
                    )}
                    <button
                        className="btn btn-light position-absolute top-0 end-0 m-4"
                        style={{ borderRadius: "50%", fontSize: "1.5rem" }}
                        onClick={() => setShowModal(false)}
                    >
                        &times;
                    </button>
                </div>
            )}
            <div className="products-card container my-5 shadow-lg rounded">
                <div className="row align-items-center py-4">
                    <div className="col-md-5 text-center mb-4 mb-md-0">
                        {Array.isArray(product.images) && product.images.length > 0 ? (
                            <div className="position-relative" style={{ maxWidth: "350px", margin: "0 auto" }}>
                                <img
                                    ref={sliderRef}
                                    src={product.images[currentImg]}
                                    alt={product.name + " " + (currentImg + 1)}
                                    className="img-fluid"
                                    style={{ maxHeight: "350px", borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.12)", cursor: "pointer" }}
                                    onClick={() => setShowModal(true)}
                                />
                                {/* Navigation Buttons */}
                                {product.images.length > 1 && (
                                    <>
                                        <button
                                            className="btn btn-light position-absolute top-50 start-0 translate-middle-y"
                                            style={{ zIndex: 2, borderRadius: "50%", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
                                            onClick={() => setCurrentImg((currentImg - 1 + product.images.length) % product.images.length)}
                                            aria-label="قبلی"
                                        >
                                            <i className="bi bi-chevron-left fs-4"></i>
                                        </button>
                                        <button
                                            className="btn btn-light position-absolute top-50 end-0 translate-middle-y"
                                            style={{ zIndex: 2, borderRadius: "50%", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
                                            onClick={() => setCurrentImg((currentImg + 1) % product.images.length)}
                                            aria-label="بعدی"
                                        >
                                            <i className="bi bi-chevron-right fs-4"></i>
                                        </button>
                                    </>
                                )}
                                {/* Thumbnails */}
                                <div className="d-flex justify-content-center mt-3">
                                    {product.images.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={product.name + " thumbnail " + (idx + 1)}
                                            className={`img-thumbnail mx-1 ${currentImg === idx ? "border border-danger" : ""}`}
                                            style={{ width: "48px", height: "48px", objectFit: "cover", cursor: "pointer", borderRadius: "8px" }}
                                            onClick={() => setCurrentImg(idx)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <img src={product.image} alt={product.name} className="img-fluid" style={{ maxHeight: "350px", cursor: "pointer" }} onClick={() => setShowModal(true)} />
                        )}
                    </div>
                    <div className="col-md-7">
                        <h2 className="fw-bold mb-3">{product.name}</h2>
                        <p className="mb-2">
                            <span className="badge bg-secondary fs-6">
                                {product.category && product.category.name
                                    ? product.category.name.charAt(0).toUpperCase() + product.category.name.slice(1)
                                    : "No category"}
                            </span>
                        </p>
                        <p className="mb-3">{product.description}</p>
                        <div className="mb-3">
                            <span className={`badge ${product.countInStock > 0 ? "bg-success" : "bg-danger"} me-2`}>
                                {product.countInStock > 0 ? `In stock (${product.countInStock})` : "Out of stock"}
                            </span>
                            <span className="fw-bold text-success fs-5">${product.price}</span>
                        </div>
                        <button
                            className="btn btn-danger px-4"
                            onClick={handleAddToCart}
                            disabled={added || product.countInStock === 0}
                        >
                            {product.countInStock === 0 ? "ناموجود" : added ? "Added!" : "Add to Cart"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
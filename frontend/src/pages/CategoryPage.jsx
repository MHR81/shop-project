
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductsByCategory } from "../api/getProductsByCategory";
import Loading from "../components/common/Loading";

export default function CategoryPage() {
    const { name } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        getProductsByCategory(name)
            .then(data => setProducts(data))
            .catch(() => setError("خطا در دریافت محصولات این کتگوری"))
            .finally(() => setLoading(false));
    }, [name]);

    if (loading) return <Loading />;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container my-4">
            <h2 className="mb-4">محصولات کتگوری: {name}</h2>
            {products.length === 0 ? (
                <div className="alert alert-warning">محصولی در این کتگوری وجود ندارد.</div>
            ) : (
                <div className="row">
                    {products.map(product => (
                        <div key={product._id} className="col-md-4 mb-3">
                            <div className="card h-100">
                                <img src={product.image} className="card-img-top" alt={product.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text">{product.description}</p>
                                    <span className="badge bg-success">{product.price} تومان</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

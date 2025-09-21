

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductsByCategory } from "../api/getProductsByCategory";
import Loading from "../components/common/Loading";
import ProductsCard from "../components/Products/ProductsCard";
import { FaLayerGroup, FaBoxOpen } from "react-icons/fa";


export default function CategoryPage() {
    const { name } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [categoryDesc, setCategoryDesc] = useState("");


    useEffect(() => {
        setLoading(true);
        setError("");
        getProductsByCategory(name)
            .then(data => {
                setProducts(data);
                // اگر محصولی وجود دارد، توضیحات کتگوری را از اولین محصول بگیر
                if (data.length > 0 && data[0].category && data[0].category.description) {
                    setCategoryDesc(data[0].category.description);
                } else {
                    setCategoryDesc("");
                }
            })
            .catch(() => setError("Error fetching products for this category"))
            .finally(() => setLoading(false));
    }, [name]);


    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "350px" }}>
            <Loading height="120px" />
        </div>
    );
    if (error) return (
        <div className="alert alert-danger text-center my-5 shadow-lg rounded-4 p-4">
            <FaBoxOpen size={32} className="mb-2 text-danger" />
            <div>{error}</div>
        </div>
    );


    return (
        <div className="container py-4">
            <div className="category-page-title category-header shadow-lg rounded-4 p-4 mb-4 d-flex flex-column flex-md-row align-items-center justify-content-between">
                <div className="d-flex align-items-center mb-3 mb-md-0">
                    <FaLayerGroup size={40} className="me-3" />
                    <div>
                        <h2 className="fw-bold mb-1" style={{ letterSpacing: 1 }}>{name}</h2>
                        {categoryDesc && <div className="text-light small mt-1">{categoryDesc}</div>}
                    </div>
                </div>
                <div className="d-flex flex-column align-items-end">
                    <span className="badge category-page-quantity fs-6 px-3 py-2 shadow-sm">Products: {products.length}</span>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="alert alert-warning text-center my-5 shadow rounded-4 p-4">
                    <FaBoxOpen size={32} className="mb-2 text-warning" />
                    <div>No products found in this category.</div>
                </div>
            ) : (
                <div className="row g-4">
                    {products.map(product => (
                        <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <ProductsCard
                                id={product._id}
                                Image={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : product.image}
                                Title={product.name}
                                Description={product.description}
                                Price={product.price}
                                CountInStock={product.countInStock}
                                Category={name}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

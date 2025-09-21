import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductsCard from './ProductsCard.jsx';
import Loading from "../common/Loading.jsx";
import { getAllProducts } from "../../api/products";

export default function Products({ filter = {} }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const productsPerPage = 4;
    const location = useLocation();

    // Merge filter prop and search from URL
    const mergedFilter = React.useMemo(() => {
        const params = new URLSearchParams(location.search);
        const search = params.get('search') || '';
        return {
            ...filter,
            ...(search ? { search } : {})
        };
    }, [filter, location.search]);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            getAllProducts(mergedFilter)
                .then((data) => {
                    setProducts(data);
                })
                .catch((err) => console.error(err))
                .finally(() => {
                    setLoading(false);
                });
        }, 300);
        return () => {
            clearTimeout(timer);
        };
    }, [mergedFilter, location.search]);

    // Pagination logic
    const totalPages = Math.ceil(products.length / productsPerPage);
    const paginatedProducts = products.slice((page - 1) * productsPerPage, page * productsPerPage);

    return (
        <div className="container">
            {loading ? (
                <Loading height="300px" />
            ) : products.length === 0 ? (
                <div className="alert alert-warning text-center my-5">No products found</div>
            ) : (
                <>
                    <div className="row">
                        {paginatedProducts.map(product => (
                            <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3 my-3">
                                <ProductsCard
                                    id={product._id}
                                    Image={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : product.image}
                                    Title={product.name}
                                    Description={product.description}
                                    Price={product.price}
                                    CountInStock={product.countInStock}
                                    Category={product.category?.name}
                                />
                            </div>
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <nav className="d-flex justify-content-center my-4">
                            <ul className="pagination" style={{ gap: 8 }}>
                                <li className={`page-item${page === 1 ? " disabled" : ""}`} style={{ borderRadius: 12, overflow: 'hidden' }}>
                                    <button className="page-link bg-transparent text-danger border-0 fw-bold" style={{ borderRadius: 12, minWidth: 40, height: 40 }} onClick={() => setPage(page - 1)}>&laquo;</button>
                                </li>
                                {[...Array(totalPages)].map((_, idx) => (
                                    <li key={idx} className={`page-item${page === idx + 1 ? " active" : ""}`} style={{ borderRadius: 12, overflow: 'hidden' }}>
                                        <button
                                            className={`page-link border-0 fw-bold ${page === idx + 1 ? 'bg-danger text-white shadow' : 'bg-light text-danger'}`}
                                            style={{ borderRadius: 12, minWidth: 40, height: 40, transition: 'all 0.2s', fontSize: 18 }}
                                            onClick={() => setPage(idx + 1)}
                                        >
                                            {idx + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item${page === totalPages ? " disabled" : ""}`} style={{ borderRadius: 12, overflow: 'hidden' }}>
                                    <button className="page-link bg-transparent text-danger border-0 fw-bold" style={{ borderRadius: 12, minWidth: 40, height: 40 }} onClick={() => setPage(page + 1)}>&raquo;</button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </>
            )}
        </div>
    );
}
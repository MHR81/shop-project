import ProductsCard from './ProductsCard.jsx';
import { useEffect, useState } from "react";
import Loading from "../common/Loading.jsx";
import { getAllProducts } from "../../api/products";

export default function Products({ filter = {} }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            getAllProducts(filter)
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
    }, [filter]);

    return (
        <div className="container">
            {loading ? (
                <Loading height="300px" />
            ) : products.length === 0 ? (
                <div className="alert alert-warning text-center my-5">No products found</div>
            ) : (
                <div className="row">
                    {products.map(product => (
                        <div key={product._id} className="col col-sm-6 col-md-4 col-lg-3 my-3">
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
            )}
        </div>
    );
}
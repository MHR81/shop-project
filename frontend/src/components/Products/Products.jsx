import ProductsCard from './ProductsCard.jsx';
import { useEffect, useState } from "react";
import Loading from "../common/Loading.jsx";
import { getAllProducts } from "../../api/products";

export default function Products({ filter = {} }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getAllProducts(filter)
            .then((data) => setProducts(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [filter]);

    return (
        <div className="container">
            {loading ? (
                <Loading height="300px" />
            ) : (
                <div className="row">
                    {products.map(product => (
                        <div key={product.id} className="col-12 col-sm-6 col-md-4 my-3">
                            <ProductsCard
                                id={product.id}
                                Image={product.image}
                                Title={product.title}
                                Rate={product.rating?.rate}
                                Price={product.price}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
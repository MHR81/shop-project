import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductsCard from "../components/Products/ProductsCard";
import Loading from "../components/common/Loading";

export default function CategoryPage() {
  const { name } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/categories/${encodeURIComponent(name)}`)
      .then((res) => {
        setCategory(res.data.category);
        setProducts(res.data.products);
        setError("");
      })
      .catch((err) => {
        setError(err?.response?.data?.message || "Category not found");
        setCategory(null);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [name]);

  return (
    <div className="container my-5">
      {loading ? (
        <Loading height="300px" />
      ) : error ? (
        <div className="alert alert-danger text-center my-5">{error}</div>
      ) : (
        <>
          <div className="category-header text-center mb-4">
            <h2 className="fw-bold text-danger">{category?.name}</h2>
            <p className="text-muted">{category?.description}</p>
          </div>
          <div className="row">
            {products.length === 0 ? (
              <div className="alert alert-warning text-center my-5">No products found in this category</div>
            ) : (
              products.map((product) => (
                <div key={product._id} className="col-12 col-sm-6 col-md-4 my-3">
                  <ProductsCard
                    id={product._id}
                    Image={product.image}
                    Title={product.name}
                    Description={product.description}
                    Price={product.price}
                    CountInStock={product.countInStock}
                    Category={category?.name}
                  />
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

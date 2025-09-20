import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../common/Loading";
import { getCategories } from "../../api/categories";

export default function Category() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCategories()
            .then((cats) => {
                setCategories(cats);
                setLoading(false);
            })
            .catch(() => {
                setCategories([]);
                setLoading(false);
            });
    }, []);

    return (
            <div className="categories container d-flex justify-content-center flex-column rounded">
                <Link to="/categories" className="text-center text-danger fw-bold fs-4 mt-4 text-decoration-none">Categories</Link>
                <hr className="w-100 mx-auto border-1 border-danger" />
                <div className="d-flex justify-content-start flex-column pb-3">
                    {loading ? (
                        <Loading height="300px" />
                    ) : (
                        categories.map((cat) => (
                            <div className="p-2" key={cat._id}>
                                <Link
                                    className="text-decoration-none fs-6 category-link"
                                    to={`/categories/${encodeURIComponent(cat.name)}`}
                                >
                                    <i className="bi bi-chevron-right text-danger"></i> {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>
    );
}

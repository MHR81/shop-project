import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../common/Loading";
import { getCategories  } from "../../api/categories";

export default function Categories() {
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
        <div className="categories container my-5 rounded">
            <h3 className="text-center text-danger fw-bold fs-3 mb-4">Categories</h3>
            {loading ? (
                <Loading height="300px" />
            ) : (
                categories.map((cat) => (
                    <div className="p-2" key={cat}>
                        <Link
                            className="text-decoration-none fs-6 category-link"
                            to={`/categories/${encodeURIComponent(cat)}`}
                        >
                            <i className="bi bi-chevron-right text-danger"></i> {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </Link>
                    </div>
                ))
            )}
        </div>
    )
}
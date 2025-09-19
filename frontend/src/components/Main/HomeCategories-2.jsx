import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../common/Loading";
import { getCategories } from "../../api/categories";

const categoryIcons = {
    "jewelery": "bi-gem",
    "electronics": "bi-phone",
    "men's clothing": "bi-person",
    "women's clothing": "bi-person-fill",
};

export default function HomeCategories2() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container-fluid rounded-3 py-4">
            <div className="row g-4">
                {categories.map(cat => (
                    <div key={cat} className="col-6 col-md-3 d-flex justify-content-center">
                        <Link
                            className="btn btn-outline-danger fw-bold py-3 category-link-main shadow-sm text-truncate"
                            to={`/category/${encodeURIComponent(cat)}`}
                        >
                            <i className={`bi ${categoryIcons[cat]}`}> </i>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

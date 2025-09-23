import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NavbarSearch({ theme }) {
    // Removed t from useTranslation
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const darkMode = theme === "dark";

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/products?search=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form className={`navbar-search position-relative d-flex align-items-center w-50 ${darkMode ? "search-dark" : "search-light"}`} onSubmit={handleSubmit}>
            <input
                type="text"
                className={`form-control nav-search rounded-pill ps-4 py-2 shadow-lg ${darkMode ? "bg-dark-2 text-light border-0" : "bg-light text-dark border-0"}`}
                placeholder="Search..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{ fontSize: 16, transition: "all 0.2s" }}
            />
            <button
                type="submit"
                className="btn position-absolute end-0 top-50 translate-middle-y me-2 p-0 border-0 bg-transparent"
                style={{ height: 32, width: 32 }}
                tabIndex={-1}
            >
                <i className="bi bi-search fs-5 text-danger"></i>
            </button>
        </form>
    );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/AuthContext";

export default function NavbarSearch({ theme }) {
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
        <form className={`navbar-search d-flex align-items-center mx-2 ${darkMode ? "search-dark" : "search-light"}`} onSubmit={handleSubmit} style={{ minWidth: 180, flex: 1 }}>
            <input
                type="text"
                className={`form-control rounded-pill px-3 py-2 shadow-sm ${darkMode ? "bg-dark text-light border-0" : "bg-light text-dark border-0"}`}
                placeholder="Search products..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{ fontSize: 16, transition: "all 0.2s" }}
            />
            <button type="submit" className={`btn btn-danger rounded-circle ms-2 px-3 py-2 shadow-sm d-flex align-items-center justify-content-center`} style={{ height: 40 }}>
                <i className="bi bi-search fs-5"></i>
            </button>
        </form>
    );
}

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from '../../logo.png';
import Loading from "../common/Loading";
import { getCategories } from "../../api/categories";
import DarkModeToggle from './DarkModeToggle';
import NavbarSearch from "./NavbarSearch";

export default function Navbar({ theme, setTheme }) {
    // Convert theme string to boolean for DarkModeToggle
    const darkMode = theme === "dark";
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user, logoutUser } = useAuth();
    const token = user?.token;
        // نقش کاربر
        const role = user?.role || JSON.parse(localStorage.getItem("userInfo"))?.role || "user";

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

    const handleLogout = () => {
        logoutUser();
        navigate("/auth");
    };

    return (
        <nav className="navbar navbar-expand-md rounded-bottom-3 shadow-sm">
            <div className="container">
                <button
                    className="py-2 navbar-toggler"
                    type="button"
                    aria-label="Toggle navigation"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <span className="hamburger-icon"><i className="bi bi-list"></i></span>
                </button>

                {/* سرچ حرفه‌ای */}
                <div className="d-none d-md-flex flex-grow-1 justify-content-center">
                    <NavbarSearch theme={theme} />
                </div>

                <div className={`collapse navbar-collapse${mobileMenuOpen ? " show" : ""}`}>
                    <ul className="navbar-nav me-auto mb-2 mb-md-0 d-flex flex-column flex-md-row">

                        <li className="nav-item mx-2">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        {/* سرچ حرفه‌ای برای موبایل */}
                        <li className="nav-item d-md-none w-100 my-2">
                            <NavbarSearch theme={theme} />
                        </li>

                        {/* Products Dropdown */}
                        <li
                            className={`mx-2 nav-item dropdown${dropdownOpen ? " show" : ""}`}
                            onMouseEnter={() => setDropdownOpen(true)}
                            onMouseLeave={() => setDropdownOpen(false)}
                        >
                            <button
                                className="nav-link dropdown-toggle"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const menu = e.currentTarget.nextElementSibling;
                                    menu.classList.toggle("show");
                                }}
                            >
                                Products
                            </button>
                            <ul className={`categories dropdown-menu${dropdownOpen ? " show" : ""}`}>
                                <li>
                                    <Link className="dropdown-item fw-bold" to="/Products">
                                        All Products
                                    </Link>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                {loading ? (
                                    <Loading />
                                ) : (
                                    categories.map(cat => (
                                        <li key={cat._id}>
                                            <Link
                                                className="dropdown-item"
                                                to={`/category/${encodeURIComponent(cat.name)}`}
                                            >
                                                {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                                            </Link>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </li>

                        <li className="mx-2 nav-item">
                            <Link className="nav-link" to="/Cart">
                                <i className="bi bi-cart"></i>Cart
                            </Link>
                        </li>

                        {!token && (
                            <li className="mx-2 nav-item">
                                <Link className="nav-link" to="/Auth">
                                    <i className="bi bi-person-circle fs-6"></i> Login
                                </Link>
                            </li>
                        )}

                        {token && (
                            <>
                                <li className="nav-item mx-2">
                                    <Link
                                        className="nav-link"
                                        to={role === "admin" ? "/admin" : "/user"}
                                        title={role === "admin" ? "Admin Dashboard" : "User Profile"}
                                    >
                                        <i className="bi bi-person-circle fs-5"></i>
                                    </Link>
                                </li>
                                <li className="nav-item pe-3">
                                    <button
                                        className="btn-logout text-danger fw-bold my-2"
                                        onClick={handleLogout}
                                    >
                                        <i className="bi bi-box-arrow-right"></i> Logout
                                    </button>
                                </li>
                            </>
                        )}

                        {/* دکمه تغییر تم */}
                        <li className="nav-item mx-auto d-flex align-items-center">
                            <DarkModeToggle darkMode={darkMode} setDarkMode={dm => setTheme(dm ? "dark" : "light")} />
                        </li>

                    </ul>
                </div>

                <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
                    <span className="navbar-logo fw-bold fs-3">Logo</span>
                    <img src={logo} alt="Logo" className="d-none me-2 logo-img" />
                </Link>
            </div>
        </nav>
    );
}

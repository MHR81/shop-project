import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from '../../logo.png';
import { useTranslation } from "react-i18next";
import Loading from "../common/Loading";
import { getCategories } from "../../api/categories";
import DarkModeToggle from './DarkModeToggle';
import NavbarSearch from "./NavbarSearch";

export default function Navbar({ theme, setTheme }) {
    const { i18n } = useTranslation();
    const { t } = useTranslation();
    const [lang, setLang] = useState(i18n.language || "en");
    const handleLangChange = (lng) => {
        i18n.changeLanguage(lng);
        setLang(lng);
    };
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
        <nav className="navbar navbar-expand-lg rounded-bottom-3 shadow-sm">
            <div className="container">
                <div className="d-lg-none container-fluid d-flex justify-content-between">
                    <button
                        className="py-2 navbar-toggler"
                        type="button"
                        aria-label="Toggle navigation"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span className="hamburger-icon"><i className="bi bi-list"></i></span>
                    </button>
                    <div className={`justify-content-end`}>
                        <Link className=" navbar-brand fw-bold d-flex align-items-center" to="/">
                            <span className="navbar-logo fw-bold fs-3">Logo</span>
                            <img src={logo} alt="Logo" className="d-none me-2 logo-img" />
                        </Link>
                    </div>
                </div>

                <div className={`collapse navbar-collapse${mobileMenuOpen ? " show" : ""}`}>
                    <ul className="navbar-nav me-auto ms-2 mb-2 mb-lg-0 d-flex flex-column flex-lg-row">

                        <li className="nav-item mx-2">
                            <Link className="nav-link" to="/">{t("home")}</Link>
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
                                {t("products")}
                            </button>
                            <ul className={`categories dropdown-menu${dropdownOpen ? " show" : ""}`}>
                                <li>
                                    <Link className="dropdown-item fw-bold" to="/Products">
                                        {t("all-products")}
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
                                <i className="bi bi-cart"></i>{t("cart")}
                            </Link>
                        </li>

                        {!token && (
                            <li className="mx-2 nav-item">
                                <Link className="nav-link" to="/Auth">
                                    <i className="bi bi-person-circle fs-6"></i> {t("login")}
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
                                        <i className="bi bi-box-arrow-right"></i> {t("logout")}
                                    </button>
                                </li>
                            </>
                        )}

                        {/* دکمه تغییر تم */}
                        <li className="nav-item d-none d-lg-flex mx-auto d-flex align-items-center">
                            <DarkModeToggle darkMode={darkMode} setDarkMode={dm => setTheme(dm ? "dark" : "light")} />
                        </li>
                    </ul>


                    {/* سرچ حرفه‌ای */}
                    <div className=" d-none d-lg-flex flex-grow-1 justify-content-center">
                        <NavbarSearch theme={theme} />
                        <div className="ms-4 d-flex align-content-center">
                            <button
                                className={`btn btn-sm ${lang === "en" ? "btn-outline-primary" : "btn-outline-secondary"} mx-1`}
                                style={{ maxWidth: "30px", maxHeight: "30px" }}
                                onClick={() => handleLangChange("en")}
                            >
                                EN
                            </button>
                            <button
                                className={`btn btn-sm ${lang === "fa" ? "btn-outline-primary" : "btn-outline-secondary"} mx-1`}
                                style={{ maxWidth: "30px", maxHeight: "30px" }}
                                onClick={() => handleLangChange("fa")}
                            >
                                FA
                            </button>
                        </div>
                    </div>
                    {/* سرچ حرفه‌ای برای موبایل */}
                    <div className="d-lg-none d-flex justify-content-center">
                        <NavbarSearch theme={theme} />
                    </div>

                    <li className="row d-lg-none g-3 mt-3">
                        <div className="col d-flex justify-content-end">
                            <button
                                className={`btn btn-sm ${lang === "en" ? "btn-outline-primary" : "btn-outline-secondary"} mx-1`}
                                style={{ maxWidth: "30px", maxHeight: "30px" }}
                                onClick={() => handleLangChange("en")}
                            >
                                EN
                            </button>
                            <button
                                className={`btn btn-sm ${lang === "fa" ? "btn-outline-primary" : "btn-outline-secondary"} mx-1`}
                                style={{ maxWidth: "30px", maxHeight: "30px" }}
                                onClick={() => handleLangChange("fa")}
                            >
                                FA
                            </button>
                        </div>
                        <div className="col d-flex justify-content-start">
                            <DarkModeToggle darkMode={darkMode} setDarkMode={dm => setTheme(dm ? "dark" : "light")} />
                        </div>
                    </li>
                    <Link className="d-none d-lg-block navbar-brand fw-bold d-flex align-items-center" to="/">
                        <span className="navbar-logo fw-bold fs-3">Logo</span>
                        <img src={logo} alt="Logo" className="d-none me-2 logo-img" />
                    </Link>

                </div>

            </div>
        </nav>
    );
}

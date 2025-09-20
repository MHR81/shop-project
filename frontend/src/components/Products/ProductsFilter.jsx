import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getCategories } from "../../api/categories";

export default function ProductsFilter({ onFilter }) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [inStock, setInStock] = useState(false);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter({ category, minPrice, maxPrice, search, sort, inStock });
    };

    return (
        <div className="mb-4">
            <button
                type="button"
                className={`btn btn-outline-danger mb-2 fw-bold px-4 py-2 ${open ? "" : "collapsed"}`}
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
            >
                {open ? t("hide_product_filters") : t("show_product_filters")}
            </button>
            {open && (
                <form className="card shadow-sm p-3" onSubmit={handleSubmit}>
                    <div className="row g-3 align-items-center">
                        <div className="col-md-3">
                            <label className="form-label">{t("category")}</label>
                            <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                                <option value="">{t("all")}</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">{t("min_price")}</label>
                            <input type="number" className="form-control" value={minPrice} onChange={e => setMinPrice(e.target.value)} min="0" />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">{t("max_price")}</label>
                            <input type="number" className="form-control" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} min="0" />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">{t("search_placeholder")}</label>
                            <input type="text" className="form-control" value={search} onChange={e => setSearch(e.target.value)} placeholder={t("search_placeholder")} />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">{t("sort")}</label>
                            <select className="form-select" value={sort} onChange={e => setSort(e.target.value)}>
                                <option value="">{t("default")}</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="newest">Newest</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-check mt-3">
                        <input className="form-check-input" type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} id="inStockCheck" />
                        <label className="form-check-label" htmlFor="inStockCheck">{t("in_stock")}</label>
                    </div>
                    <button type="submit" className="btn btn-danger mt-3">{t("show_product_filters")}</button>
                </form>
            )}
        </div>
    );
}

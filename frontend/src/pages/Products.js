import React from "react";
import { useTranslation } from "react-i18next";
import PageTransition from "../components/common/PageTransition";
import Breadcrumb from "../components/common/Breadcrumb";
import Products from '../components/Products/Products.jsx';
import ProductsFilter from '../components/Products/ProductsFilter.jsx';
import Categories from '../components/Products/PCategories.jsx';

export default function ProductsPage() {
    const { t } = useTranslation();
    const breadcrumbItems = [
        { label: t("home"), to: "/" },
        { label: t("cart"), active: true }
    ];

    const [filter, setFilter] = React.useState({});
    return (
        <PageTransition>
            <div className="container">
                <Breadcrumb items={breadcrumbItems} />
            </div>
            <div className="container">
                <div className="products-card d-flex justify-content-center rounded my-3">
                    <h3 className="my-4 fw-bold">
                        <span className='fs-2'>{t("our_products")}</span>
                    </h3>
                </div>
                {/* فیلتر حرفه‌ای */}
                <ProductsFilter onFilter={setFilter} />
            </div>
            <div className='container d-xxl-none'>
                <Categories />
            </div>
            <div className='row my-4'>
                <div className='col'>
                    <Products filter={filter} />
                </div>
                <div className='container d-none d-xxl-block col-3'>
                    <div className="container my-4">
                        <Categories />
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
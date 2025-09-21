import React from "react";
import PageTransition from "../components/common/PageTransition";
import Breadcrumb from "../components/common/Breadcrumb";
import Products from '../components/Products/Products.jsx';
import ProductsFilter from '../components/Products/ProductsFilter.jsx';

export default function ProductsPage() {
    const breadcrumbItems = [
        { label: "Home", to: "/" },
        { label: "Products", active: true }
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
                        <span><span className='fs-2 text-danger'>Our</span> <span className="fs-1">Products</span></span>
                    </h3>
                </div>
                <ProductsFilter onFilter={setFilter} />
            </div>
            <Products filter={filter} />
        </PageTransition>
    );
}
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageTransition from "../components/common/PageTransition";
import Breadcrumb from "../components/common/Breadcrumb";
import ProductDetails from "../components/ProductDetails/ProductDetails";

export default function Product() {
    const { t } = useTranslation();
    const { id } = useParams();
    const [title, setTitle] = useState("");

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/products/${id}`)
            .then(res => res.json())
            .then(data => setTitle(data.name))
            .catch(() => setTitle(""));
    }, [id]);

    const breadcrumbItems = [
        { label: t("home"), to: "/" },
        { label: t("products"), to: "/Products" },
        { label: title ? title : t("product_not_found"), active: true }
    ];

    return (
        <PageTransition>
            <div className="container">
                <Breadcrumb items={breadcrumbItems} />
            </div>
            <ProductDetails />
        </PageTransition>
    );
}
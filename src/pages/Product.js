import Breadcrumb from "../components/common/Breadcrumb";
import ProductDetails from "../components/ProductDetails/ProductDetails";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Product() {
    const { id } = useParams();
    const [title, setTitle] = useState("");

    useEffect(() => {
        fetch(`https://fakestoreapi.com/products/${id}`)
            .then(res => res.json())
            .then(data => setTitle(data.title))
            .catch(() => setTitle(""));
    }, [id]);

    const breadcrumbItems = [
        { label: "Home", to: "/" },
        { label: "Products", to: "/Products" },
        { label: title ? title : "Product", active: true }
    ];

    return (
        <>
            <div className="container">
                <Breadcrumb items={breadcrumbItems} />
            </div>
            <ProductDetails />
        </>
    );
}
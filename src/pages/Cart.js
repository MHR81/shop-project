import Breadcrumb from "../components/common/Breadcrumb";
import CartItems from "../components/Cart/CartItems";
import { Link } from "react-router-dom";

export default function Cart() {
    const breadcrumbItems = [
        { label: "Home", to: "/" },
        { label: "Cart", active: true }
    ];

    return (
        <div className="container">
            <Breadcrumb items={breadcrumbItems} />
            <h1 className="fw-bold fs-3 text">
                <i className="bi bi-cart text-danger"></i> Cart
            </h1>
            <CartItems />
            <Link to="/products">
                <button className="btn btn-outline-danger">Back to Products</button>
            </Link>
        </div>
    );
}
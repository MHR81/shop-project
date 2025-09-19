import CartItems from "../Cart/CartItems";
import { Link } from "react-router-dom";

export default function CartTab() {
    return (
        <div>
            <h4 className="fw-bold mb-3"><span className="fs-4">My</span> <span className="text-danger fs-3">Cart</span></h4>
            <CartItems />
            <Link to="/products">
                <button className="btn btn-outline-danger">Back to Products</button>
            </Link>
        </div>
    );
}
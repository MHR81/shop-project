import CartItems from "../Cart/CartItems";
import { Link } from "react-router-dom";

export default function CartTab() {
    // Removed unused state and user after test order logic removal

    // Removed test order logic. Payment/order creation only via CartItems Proceed to Checkout button.

    return (
        <div>
            <h4 className="fw-bold mb-3"><span className="fs-4">My</span> <span className="text-danger fs-3">Cart</span></h4>
            <CartItems />
            <div className="d-flex gap-2 mt-3">
                <Link to="/products">
                    <button className="btn btn-outline-danger">Back to Products</button>
                </Link>
            </div>
            {/* Payment/order creation only via CartItems Proceed to Checkout button */}
        </div>
    );
}
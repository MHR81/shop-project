import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getProfile } from "../../api/auth";
import { createOrder } from "../../api/orders";

export default function CartItems() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    const handleRemove = (id) => {
        const newCart = cart.filter(item => item.id !== id);
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    const handleQuantityChange = (id, delta) => {
        const newCart = cart.map(item =>
            item.id === id
                ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                : item
        );
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = async () => {
        setMessage("");
        if (!user || !user.token) {
            setMessage("Please log in first.");
            navigate("/auth");
            return;
        }
        setLoading(true);
        try {
            // دریافت اطلاعات پروفایل
            const profile = await getProfile(user.token);
            if (!profile.address || !profile.city || !profile.province || !profile.postCode || !profile.mobile || profile.mobile.trim().length < 8) {
                setMessage("Please complete your address and mobile number in your profile first.");
                setLoading(false);
                setTimeout(() => {
                    navigate("/user");
                }, 1500);
                return;
            }
            // شبیه‌سازی انتقال به درگاه پرداخت (در پروژه واقعی اینجا به درگاه منتقل می‌شوید)
            // فرض: پرداخت موفق
            const paymentSuccess = true; // Here should be replaced with real payment result
            if (paymentSuccess) {
                const orderData = {
                    orderItems: cart.map(item => ({
                        product: item.id,
                        name: item.name,
                        qty: item.quantity,
                        price: item.price,
                        image: item.images?.[0] || item.image || ""
                    })),
                    shippingAddress: {
                        address: profile.address,
                        city: profile.city,
                        postalCode: profile.postCode,
                        province: profile.province
                    },
                    paymentMethod: "پرداخت آنلاین",
                    itemsPrice: totalPrice,
                    shippingPrice: 0,
                    totalPrice: totalPrice,
                    isPaid: true,
                    paidAt: new Date().toISOString(),
                    paymentResult: { status: "paid", paidAt: new Date().toISOString() }
                };
                const order = await createOrder(user.token, orderData);
                // فراخوانی payOrder برای کاهش موجودی محصولات
                await import('../../api/orders').then(api => api.payOrder(user.token, order._id, { status: "paid", paidAt: new Date().toISOString() }));
                setMessage("Payment was successful and your order has been placed!");
                localStorage.removeItem("cart");
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                setMessage("Payment failed. Please try again.");
            }
        } catch (err) {
            setMessage("Error placing order or payment! Please try again later.");
        }
        setLoading(false);
    };

    if (cart.length === 0) {
        return (
            <div className="cart-table card shadow my-3">
                <div className="card-header bg-danger text-white fw-bold fs-5">
                    Shopping Cart
                </div>
                <div className="card-body text-center py-5">
                    Your cart is empty.
                </div>
            </div>
        );
    }

    return (
        <div className="my-5">
            <div className="card cart-table shadow">
                <div className="card-header bg-danger text-white fw-bold fs-5">
                    Shopping Cart
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table cart-table">
                                <tr>
                                    <th className="cart-table" scope="col">Product</th>
                                    <th className="cart-table" scope="col">Price</th>
                                    <th className="cart-table" scope="col">Quantity</th>
                                    <th className="cart-table" scope="col">Total</th>
                                    <th className="cart-table" scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map(item => (
                                    <tr key={item.id || item._id || Math.random()}>
                                        <td className="cart-table-items"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => navigate(`/product/${item.id}`)}
                                        >
                                            {/* Show first image from images array if available, else fallback to image */}
                                            {Array.isArray(item.images) && item.images.length > 0 ? (
                                                <img
                                                    src={item.images[0]}
                                                    alt={item.title}
                                                    style={{ width: "40px", height: "40px", objectFit: "contain" }}
                                                    className="me-2"
                                                />
                                            ) : item.image && item.image.trim() !== "" ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    style={{ width: "40px", height: "40px", objectFit: "contain" }}
                                                    className="me-2"
                                                />
                                            ) : null}
                                            <span className="text-decoration-none">{item.title}</span>
                                        </td>
                                        <td className="cart-table-items">{item.price}</td>
                                        <td className="cart-table-items">
                                            <div className="d-flex align-items-center">
                                                <button
                                                    className="btn btn-sm btn-outline-secondary me-2"
                                                    onClick={() => handleQuantityChange(item.id, -1)}
                                                    disabled={item.quantity <= 1}
                                                >-</button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    className="btn btn-sm btn-outline-secondary ms-2"
                                                    onClick={() => handleQuantityChange(item.id, 1)}
                                                    disabled={item.countInStock === 0 || item.quantity >= item.countInStock}
                                                >+</button>
                                            </div>
                                            {item.countInStock === 0 && (
                                                <span className="badge bg-danger ms-2">Out of stock</span>
                                            )}
                                        </td>
                                        <td className="cart-table-items">{(item.price * item.quantity)}</td>
                                        <td className="cart-table-items">
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(item.id)}>
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="cart-table card-footer d-flex flex-wrap justify-content-between align-items-center">
                    <div className="fw-bold">
                        Total Items: <span className="text-danger">{totalItems}</span>
                    </div>
                    <div className="mx-2"></div>
                    <div className="fw-bold fs-5">
                    Total Price: <span className="text-success">{totalPrice}</span>
                    </div>
                    <button
                        className="btn btn-danger px-4 py-2 fw-bold ms-auto"
                        onClick={handleCheckout}
                        disabled={totalItems === 0 || loading || cart.some(item => item.countInStock === 0)}
                    >
                        <i className="bi bi-credit-card-2-front me-2"></i>
                        Proceed to Checkout
                    </button>
                </div>
                {message && <div className="alert alert-info mt-3 w-100 text-center">{message}</div>}
            </div>
        </div>
    );
}
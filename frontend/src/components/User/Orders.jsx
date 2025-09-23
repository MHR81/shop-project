import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyOrders } from "../../api/orders";

export default function Orders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const data = await getMyOrders(user.token);
                // Only show paid orders
                setOrders(data.filter(order => order.isPaid));
            } catch {
                setOrders([]);
            }
            setLoading(false);
        };
        if (user?.token) fetchOrders();
    }, [user?.token]);

    return (
        <div className="my-orders-container py-2">
            <h4 className="fw-bold mb-3"><span className="fs-4">My</span> <span className="text-danger fs-3">Orders</span></h4>
            {loading ? <div className="alert alert-info">Loading orders...</div> : (
                orders.length === 0 ? (
                    <div className="alert alert-warning text-center">No orders have been placed or paid.</div>
                ) : (
                    <div className="row g-4">
                        {orders.map(order => (
                            <div key={order._id} className="col-12 col-md-6 col-lg-4">
                                <div className="card shadow border-0 h-100 order-card">
                                    <div className="card-header bg-gradient bg-danger text-white d-flex justify-content-between align-items-center">
                                        <span>Order #{order._id}</span>
                                        <span className="badge bg-success">Paid</span>
                                    </div>
                                    <div className="card-body">
                                        <div className="mb-2">
                                            <strong>Delivery Status:</strong>
                                            {order.isDelivered ? <span className="badge bg-info ms-2">Delivered</span> : <span className="badge bg-secondary ms-2">Pending</span>}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Total Price:</strong> <span className="text-success fw-bold">{order.totalPrice} Toman</span>
                                        </div>
                                        <div className="mb-2">
                                            <strong>Order Date:</strong> <span className="badge bg-light text-dark ms-2">{new Date(order.createdAt).toLocaleString()}</span>
                                        </div>
                                        {order.paidAt && <div className="mb-2"><strong>Payment Date:</strong> <span className="badge bg-success ms-2">{new Date(order.paidAt).toLocaleString()}</span></div>}
                                        {order.isDelivered && order.deliveredAt && <div className="mb-2"><strong>Delivery Date:</strong> <span className="badge bg-info ms-2">{new Date(order.deliveredAt).toLocaleString()}</span></div>}
                                        <div className="mb-2">
                                            <strong>Shipping Address:</strong>
                                            <div className="small text-muted">
                                                {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.province} - {order.shippingAddress?.postalCode}
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <strong>Payment Method:</strong> <span className="badge bg-light text-dark ms-2">{order.paymentMethod}</span>
                                        </div>
                                        <div className="mb-2">
                                            <strong>Items:</strong>
                                            <ul className="list-group list-group-flush">
                                                {order.orderItems.map(item => (
                                                    <li key={item.product} className="list-group-item d-flex justify-content-between align-items-center">
                                                        <span>{item.name} <span className="badge bg-secondary ms-2">x{item.qty}</span></span>
                                                        <span>{item.price} Toman</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}
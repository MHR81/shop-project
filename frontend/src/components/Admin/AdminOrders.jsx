import { useEffect, useState, useCallback } from "react";
import Loading from "../common/Loading";
import { useAuth } from "../../context/AuthContext";
import { getAllOrders, deliverOrder } from "../../api/orders";

export default function AdminOrders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllOrders(user.token);
            // فقط سفارش‌های پرداخت‌شده را نمایش بده
            setOrders(data.filter(order => order.isPaid));
        } catch {
            setMessage("خطا در دریافت سفارشات");
        }
        setLoading(false);
    }, [user.token]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // نسخه‌های تکراری حذف شد

    const handleDeliver = async id => {
        try {
            await deliverOrder(user.token, id);
            fetchOrders();
        } catch {
            setMessage("خطا در تغییر وضعیت ارسال");
        }
    };

    return (
        <div>
            <h4 className="fw-bold mb-3 text-danger">مدیریت سفارشات</h4>
            {loading ? <Loading height="200px" /> : (
                orders.length === 0 ? (
                    <div className="alert alert-warning text-center">سفارشی برای نمایش وجود ندارد.</div>
                ) : (
                    <div className="row g-4">
                        {orders.map(order => (
                            <div key={order._id} className="col-12 col-md-6 col-lg-4">
                                <div className="card shadow border-0 h-100 order-card">
                                    <div className="card-header bg-gradient bg-primary text-white d-flex justify-content-between align-items-center">
                                        <span>سفارش #{order._id}</span>
                                        <span className="badge bg-success">پرداخت موفق</span>
                                    </div>
                                    <div className="card-body">
                                        <div className="mb-2">
                                            <strong>کاربر:</strong> <span className="badge bg-light text-dark ms-2">{order.user?.name} ({order.user?.email})</span>
                                        </div>
                                        <div className="mb-2">
                                            <strong>وضعیت ارسال:</strong>
                                            {order.isDelivered ? <span className="badge bg-info ms-2">ارسال شده</span> : <span className="badge bg-secondary ms-2">در انتظار ارسال</span>}
                                            {!order.isDelivered && <button className="btn btn-sm btn-primary ms-2" onClick={() => handleDeliver(order._id)}>ارسال شد</button>}
                                        </div>
                                        <div className="mb-2">
                                            <strong>مبلغ کل:</strong> <span className="text-success fw-bold">{order.totalPrice} تومان</span>
                                        </div>
                                        <div className="mb-2">
                                            <strong>زمان ثبت سفارش:</strong> <span className="badge bg-light text-dark ms-2">{new Date(order.createdAt).toLocaleString()}</span>
                                        </div>
                                        {order.paidAt && <div className="mb-2"><strong>زمان پرداخت:</strong> <span className="badge bg-success ms-2">{new Date(order.paidAt).toLocaleString()}</span></div>}
                                        {order.isDelivered && order.deliveredAt && <div className="mb-2"><strong>زمان ارسال:</strong> <span className="badge bg-info ms-2">{new Date(order.deliveredAt).toLocaleString()}</span></div>}
                                        <div className="mb-2">
                                            <strong>آدرس ارسال:</strong>
                                            <div className="small text-muted">
                                                {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.province} - {order.shippingAddress?.postalCode}
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <strong>روش پرداخت:</strong> <span className="badge bg-light text-dark ms-2">{order.paymentMethod}</span>
                                        </div>
                                        <div className="mb-2">
                                            <strong>آیتم‌ها:</strong>
                                            <ul className="list-group list-group-flush">
                                                {order.orderItems.map(item => (
                                                    <li key={item.product} className="list-group-item d-flex justify-content-between align-items-center">
                                                        <span>{item.name} <span className="badge bg-secondary ms-2">x{item.qty}</span></span>
                                                        <span>{item.price} تومان</span>
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
            {message && <div className="alert alert-danger mt-2">{message}</div>}
        </div>
    );
}
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
            setOrders(data);
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
                <ul className="list-group">
                    {orders.map(order => (
                        <li key={order._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>
                                سفارش #{order._id} - کاربر: {order.user?.name} - مبلغ: {order.totalPrice} تومان
                                {order.isPaid ? <span className="badge bg-success ms-2">پرداخت شده</span> : <span className="badge bg-warning ms-2">در انتظار پرداخت</span>}
                                {order.isDelivered ? <span className="badge bg-info ms-2">ارسال شده</span> : <span className="badge bg-secondary ms-2">در انتظار ارسال</span>}
                            </span>
                            <div>
                                {!order.isDelivered && <button className="btn btn-sm btn-primary" onClick={() => handleDeliver(order._id)}>ارسال شد</button>}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {message && <div className="alert alert-danger mt-2">{message}</div>}
        </div>
    );
}
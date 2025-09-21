import { useEffect, useState, useCallback } from "react";
import Loading from "../common/Loading";
import { useAuth } from "../../context/AuthContext";
import { getAllOrders, deliverOrder } from "../../api/orders";
import { deleteAllOrders, deleteOrderById } from "../../api/orders";

export default function AdminOrders() {
    const [search, setSearch] = useState("");
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

    const handleDeleteOrder = async id => {
        if (!window.confirm("آیا مطمئن هستید که می‌خواهید این سفارش حذف شود؟")) return;
        try {
            await deleteOrderById(user.token, id);
            setMessage("سفارش حذف شد");
            fetchOrders();
        } catch {
            setMessage("خطا در حذف سفارش");
        }
    };

    const handleDeleteAll = async () => {
        if (!window.confirm("آیا مطمئن هستید که می‌خواهید همه سفارش‌ها حذف شوند؟")) return;
        try {
            await deleteAllOrders(user.token);
            setMessage("همه سفارش‌ها حذف شدند");
            fetchOrders();
        } catch {
            setMessage("خطا در حذف همه سفارش‌ها");
        }
    };

    return (
        <div>
            <h4 className="fw-bold mb-3 text-danger">مدیریت سفارشات</h4>
            <div className="d-flex flex-wrap gap-2 mb-3">
                <input
                    type="text"
                    className="form-control w-auto"
                    placeholder="جستجو بر اساس نام کاربر یا ایمیل یا شماره سفارش..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <button className="btn btn-danger" onClick={handleDeleteAll}>حذف همه سفارش‌ها</button>
                <button className="btn btn-outline-secondary" onClick={() => window.print()}>پرینت لیست سفارشات</button>
            </div>
            {loading ? <Loading height="200px" /> : (
                orders.length === 0 ? (
                    <div className="alert alert-warning text-center">سفارشی برای نمایش وجود ندارد.</div>
                ) : (
                    <div className="row g-4">
                        {orders
                            .filter(order =>
                                !search ||
                                order._id.includes(search) ||
                                (order.user?.name && order.user.name.includes(search)) ||
                                (order.user?.email && order.user.email.includes(search))
                            )
                            .map(order => (
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
                                        <div className="d-flex gap-2 mt-2">
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteOrder(order._id)}>حذف سفارش</button>
                                            <button className="btn btn-sm btn-outline-secondary" onClick={() => navigator.clipboard.writeText(order._id)}>کپی شماره سفارش</button>
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
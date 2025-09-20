import { useEffect, useState, useCallback } from "react";
import Loading from "../common/Loading";
import { useAuth } from "../../context/AuthContext";
import { getAllProducts } from "../../api/products";
import { getCategories } from "../../api/categories";
import axios from "axios";

export default function AdminProducts() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: "", description: "", price: "", category: "", image: "", countInStock: "" });
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", description: "", price: "", category: "", image: "", countInStock: "" });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch {
            setMessage("خطا در دریافت محصولات");
        }
        setLoading(false);
    }, [user.token]);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await getCategories(user.token);
            setCategories(data);
        } catch {
            setMessage("خطا در دریافت دسته‌بندی‌ها");
        }
    }, [user.token]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [fetchProducts, fetchCategories]);

    // نسخه‌های تکراری حذف شد

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setMessage("");
        if (!form.name || !form.price || !form.category) {
            setMessage("نام، قیمت و دسته‌بندی الزامی است.");
            return;
        }
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/products`, form, { headers: { Authorization: `Bearer ${user.token}` } });
            setForm({ name: "", description: "", price: "", category: "", image: "", countInStock: "" });
            fetchProducts();
        } catch {
            setMessage("خطا در افزودن محصول");
        }
    };

    const handleEdit = id => {
        const prod = products.find(p => p._id === id);
        setEditId(id);
        setEditForm({
            name: prod.name,
            description: prod.description,
            price: prod.price,
            category: prod.category?._id || prod.category,
            image: prod.image,
            countInStock: prod.countInStock
        });
    };

    const handleEditChange = e => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async e => {
        e.preventDefault();
        if (!editForm.name || !editForm.price || !editForm.category) {
            setMessage("نام، قیمت و دسته‌بندی الزامی است.");
            return;
        }
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/products/${editId}`, editForm, { headers: { Authorization: `Bearer ${user.token}` } });
            setEditId(null);
            setEditForm({ name: "", description: "", price: "", category: "", image: "", countInStock: "" });
            fetchProducts();
        } catch {
            setMessage("خطا در ویرایش محصول");
        }
    };

    const handleDelete = async id => {
        if (!window.confirm("آیا مطمئن هستید؟")) return;
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/products/${id}`, { headers: { Authorization: `Bearer ${user.token}` } });
            fetchProducts();
        } catch {
            setMessage("خطا در حذف محصول");
        }
    };

    return (
        <div>
            <h4 className="fw-bold mb-3 text-danger">مدیریت محصولات</h4>
            <form onSubmit={handleSubmit} className="mb-3 d-flex flex-wrap">
                <input className="form-control me-2 mb-2" name="name" value={form.name} onChange={handleChange} placeholder="نام محصول" />
                <input className="form-control me-2 mb-2" name="description" value={form.description} onChange={handleChange} placeholder="توضیحات" />
                <input className="form-control me-2 mb-2" name="price" value={form.price} onChange={handleChange} placeholder="قیمت" type="number" />
                <select className="form-control me-2 mb-2" name="category" value={form.category} onChange={handleChange}>
                    <option value="">انتخاب دسته‌بندی</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
                <input className="form-control me-2 mb-2" name="image" value={form.image} onChange={handleChange} placeholder="آدرس تصویر" />
                <input className="form-control me-2 mb-2" name="countInStock" value={form.countInStock} onChange={handleChange} placeholder="موجودی" type="number" />
                <button className="btn btn-success mb-2" type="submit">افزودن</button>
            </form>
            {loading ? <Loading height="200px" /> : (
                <ul className="list-group">
                    {products.map(prod => (
                        <li key={prod._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>{prod.name} - {prod.price} تومان {prod.category?.name && `- ${prod.category.name}`}</span>
                            <div>
                                <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(prod._id)}>ویرایش</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(prod._id)}>حذف</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {editId && (
                <form onSubmit={handleEditSubmit} className="mt-3 d-flex flex-wrap">
                    <input className="form-control me-2 mb-2" name="name" value={editForm.name} onChange={handleEditChange} placeholder="نام محصول" />
                    <input className="form-control me-2 mb-2" name="description" value={editForm.description} onChange={handleEditChange} placeholder="توضیحات" />
                    <input className="form-control me-2 mb-2" name="price" value={editForm.price} onChange={handleEditChange} placeholder="قیمت" type="number" />
                    <select className="form-control me-2 mb-2" name="category" value={editForm.category} onChange={handleEditChange}>
                        <option value="">انتخاب دسته‌بندی</option>
                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                    </select>
                    <input className="form-control me-2 mb-2" name="image" value={editForm.image} onChange={handleEditChange} placeholder="آدرس تصویر" />
                    <input className="form-control me-2 mb-2" name="countInStock" value={editForm.countInStock} onChange={handleEditChange} placeholder="موجودی" type="number" />
                    <button className="btn btn-primary mb-2" type="submit">ثبت ویرایش</button>
                    <button className="btn btn-secondary ms-2 mb-2" type="button" onClick={() => setEditId(null)}>انصراف</button>
                </form>
            )}
            {message && <div className="alert alert-danger mt-2">{message}</div>}
        </div>
    );
}
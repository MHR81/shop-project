import { useEffect, useState, useCallback } from "react";
import Loading from "../common/Loading";
import { useAuth } from "../../context/AuthContext";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../api/categories";

export default function AdminCategories() {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: "", description: "" });
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", description: "" });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getCategories(user.token);
            setCategories(data);
        } catch {
            setMessage("خطا در دریافت دسته‌بندی‌ها");
        }
        setLoading(false);
    }, [user.token]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCategories();
        }, 300);
        return () => {
            clearTimeout(timer);
        };
    }, [fetchCategories]);

    // نسخه‌های تکراری حذف شد

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setMessage("");
        if (!form.name) {
            setMessage("نام دسته‌بندی الزامی است.");
            return;
        }
        try {
            await createCategory(user.token, form);
            setForm({ name: "", description: "" });
            fetchCategories();
        } catch {
            setMessage("خطا در افزودن دسته‌بندی");
        }
    };

    const handleEdit = id => {
        const cat = categories.find(c => c._id === id);
        setEditId(id);
        setEditForm({ name: cat.name, description: cat.description });
    };

    const handleEditChange = e => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async e => {
        e.preventDefault();
        if (!editForm.name) {
            setMessage("نام دسته‌بندی الزامی است.");
            return;
        }
        try {
            await updateCategory(user.token, editId, editForm);
            setEditId(null);
            setEditForm({ name: "", description: "" });
            fetchCategories();
        } catch {
            setMessage("خطا در ویرایش دسته‌بندی");
        }
    };

    const handleDelete = async id => {
        if (!window.confirm("آیا مطمئن هستید؟")) return;
        try {
            await deleteCategory(user.token, id);
            fetchCategories();
        } catch {
            setMessage("خطا در حذف دسته‌بندی");
        }
    };

    return (
        <div>
            <h4 className="fw-bold mb-3 text-danger">مدیریت دسته‌بندی‌ها</h4>
            <form onSubmit={handleSubmit} className="mb-3 d-flex">
                <input className="form-control me-2" name="name" value={form.name} onChange={handleChange} placeholder="نام دسته‌بندی" />
                <input className="form-control me-2" name="description" value={form.description} onChange={handleChange} placeholder="توضیحات" />
                <button className="btn btn-success" type="submit">افزودن</button>
            </form>
            {loading ? <Loading height="200px" /> : (
                <ul className="list-group">
                    {categories.map(cat => (
                        <li key={cat._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>{cat.name} {cat.description && `- ${cat.description}`}</span>
                            <div>
                                <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(cat._id)}>ویرایش</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat._id)}>حذف</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {editId && (
                <form onSubmit={handleEditSubmit} className="mt-3 d-flex">
                    <input className="form-control me-2" name="name" value={editForm.name} onChange={handleEditChange} placeholder="نام دسته‌بندی" />
                    <input className="form-control me-2" name="description" value={editForm.description} onChange={handleEditChange} placeholder="توضیحات" />
                    <button className="btn btn-primary" type="submit">ثبت ویرایش</button>
                    <button className="btn btn-secondary ms-2" type="button" onClick={() => setEditId(null)}>انصراف</button>
                </form>
            )}
            {message && <div className="alert alert-danger mt-2">{message}</div>}
        </div>
    );
}

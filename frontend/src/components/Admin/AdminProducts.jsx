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
    const [form, setForm] = useState({ name: "", description: "", price: "", category: "", countInStock: "" });
    const [imageLinks, setImageLinks] = useState([""]);
    const [imageFiles, setImageFiles] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", description: "", price: "", category: "", image: "", countInStock: "" });
    const [editImageFile, setEditImageFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState("");

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch {
            setMessage("خطا در دریافت محصولات");
        }
        setLoading(false);
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await getCategories(user.token);
            setCategories(data);
        } catch {
            setMessage("خطا در دریافت دسته‌بندی‌ها");
        }
    }, [user.token]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
            fetchCategories();
        }, 300);
        return () => {
            clearTimeout(timer);
        };
    }, [fetchProducts, fetchCategories]);

    // نسخه‌های تکراری حذف شد

    const handleChange = e => {
        const { name, value, files } = e.target;
        if (name === "imageFiles" && files) {
            setImageFiles(Array.from(files));
        } else if (name.startsWith("imageLink")) {
            const idx = parseInt(name.replace("imageLink", ""), 10);
            setImageLinks(links => links.map((l, i) => i === idx ? value : l));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setMessage("");
        setSuccess("");
        // اعتبارسنجی حرفه‌ای
        if (!form.name || !form.price || !form.category) {
            setMessage("نام، قیمت و دسته‌بندی الزامی است.");
            return;
        }
        if (isNaN(form.price) || Number(form.price) <= 0) {
            setMessage("قیمت باید عدد مثبت باشد.");
            return;
        }
        if (form.countInStock && (isNaN(form.countInStock) || Number(form.countInStock) < 0)) {
            setMessage("موجودی باید عدد مثبت یا صفر باشد.");
            return;
        }
        setLoading(true);
        try {
            let imageUrls = [];
            // Handle uploaded images
            if (imageFiles.length > 0) {
                for (const file of imageFiles) {
                    const data = new FormData();
                    data.append("image", file);
                    const res = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, data, {
                        headers: { "Content-Type": "multipart/form-data" }
                    });
                    imageUrls.push(res.data.imageUrl);
                }
            }
            // Handle image links (trim and filter empty)
            imageUrls = imageUrls.concat(imageLinks.map(l => l.trim()).filter(l => l));
            await axios.post(`${process.env.REACT_APP_API_URL}/products`, { ...form, images: imageUrls }, { headers: { Authorization: `Bearer ${user.token}` } });
            setForm({ name: "", description: "", price: "", category: "", countInStock: "" });
            setImageFiles([]);
            setImageLinks([""]);
            setSuccess("محصول با موفقیت اضافه شد.");
            fetchProducts();
        } catch (err) {
            setMessage(err?.response?.data?.message || "خطا در افزودن محصول");
        }
        setLoading(false);
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
        const { name, value, files } = e.target;
        if (name === "editImageFile" && files && files[0]) {
            setEditImageFile(files[0]);
        } else {
            setEditForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleEditSubmit = async e => {
        e.preventDefault();
        setMessage("");
        setSuccess("");
        if (!editForm.name || !editForm.price || !editForm.category) {
            setMessage("نام، قیمت و دسته‌بندی الزامی است.");
            return;
        }
        if (isNaN(editForm.price) || Number(editForm.price) <= 0) {
            setMessage("قیمت باید عدد مثبت باشد.");
            return;
        }
        if (editForm.countInStock && (isNaN(editForm.countInStock) || Number(editForm.countInStock) < 0)) {
            setMessage("موجودی باید عدد مثبت یا صفر باشد.");
            return;
        }
        setLoadingEdit(true);
        try {
            let imageUrl = editForm.image;
            if (editImageFile) {
                const data = new FormData();
                data.append("image", editImageFile);
                const res = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                imageUrl = res.data.imageUrl;
            }
            await axios.put(`${process.env.REACT_APP_API_URL}/products/${editId}`, { ...editForm, image: imageUrl }, { headers: { Authorization: `Bearer ${user.token}` } });
            setEditId(null);
            setEditForm({ name: "", description: "", price: "", category: "", image: "", countInStock: "" });
            setEditImageFile(null);
            setSuccess("ویرایش با موفقیت انجام شد.");
            fetchProducts();
        } catch (err) {
            setMessage(err?.response?.data?.message || "خطا در ویرایش محصول");
        }
        setLoadingEdit(false);
    };

    const handleDelete = async id => {
        if (!window.confirm("آیا مطمئن هستید؟")) return;
        setLoadingDelete(true);
        setMessage("");
        setSuccess("");
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/products/${id}`, { headers: { Authorization: `Bearer ${user.token}` } });
            setSuccess("محصول با موفقیت حذف شد.");
            fetchProducts();
        } catch (err) {
            setMessage(err?.response?.data?.message || "خطا در حذف محصول");
        }
        setLoadingDelete(false);
    };

    return (
        <div>
            <h4 className="fw-bold mb-3 text-danger">مدیریت محصولات</h4>
            <form onSubmit={handleSubmit} className="mb-3 d-flex flex-wrap">
                <input className="form-control me-2 mb-2" name="name" value={form.name} onChange={handleChange} placeholder="نام محصول" disabled={loading} />
                <input className="form-control me-2 mb-2" name="description" value={form.description} onChange={handleChange} placeholder="توضیحات" disabled={loading} />
                <input className="form-control me-2 mb-2" name="price" value={form.price} onChange={handleChange} placeholder="قیمت" type="number" disabled={loading} />
                <select className="form-control me-2 mb-2" name="category" value={form.category} onChange={handleChange} disabled={loading}>
                    <option value="">انتخاب دسته‌بندی</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
                <input className="form-control me-2 mb-2" name="image" value={form.image} onChange={handleChange} placeholder="آدرس تصویر (اختیاری)" disabled={loading} />
                {imageLinks.map((link, idx) => (
                    <div key={idx} className="d-flex align-items-center mb-2">
                        <input
                            className="form-control me-2"
                            name={`imageLink${idx}`}
                            value={link}
                            onChange={handleChange}
                            placeholder={`لینک عکس ${idx + 1}`}
                            disabled={loading}
                        />
                        {idx === imageLinks.length - 1 && (
                            <button
                                type="button"
                                className="btn btn-outline-success"
                                disabled={loading || imageLinks.some(l => !l.trim())}
                                onClick={() => {
                                    if (imageLinks.every(l => l.trim())) {
                                        setImageLinks([...imageLinks, ""]);
                                    }
                                }}
                            >افزودن لینک جدید</button>
                        )}
                    </div>
                ))}
                <input className="form-control me-2 mb-2" name="imageFiles" type="file" accept="image/*" multiple onChange={handleChange} disabled={loading} />
                <input className="form-control me-2 mb-2" name="countInStock" value={form.countInStock} onChange={handleChange} placeholder="موجودی" type="number" disabled={loading} />
                <button className="btn btn-success mb-2" type="submit" disabled={loading}>افزودن</button>
            </form>
            {loading ? <Loading height="200px" /> : (
                <ul className="list-group">
                    {products.map(prod => (
                        <li key={prod._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>{prod.name} - {prod.price} تومان {prod.category?.name && `- ${prod.category.name}`}</span>
                            <div>
                                <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(prod._id)} disabled={loadingEdit || loadingDelete}>ویرایش</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(prod._id)} disabled={loadingEdit || loadingDelete}>{loadingDelete ? <Loading height="20px" /> : "حذف"}</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {editId && (
                <form onSubmit={handleEditSubmit} className="mt-3 d-flex flex-wrap">
                    <input className="form-control me-2 mb-2" name="name" value={editForm.name} onChange={handleEditChange} placeholder="نام محصول" disabled={loadingEdit} />
                    <input className="form-control me-2 mb-2" name="description" value={editForm.description} onChange={handleEditChange} placeholder="توضیحات" disabled={loadingEdit} />
                    <input className="form-control me-2 mb-2" name="price" value={editForm.price} onChange={handleEditChange} placeholder="قیمت" type="number" disabled={loadingEdit} />
                    <select className="form-control me-2 mb-2" name="category" value={editForm.category} onChange={handleEditChange} disabled={loadingEdit}>
                        <option value="">انتخاب دسته‌بندی</option>
                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                    </select>
                    <input className="form-control me-2 mb-2" name="image" value={editForm.image} onChange={handleEditChange} placeholder="آدرس تصویر" disabled={loadingEdit} />
                    <input className="form-control me-2 mb-2" name="editImageFile" type="file" accept="image/*" onChange={handleEditChange} disabled={loadingEdit} />
                    <input className="form-control me-2 mb-2" name="countInStock" value={editForm.countInStock} onChange={handleEditChange} placeholder="موجودی" type="number" disabled={loadingEdit} />
                    <button className="btn btn-primary mb-2" type="submit" disabled={loadingEdit}>ثبت ویرایش</button>
                    <button className="btn btn-secondary ms-2 mb-2" type="button" onClick={() => setEditId(null)} disabled={loadingEdit}>انصراف</button>
                </form>
            )}
            {success && <div className="alert alert-success mt-2">{success}</div>}
            {message && <div className="alert alert-danger mt-2">{message}</div>}
        </div>
    );
}
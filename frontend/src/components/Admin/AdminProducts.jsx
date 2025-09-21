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
            // Move selected main image to first position
            if (typeof form.mainImageFile === "number" && imageFiles.length > 0) {
                const mainFileIdx = form.mainImageFile;
                if (mainFileIdx < imageUrls.length) {
                    const mainImg = imageUrls[mainFileIdx];
                    imageUrls = [mainImg, ...imageUrls.filter((img, idx) => idx !== mainFileIdx)];
                }
            } else if (typeof form.mainImageLink === "number" && imageLinks.length > 0) {
                const mainLinkIdx = imageFiles.length + form.mainImageLink;
                if (mainLinkIdx < imageUrls.length) {
                    const mainImg = imageUrls[mainLinkIdx];
                    imageUrls = [mainImg, ...imageUrls.filter((img, idx) => idx !== mainLinkIdx)];
                }
            }
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
            countInStock: prod.countInStock
        });
        setEditImageLinks(Array.isArray(prod.images) ? prod.images : [prod.image || ""]);
        setEditImageFiles([]);
    };

    // State for edit image links and files
    const [editImageLinks, setEditImageLinks] = useState([""]);
    const [editImageFiles, setEditImageFiles] = useState([]);

    const handleEditChange = e => {
        const { name, value, files } = e.target;
        if (name === "editImageFiles" && files) {
            setEditImageFiles(Array.from(files));
        } else if (name.startsWith("editImageLink")) {
            const idx = parseInt(name.replace("editImageLink", ""), 10);
            setEditImageLinks(links => links.map((l, i) => i === idx ? value : l));
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
            let imageUrls = [];
            // Handle uploaded images
            if (editImageFiles.length > 0) {
                for (const file of editImageFiles) {
                    const data = new FormData();
                    data.append("image", file);
                    const res = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, data, {
                        headers: { "Content-Type": "multipart/form-data" }
                    });
                    imageUrls.push(res.data.imageUrl);
                }
            }
            // Handle image links (trim and filter empty)
            imageUrls = imageUrls.concat(editImageLinks.map(l => l.trim()).filter(l => l));
            // Move selected main image to first position
            if (typeof editForm.mainEditImageFile === "number" && editImageFiles.length > 0) {
                const mainFileIdx = editForm.mainEditImageFile;
                if (mainFileIdx < imageUrls.length) {
                    const mainImg = imageUrls[mainFileIdx];
                    imageUrls = [mainImg, ...imageUrls.filter((img, idx) => idx !== mainFileIdx)];
                }
            } else if (typeof editForm.mainEditImageLink === "number" && editImageLinks.length > 0) {
                const mainLinkIdx = editImageFiles.length + editForm.mainEditImageLink;
                if (mainLinkIdx < imageUrls.length) {
                    const mainImg = imageUrls[mainLinkIdx];
                    imageUrls = [mainImg, ...imageUrls.filter((img, idx) => idx !== mainLinkIdx)];
                }
            }
            await axios.put(`${process.env.REACT_APP_API_URL}/products/${editId}`, { ...editForm, images: imageUrls }, { headers: { Authorization: `Bearer ${user.token}` } });
            setEditId(null);
            setEditForm({ name: "", description: "", price: "", category: "", countInStock: "" });
            setEditImageLinks([""]);
            setEditImageFiles([]);
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
                {/* Image Links with preview and main selection */}
                <div className="mb-2">لینک تصاویر:</div>
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
                        {link.trim() && (
                            <img src={link} alt={"preview"} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6, marginLeft: 8 }} />
                        )}
                        <input
                            type="radio"
                            name="mainImageLink"
                            checked={form.mainImageLink === idx}
                            onChange={() => setForm(prev => ({ ...prev, mainImageLink: idx }))}
                            className="ms-2"
                            title="انتخاب به عنوان تصویر اصلی"
                        />
                        <span className="ms-1">اصلی</span>
                        {idx === imageLinks.length - 1 && (
                            <button
                                type="button"
                                className="btn btn-outline-success ms-2"
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
                {/* Uploaded images preview and main selection */}
                <input className="form-control me-2 mb-2" name="imageFiles" type="file" accept="image/*" multiple onChange={handleChange} disabled={loading} />
                {imageFiles.length > 0 && (
                    <div className="d-flex flex-wrap mb-2">
                        {imageFiles.map((file, idx) => {
                            const url = URL.createObjectURL(file);
                            return (
                                <div key={idx} className="d-flex flex-column align-items-center me-2 mb-2">
                                    <img src={url} alt={file.name} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }} />
                                    <input
                                        type="radio"
                                        name="mainImageFile"
                                        checked={form.mainImageFile === idx}
                                        onChange={() => setForm(prev => ({ ...prev, mainImageFile: idx }))}
                                        className="mt-1"
                                        title="انتخاب به عنوان تصویر اصلی"
                                    />
                                    <span style={{ fontSize: 10 }}>اصلی</span>
                                </div>
                            );
                        })}
                    </div>
                )}
                <input className="form-control me-2 mb-2" name="countInStock" value={form.countInStock} onChange={handleChange} placeholder="موجودی" type="number" disabled={loading} />
                <button className="btn btn-success mb-2" type="submit" disabled={loading}>افزودن</button>
            </form>
            {loading ? <Loading height="200px" /> : (
                <ul className="list-group">
                    {products.map(prod => (
                        <>
                        <li key={prod._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                {/* نمایش عکس اصلی محصول در لیست */}
                                {(() => {
                                    let mainImg = "";
                                    if (Array.isArray(prod.images) && prod.images.length > 0) {
                                        mainImg = prod.images[0];
                                    } else if (prod.image) {
                                        mainImg = prod.image;
                                    }
                                    return mainImg ? (
                                        <img src={mainImg} alt="main" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6, marginLeft: 10, border: "2px solid #dc3545" }} />
                                    ) : null;
                                })()}
                                <span title={prod.name} style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
                                    {prod.name.length > 22 ? prod.name.slice(0, 22) + '...' : prod.name}
                                </span>
                                <span> - {prod.price} تومان {prod.category?.name && `- ${prod.category.name}`}</span>
                            </div>
                            <div>
                                <button className="btn btn-sm btn-info me-2" onClick={() => editId === prod._id ? setEditId(null) : handleEdit(prod._id)} disabled={loadingEdit || loadingDelete}>
                                    {editId === prod._id ? "بستن ویرایش" : "ویرایش"}
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(prod._id)} disabled={loadingEdit || loadingDelete}>{loadingDelete ? <Loading height="20px" /> : "حذف"}</button>
                            </div>
                        </li>
                        {editId === prod._id && (
                            <li className="list-group-item">
                                <form onSubmit={handleEditSubmit} className="mt-3 d-flex flex-wrap">
                                    {/* نمایش عکس اصلی محصول در فرم ویرایش */}
                                    {(() => {
                                        let mainImg = "";
                                        if (editImageLinks && typeof editForm.mainEditImageLink === "number" && editImageLinks[editForm.mainEditImageLink]) {
                                            mainImg = editImageLinks[editForm.mainEditImageLink];
                                        } else if (editImageFiles && typeof editForm.mainEditImageFile === "number" && editImageFiles[editForm.mainEditImageFile]) {
                                            mainImg = URL.createObjectURL(editImageFiles[editForm.mainEditImageFile]);
                                        }
                                        return mainImg ? (
                                            <div className="mb-2 d-flex align-items-center">
                                                <img src={mainImg} alt="main" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, marginRight: 8, border: "2px solid #dc3545" }} />
                                                <span className="fw-bold text-danger">عکس اصلی محصول</span>
                                            </div>
                                        ) : null;
                                    })()}
                                    <input className="form-control me-2 mb-2" name="name" value={editForm.name} onChange={handleEditChange} placeholder="نام محصول" disabled={loadingEdit} />
                                    <input className="form-control me-2 mb-2" name="description" value={editForm.description} onChange={handleEditChange} placeholder="توضیحات" disabled={loadingEdit} />
                                    <input className="form-control me-2 mb-2" name="price" value={editForm.price} onChange={handleEditChange} placeholder="قیمت" type="number" disabled={loadingEdit} />
                                    <select className="form-control me-2 mb-2" name="category" value={editForm.category} onChange={handleEditChange} disabled={loadingEdit}>
                                        <option value="">انتخاب دسته‌بندی</option>
                                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                    </select>
                                    <div className="mb-2">لینک تصاویر:</div>
                                    {editImageLinks.map((link, idx) => (
                                        <div key={idx} className="d-flex align-items-center mb-2">
                                            <input
                                                className="form-control me-2"
                                                name={`editImageLink${idx}`}
                                                value={link}
                                                onChange={handleEditChange}
                                                placeholder={`لینک عکس ${idx + 1}`}
                                                disabled={loadingEdit}
                                            />
                                            {link.trim() && (
                                                <img src={link} alt={"preview"} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6, marginLeft: 8 }} />
                                            )}
                                            <input
                                                type="radio"
                                                name="mainEditImageLink"
                                                checked={editForm.mainEditImageLink === idx}
                                                onChange={() => setEditForm(prev => ({ ...prev, mainEditImageLink: idx }))}
                                                className="ms-2"
                                                title="انتخاب به عنوان تصویر اصلی"
                                            />
                                            <span className="ms-1">اصلی</span>
                                            {idx === editImageLinks.length - 1 && (
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-success ms-2"
                                                    disabled={loadingEdit || editImageLinks.some(l => !l.trim())}
                                                    onClick={() => {
                                                        if (editImageLinks.every(l => l.trim())) {
                                                            setEditImageLinks([...editImageLinks, ""]);
                                                        }
                                                    }}
                                                >افزودن لینک جدید</button>
                                            )}
                                        </div>
                                    ))}
                                    <input className="form-control me-2 mb-2" name="editImageFiles" type="file" accept="image/*" multiple onChange={handleEditChange} disabled={loadingEdit} />
                                    {editImageFiles.length > 0 && (
                                        <div className="d-flex flex-wrap mb-2">
                                            {editImageFiles.map((file, idx) => {
                                                const url = URL.createObjectURL(file);
                                                return (
                                                    <div key={idx} className="d-flex flex-column align-items-center me-2 mb-2">
                                                        <img src={url} alt={file.name} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }} />
                                                        <input
                                                            type="radio"
                                                            name="mainEditImageFile"
                                                            checked={editForm.mainEditImageFile === idx}
                                                            onChange={() => setEditForm(prev => ({ ...prev, mainEditImageFile: idx }))}
                                                            className="mt-1"
                                                            title="انتخاب به عنوان تصویر اصلی"
                                                        />
                                                        <span style={{ fontSize: 10 }}>اصلی</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    <input className="form-control me-2 mb-2" name="countInStock" value={editForm.countInStock} onChange={handleEditChange} placeholder="موجودی" type="number" disabled={loadingEdit} />
                                    <button className="btn btn-primary mb-2" type="submit" disabled={loadingEdit}>ثبت ویرایش</button>
                                    <button className="btn btn-secondary ms-2 mb-2" type="button" onClick={() => setEditId(null)} disabled={loadingEdit}>انصراف</button>
                                </form>
                            </li>
                        )}
                        </>
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
                    {/* Multiple image links for edit with preview and main selection */}
                    <div className="mb-2">لینک تصاویر:</div>
                    {editImageLinks.map((link, idx) => (
                        <div key={idx} className="d-flex align-items-center mb-2">
                            <input
                                className="form-control me-2"
                                name={`editImageLink${idx}`}
                                value={link}
                                onChange={handleEditChange}
                                placeholder={`لینک عکس ${idx + 1}`}
                                disabled={loadingEdit}
                            />
                            {link.trim() && (
                                <img src={link} alt={"preview"} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6, marginLeft: 8 }} />
                            )}
                            <input
                                type="radio"
                                name="mainEditImageLink"
                                checked={editForm.mainEditImageLink === idx}
                                onChange={() => setEditForm(prev => ({ ...prev, mainEditImageLink: idx }))}
                                className="ms-2"
                                title="انتخاب به عنوان تصویر اصلی"
                            />
                            <span className="ms-1">اصلی</span>
                            {idx === editImageLinks.length - 1 && (
                                <button
                                    type="button"
                                    className="btn btn-outline-success ms-2"
                                    disabled={loadingEdit || editImageLinks.some(l => !l.trim())}
                                    onClick={() => {
                                        if (editImageLinks.every(l => l.trim())) {
                                            setEditImageLinks([...editImageLinks, ""]);
                                        }
                                    }}
                                >افزودن لینک جدید</button>
                            )}
                        </div>
                    ))}
                    {/* Multiple image files for edit with preview and main selection */}
                    <input className="form-control me-2 mb-2" name="editImageFiles" type="file" accept="image/*" multiple onChange={handleEditChange} disabled={loadingEdit} />
                    {editImageFiles.length > 0 && (
                        <div className="d-flex flex-wrap mb-2">
                            {editImageFiles.map((file, idx) => {
                                const url = URL.createObjectURL(file);
                                return (
                                    <div key={idx} className="d-flex flex-column align-items-center me-2 mb-2">
                                        <img src={url} alt={file.name} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }} />
                                        <input
                                            type="radio"
                                            name="mainEditImageFile"
                                            checked={editForm.mainEditImageFile === idx}
                                            onChange={() => setEditForm(prev => ({ ...prev, mainEditImageFile: idx }))}
                                            className="mt-1"
                                            title="انتخاب به عنوان تصویر اصلی"
                                        />
                                        <span style={{ fontSize: 10 }}>اصلی</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
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
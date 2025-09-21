import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Log from "../models/Log.js";

// گرفتن همه محصولات + فیلتر حرفه‌ای
export const getProducts = asyncHandler(async (req, res) => {
    const { category, minPrice, maxPrice, search, inStock, sort } = req.query;
    const filter = {};

    if (category) {
        // اگر category به صورت ObjectId ارسال شده باشد
        if (/^[0-9a-fA-F]{24}$/.test(category)) {
            filter.category = category;
        } else {
            // اگر category به صورت name ارسال شده باشد
            // جستجوی کتگوری با regex غیر حساس به حروف و حذف فاصله و کاراکترهای خاص
            const normalized = category.replace(/\s|\+|%27|'/g, '').toLowerCase();
            const catDoc = await Category.findOne({
                name: { $regex: new RegExp(normalized, 'i') }
            });
            // اگر پیدا نشد، یک بار با حذف فاصله و کاراکترهای خاص تست شود
            if (!catDoc) {
                const allCats = await Category.find({});
                const found = allCats.find(cat =>
                    cat.name.replace(/\s|\+|'/g, '').toLowerCase() === normalized
                );
                if (found) {
                    filter.category = found._id;
                } else {
                    return res.json([]);
                }
            } else {
                filter.category = catDoc._id;
            }
            if (catDoc) {
                filter.category = catDoc._id;
            } else {
                // اگر کتگوری پیدا نشد، هیچ محصولی برنگردد
                return res.json([]);
            }
        }
    }
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    if (search) filter.name = { $regex: search, $options: "i" };
    if (inStock) filter.countInStock = { $gt: 0 };

    let sortOption = {};
    if (sort === "price-asc") sortOption.price = 1;
    if (sort === "price-desc") sortOption.price = -1;
    if (sort === "newest") sortOption.createdAt = -1;

    const products = await Product.find(filter).populate("category").sort(sortOption);
    res.json(products);
});

// اضافه کردن محصول جدید (ادمین)
export const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category, images, countInStock } = req.body;
    const product = new Product({ name, description, price, category, images, countInStock });
    const createdProduct = await product.save();
    // ثبت لاگ ایجاد محصول
    await Log.create({
        user: req.user?._id,
        action: "ایجاد محصول",
        details: `محصول با نام ${createdProduct.name} توسط ${req.user?.email || "سیستم"} ایجاد شد.`
    });
    res.status(201).json(createdProduct);
});

// گرفتن محصول با ID
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate("category");
    if (product) res.json(product);
    else {
        res.status(404);
        throw new Error("Product not found");
    }
});

// آپدیت محصول (ادمین)
export const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        const prevName = product.name;
        product.name = req.body.name || product.name;
        product.description = req.body.description || product.description;
        product.price = req.body.price || product.price;
        product.category = req.body.category || product.category;
        product.countInStock = req.body.countInStock || product.countInStock;
        // Update images array if provided
        if (Array.isArray(req.body.images)) {
            product.images = req.body.images;
        }
        // For backward compatibility, update single image if provided
        if (req.body.image) {
            product.image = req.body.image;
        }
        const updatedProduct = await product.save();
        // ثبت لاگ ویرایش محصول
        await Log.create({
            user: req.user?._id,
            action: "ویرایش محصول",
            details: `محصول با نام قبلی ${prevName} توسط ${req.user?.email || "سیستم"} ویرایش شد.`
        });
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

// حذف محصول (ادمین)
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await Product.deleteOne({ _id: req.params.id });
        // ثبت لاگ حذف محصول
        await Log.create({
            user: req.user?._id,
            action: "حذف محصول",
            details: `محصول با نام ${product.name} توسط ${req.user?.email || "سیستم"} حذف شد.`
        });
        res.json({ message: "Product removed" });
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

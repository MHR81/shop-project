import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";
import Log from "../models/Log.js";

// گرفتن همه دسته‌ها
export const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.json(categories);
});

// اضافه کردن دسته جدید (ادمین)
export const createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    const createdCategory = await category.save();
    // ثبت لاگ ایجاد دسته‌بندی
    await Log.create({
        user: req.user?._id,
        action: "ایجاد دسته‌بندی",
        details: `دسته‌بندی با نام ${createdCategory.name} توسط ${req.user?.email || "سیستم"} ایجاد شد.`
    });
    res.status(201).json(createdCategory);
});

// آپدیت دسته‌بندی (ادمین)
export const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category) {
        const prevName = category.name;
        category.name = req.body.name || category.name;
        category.description = req.body.description || category.description;
        const updatedCategory = await category.save();
        // ثبت لاگ ویرایش دسته‌بندی
        await Log.create({
            user: req.user?._id,
            action: "ویرایش دسته‌بندی",
            details: `دسته‌بندی با نام قبلی ${prevName} توسط ${req.user?.email || "سیستم"} ویرایش شد.`
        });
        res.json(updatedCategory);
    } else {
        res.status(404);
        throw new Error("Category not found");
    }
});

// حذف دسته‌بندی (ادمین)
export const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category) {
        await Category.deleteOne({ _id: req.params.id });
        // ثبت لاگ حذف دسته‌بندی
        await Log.create({
            user: req.user?._id,
            action: "حذف دسته‌بندی",
            details: `دسته‌بندی با نام ${category.name} توسط ${req.user?.email || "سیستم"} حذف شد.`
        });
        res.json({ message: "Category removed" });
    } else {
        res.status(404);
        throw new Error("Category not found");
    }
});

// گرفتن دسته‌بندی با نام و محصولات مرتبط
import Product from "../models/Product.js";
export const getCategoryByNameWithProducts = asyncHandler(async (req, res) => {
    const name = decodeURIComponent(req.params.name);
    const category = await Category.findOne({ name });
    if (!category) {
        res.status(404);
        throw new Error("Category not found");
    }
    const products = await Product.find({ category: category._id });
    res.json({ category, products });
});

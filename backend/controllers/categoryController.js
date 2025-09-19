import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";

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
    res.status(201).json(createdCategory);
});

// آپدیت دسته‌بندی (ادمین)
export const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category) {
        category.name = req.body.name || category.name;
        category.description = req.body.description || category.description;
        const updatedCategory = await category.save();
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
        await category.remove();
        res.json({ message: "Category removed" });
    } else {
        res.status(404);
        throw new Error("Category not found");
    }
});

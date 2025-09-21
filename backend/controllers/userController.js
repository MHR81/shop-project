// دریافت همه کاربران (ادمین)
export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// دریافت کاربر با آیدی (ادمین)
export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) res.json(user);
    else {
        res.status(404);
        throw new Error("کاربر پیدا نشد");
    }
});

// ویرایش کاربر توسط ادمین
export const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        // جلوگیری از تغییر نقش mainAdmin توسط هر کسی
        if (user.mainAdmin && req.body.role && req.body.role !== user.role) {
            return res.status(403).json({ message: "نقش ادمین اصلی قابل تغییر نیست." });
        }
        // جلوگیری از تغییر نقش ادمین توسط خودش
        if (user._id.toString() === req.user._id.toString() && req.body.role && req.body.role !== user.role) {
            return res.status(403).json({ message: "ادمین نمی‌تواند نقش خود را تغییر دهد." });
        }
        const prevRole = user.role;
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.lastName = req.body.lastName || user.lastName;
        user.username = req.body.username || user.username;
        user.province = req.body.province || user.province;
        user.city = req.body.city || user.city;
        user.address = req.body.address || user.address;
        user.postCode = req.body.postCode || user.postCode;
        user.mobile = req.body.mobile || user.mobile;
        const updatedUser = await user.save();
        // ثبت لاگ ویرایش یا تغییر نقش
        let action = "ویرایش کاربر";
        let details = `کاربر با ایمیل ${user.email} توسط ${req.user.email} ویرایش شد.`;
        if (req.body.role && req.body.role !== prevRole) {
            action = "تغییر نقش کاربر";
            details = `نقش کاربر با ایمیل ${user.email} از ${prevRole} به ${req.body.role} توسط ${req.user.email} تغییر یافت.`;
        }
        await Log.create({
            user: req.user._id,
            action,
            details
        });
        res.json(updatedUser);
    } else {
        res.status(404);
        throw new Error("کاربر پیدا نشد");
    }
});

// حذف کاربر توسط ادمین
import Log from "../models/Log.js";

export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        try {
            await User.deleteOne({ _id: req.params.id });
            // ثبت لاگ حذف کاربر توسط ادمین
            await Log.create({
                user: req.user._id,
                action: "حذف کاربر",
                details: `کاربر با ایمیل ${user.email} و آیدی ${user._id} توسط ${req.user.email} حذف شد.`
            });
            res.json({ message: "کاربر حذف شد" });
        } catch (error) {
            // ثبت لاگ خطا
            await Log.create({
                user: req.user._id,
                action: "خطا در حذف کاربر",
                details: `خطا: ${error.message} | کاربر: ${user.email} | ادمین: ${req.user.email}`
            });
            res.status(500).json({ message: "خطا در حذف کاربر", error: error.message });
        }
    } else {
        res.status(404);
        throw new Error("کاربر پیدا نشد");
    }
});
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// Register user
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({ name, email, password });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

// Login user
export const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

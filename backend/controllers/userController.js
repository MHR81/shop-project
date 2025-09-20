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
        // جلوگیری از تغییر نقش ادمین توسط خودش
        if (user._id.toString() === req.user._id.toString() && req.body.role && req.body.role !== user.role) {
            return res.status(403).json({ message: "ادمین نمی‌تواند نقش خود را تغییر دهد." });
        }
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
        res.json(updatedUser);
    } else {
        res.status(404);
        throw new Error("کاربر پیدا نشد");
    }
});

// حذف کاربر توسط ادمین
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        await user.remove();
        res.json({ message: "کاربر حذف شد" });
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

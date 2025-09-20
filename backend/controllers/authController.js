/**
 * @route POST /api/auth/create-support
 * @desc Create new support user (admin only)
 */
export const createSupport = asyncHandler(async (req, res) => {
    // Only admin can create new support
    if (!req.user || req.user.role !== "admin") {
        res.status(403);
        throw new Error("Access denied, admin only");
    }
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
        res.status(400);
        throw new Error("Please provide name, username, email and password");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    const supportUser = await User.create({
        name,
        username,
        email,
        password,
        role: "support"
    });
    if (supportUser) {
        res.status(201).json({
            _id: supportUser._id,
            name: supportUser.name,
            username: supportUser.username,
            email: supportUser.email,
            role: supportUser.role
        });
    } else {
        res.status(400);
        throw new Error("Invalid support data");
    }
});
/**
 * @route POST /api/auth/create-admin
 * @desc Create new admin user (admin only)
 */
export const createAdmin = asyncHandler(async (req, res) => {
    console.log("دریافتی create-admin:", req.body);
    // Only admin can create new admin
    if (!req.user || req.user.role !== "admin") {
        res.status(403);
        throw new Error("Access denied, admin only");
    }
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
        res.status(400);
        throw new Error("Please provide name, username, email and password");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    const adminUser = await User.create({
        name,
        username,
        email,
        password,
        role: "admin"
    });
    if (adminUser) {
        res.status(201).json({
            _id: adminUser._id,
            name: adminUser.name,
            username: adminUser.username,
            email: adminUser.email,
            role: adminUser.role
        });
    } else {
        res.status(400);
        throw new Error("Invalid admin data");
    }
});
/**
 * @route PUT /api/auth/profile
 * @desc Update user profile (protected)
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Update allowed fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.lastName = req.body.lastName || user.lastName;
    user.username = req.body.username || user.username;
    user.province = req.body.province || user.province;
    user.city = req.body.city || user.city;
    user.address = req.body.address || user.address;
    user.postCode = req.body.postCode || user.postCode;
    user.mobile = req.body.mobile || user.mobile;

    // Save updated user
    const updatedUser = await user.save();
    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        lastName: updatedUser.lastName,
        username: updatedUser.username,
        province: updatedUser.province,
        city: updatedUser.city,
        address: updatedUser.address,
        postCode: updatedUser.postCode,
        mobile: updatedUser.mobile,
        role: updatedUser.role
    });
});
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";

/**
 * @route POST /api/auth/register
 * @desc Register new user
 */
export const registerUser = asyncHandler(async (req, res) => {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
        res.status(400);
        throw new Error("Please provide username, email and password");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({ name, username, email, password });
    if (user) {
        // ست کردن توکن در کوکی httpOnly
        const token = generateToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 روز
        });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

/**
 * @route POST /api/auth/login
 * @desc Login user
 */
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("Please provide email and password");
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        // ست کردن توکن در کوکی httpOnly
        const token = generateToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 روز
        });
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

/**
 * @route GET /api/auth/profile
 * @desc Get user profile (protected)
 */
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

/**
 * @route POST /api/auth/reset-password
 * @desc Send reset-password token (simple flow)
 */
export const resetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400);
        throw new Error("Please provide email");
    }

    const user = await User.findOne({ email });
    if (!user) {
        // for security, respond with success message (avoid exposing user existence)
        return res.json({ message: "If the email exists, you will receive reset instructions." });
    }

    // create token and save hashed token/expiry in DB
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // create reset URL (in real app send via email)
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password/${resetToken}`;

    // Here you would send email. For now return message with resetUrl (dev)
    // NOTE: In production you should send email and NOT return the token in response
    res.json({ message: "Password reset link (dev): " + resetUrl });
});

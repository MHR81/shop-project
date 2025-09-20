// بررسی نقش support برای دسترسی به روت‌های ساپورت
export const support = (req, res, next) => {
    if (req.user && req.user.role === "support") {
        next();
    } else {
        res.status(403);
        throw new Error("Access denied, support only");
    }
};
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";


export const protect = asyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization || req.cookies?.token;

    if (authHeader && authHeader.startsWith?.("Bearer")) {
        token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
    }
});

// بررسی نقش admin برای دسترسی به روت‌های خاص
export const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403);
        throw new Error("Access denied, admin only");
    }
};

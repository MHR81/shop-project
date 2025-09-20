import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";

// ایجاد سفارش جدید
export const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;
    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error("سفارش خالی است");
    }
    const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
});

// دریافت سفارش‌های کاربر
export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

// دریافت همه سفارش‌ها (ادمین)
export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
});

// دریافت سفارش با آیدی
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (order) res.json(order);
    else {
        res.status(404);
        throw new Error("سفارش پیدا نشد");
    }
});

// تغییر وضعیت پرداخت
export const payOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = req.body.paymentResult;
        await order.save();
        res.json(order);
    } else {
        res.status(404);
        throw new Error("سفارش پیدا نشد");
    }
});

// تغییر وضعیت ارسال
export const deliverOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        await order.save();
        res.json(order);
    } else {
        res.status(404);
        throw new Error("سفارش پیدا نشد");
    }
});

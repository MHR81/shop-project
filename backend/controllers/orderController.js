import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Log from "../models/Log.js";

// ایجاد سفارش جدید
export const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice, isPaid, paidAt, paymentResult } = req.body;
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
        totalPrice,
        isPaid: !!isPaid,
        paidAt: isPaid ? paidAt : undefined,
        paymentResult: isPaid ? paymentResult : undefined
    });
    const createdOrder = await order.save();
    // ثبت لاگ ایجاد سفارش
    await Log.create({
        user: req.user?._id,
        action: "ایجاد سفارش",
        details: `سفارش جدید توسط ${req.user?.email || "سیستم"} ثبت شد. شماره سفارش: ${createdOrder._id}`
    });
    if (isPaid) {
        await Log.create({
            user: req.user?._id,
            action: "پرداخت سفارش",
            details: `سفارش شماره ${createdOrder._id} توسط ${req.user?.email || "سیستم"} پرداخت شد.`
        });
    }
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

// حذف همه سفارش‌ها (ادمین)
export const deleteAllOrders = asyncHandler(async (req, res) => {
    await Order.deleteMany({});
    await Log.create({
        user: req.user?._id,
        action: "حذف همه سفارش‌ها",
        details: `همه سفارش‌ها توسط ${req.user?.email || "سیستم"} حذف شدند.`
    });
    res.json({ message: "همه سفارش‌ها حذف شدند" });
});

// حذف سفارش با آیدی (ادمین)
export const deleteOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error("سفارش پیدا نشد");
    }
    await order.deleteOne();
    await Log.create({
        user: req.user?._id,
        action: "حذف سفارش",
        details: `سفارش شماره ${order._id} توسط ${req.user?.email || "سیستم"} حذف شد.`
    });
    res.json({ message: "سفارش حذف شد" });
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

        // کاهش موجودی محصولات پس از پرداخت موفق
        const Product = (await import("../models/Product.js")).default;
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.countInStock = Math.max(0, product.countInStock - item.qty);
                await product.save();
                // ثبت لاگ کاهش موجودی
                await Log.create({
                    user: req.user?._id,
                    action: "کاهش موجودی محصول",
                    details: `موجودی محصول ${product.name} (${product._id}) به دلیل سفارش ${order._id} توسط ${req.user?.email || "سیستم"} کاهش یافت. مقدار کاهش: ${item.qty}`
                });
            }
        }

        await order.save();
        // ثبت لاگ پرداخت سفارش
        await Log.create({
            user: req.user?._id,
            action: "پرداخت سفارش",
            details: `سفارش شماره ${order._id} توسط ${req.user?.email || "سیستم"} پرداخت شد.`
        });
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
        // ثبت لاگ ارسال سفارش
        await Log.create({
            user: req.user?._id,
            action: "ارسال سفارش",
            details: `سفارش شماره ${order._id} توسط ${req.user?.email || "سیستم"} ارسال شد.`
        });
        res.json(order);
    } else {
        res.status(404);
        throw new Error("سفارش پیدا نشد");
    }
});

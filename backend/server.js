import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDB from "./config/db.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import logRoutes from "./routes/logRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middlewares
import rateLimit from "express-rate-limit";

// ریت‌لیمیت حرفه‌ای برای کل API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقیقه
    max: process.env.NODE_ENV === "production" ? 100 : 10000, // در توسعه بسیار بالا
    message: { message: "تعداد درخواست شما بیش از حد مجاز است. لطفا بعدا تلاش کنید." },
    standardHeaders: true,
    legacyHeaders: false,
});
if (process.env.NODE_ENV === "production") {
    app.use("/api/", apiLimiter);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(morgan("dev"));

// Routes
import uploadRoutes from "./routes/uploadRoutes.js";
import path from "path";

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/upload", uploadRoutes);

// سرو کردن فایل‌های آپلود شده
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Error handling middleware (after routes)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import logRoutes from "./routes/logRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();

// روت اصلی برای جلوگیری از ارور 404
app.get('/', (req, res) => {
    res.status(200).json({ message: 'API is running.' });
});

// security & logging
app.use(helmet());
app.use(morgan("dev"));

// body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS: اجازه فقط برای فرانت محلی/production که مشخص میکنی
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(cors({
    origin: allowedOrigin,
    credentials: true,
}));

// rate limiter (protect brute force)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100
});
app.use(limiter);

// routes

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/logs", logRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

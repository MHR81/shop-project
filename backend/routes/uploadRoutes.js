
import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "myshop",
    api_key: process.env.CLOUDINARY_API_KEY || "753945665471766",
    api_secret: process.env.CLOUDINARY_API_SECRET || "BljROWDiRI7Ln0tNTqShDhUaB9w"
});

const router = express.Router();

router.post("/", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
    }
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "products"
        });
        // حذف فایل لوکال بعد از آپلود
        fs.unlinkSync(req.file.path);
        res.json({ imageUrl: result.secure_url });
    } catch (error) {
        res.status(500).json({ message: "Cloudinary upload failed", error: error.message });
    }
});

export default router;

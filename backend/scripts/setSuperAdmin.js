import mongoose from "mongoose";
import User from "../models/User.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/shop";

async function setSuperAdmin() {
    await mongoose.connect(MONGO_URI);
    const user = await User.findOne({ username: "mhr81" });
    if (!user) {
        console.log("کاربری با نام کاربری سوپرادمین پیدا نشد.");
        process.exit(1);
    }
    user.mainAdmin = true;
    user.role = "admin";
    await user.save();
    console.log("کاربر سوپرادمین اکنون ادمین اصلی است و نقش او قابل تغییر نیست.");
    process.exit(0);
}

setSuperAdmin();

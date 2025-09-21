import mongoose from "mongoose";
import User from "../models/User.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/shop";


// ایمیل‌های سوپرادمین‌ها را اینجا وارد کنید
const superAdminEmails = [
    "hosein81rahimi@gmail.com",
    // هر ایمیل دیگری که خواستید اضافه کنید
];

async function setSuperAdmins() {
    await mongoose.connect(MONGO_URI);
    const users = await User.find({ email: { $in: superAdminEmails } });
    if (!users.length) {
        console.log("هیچ کاربری با ایمیل‌های سوپرادمین پیدا نشد.");
        process.exit(1);
    }
    for (const user of users) {
        user.mainAdmin = true;
        user.role = "admin";
        await user.save();
        console.log(`کاربر با ایمیل ${user.email} اکنون سوپرادمین است و نقش او قابل تغییر نیست.`);
    }
    process.exit(0);
}

setSuperAdmins();

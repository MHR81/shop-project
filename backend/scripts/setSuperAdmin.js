import mongoose from "mongoose";
import User from "../models/User.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/shop";


// ایمیل‌های سوپرادمین‌ها را اینجا وارد کنید
const superAdminEmails = [
    "hosein81rahimi@gmail.com"
    // هر ایمیل دیگری که خواستید اضافه کنید
];

async function setSuperAdmins() {
    await mongoose.connect(MONGO_URI);
    const users = await User.find({ email: { $in: superAdminEmails } });
    console.log("کاربران پیدا شده:");
    users.forEach(u => console.log(`- ${u.email} | mainAdmin: ${u.mainAdmin}`));
    if (!users.length) {
        // نمایش همه ایمیل‌های موجود برای دیباگ
        const allUsers = await User.find({}, { email: 1, username: 1 });
        console.log("ایمیل‌های موجود در دیتابیس:");
        allUsers.forEach(u => console.log(`- ${u.email}`));
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

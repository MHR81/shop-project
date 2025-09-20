import axios from "axios";
import asyncHandler from "express-async-handler";

// دریافت لیست کشورها
export const getCountries = asyncHandler(async (req, res) => {
    const response = await axios.get("https://restcountries.com/v3.1/all");
    const countries = response.data.map(c => ({
        name: c.name.common,
        code: c.cca2
    }));
    res.json(countries);
});

// دریافت لیست استان‌های ایران
export const getProvinces = asyncHandler(async (req, res) => {
    // لیست استان‌ها به صورت ثابت (در صورت نیاز می‌توان از API خارجی استفاده کرد)
    const provinces = [
        "تهران", "اصفهان", "فارس", "آذربایجان شرقی", "آذربایجان غربی", "خراسان رضوی", "گیلان", "مازندران"
    ];
    res.json(provinces);
});

// دریافت لیست شهرها بر اساس استان
export const getCities = asyncHandler(async (req, res) => {
    const province = req.query.province;
    const citiesByProvince = {
        "تهران": ["تهران", "ری", "شمیرانات"],
        "اصفهان": ["اصفهان", "کاشان", "خمینی‌شهر"],
        "فارس": ["شیراز", "مرودشت", "جهرم"],
        "آذربایجان شرقی": ["تبریز", "مراغه", "مرند"],
        "آذربایجان غربی": ["ارومیه", "خوی", "میاندوآب"],
        "خراسان رضوی": ["مشهد", "نیشابور", "سبزوار"],
        "گیلان": ["رشت", "لاهیجان", "انزلی"],
        "مازندران": ["ساری", "بابل", "آمل"]
    };
    res.json(citiesByProvince[province] || []);
});

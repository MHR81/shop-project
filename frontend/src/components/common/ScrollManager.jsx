// src/components/common/ScrollManager.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollManager() {
    const location = useLocation();

    useEffect(() => {
        // فعال‌کردن مدیریت دستی اسکرول
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }

        // ذخیره موقعیت قبلی اسکرول هنگام تغییر صفحه
        return () => {
            sessionStorage.setItem(location.key, window.scrollY.toString());
        };
    }, [location]);

    useEffect(() => {
        const savedY = sessionStorage.getItem(location.key);

        if (savedY) {
            // بازگشت به موقعیت ذخیره شده (برای Back/Forward)
            window.scrollTo({
                top: parseInt(savedY, 10),
                behavior: "smooth", // اسکرول نرم
            });
        } else {
            // رفتن به بالای صفحه (برای صفحه جدید)
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    }, [location.key]);

    return null;
}

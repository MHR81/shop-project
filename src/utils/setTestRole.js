// استفاده فقط برای تست! بعداً حذف شود.
export function setTestRole(role = "user") {
    localStorage.setItem("token", "test-token");
    localStorage.setItem("role", role);
}
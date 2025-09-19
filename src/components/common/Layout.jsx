// src/components/common/Layout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import UpdatePrompt from "./UpdatePrompt.jsx"; // <-- اضافه شد

export default function Layout({ theme, setTheme }) {
    return (
        <div className="layout-container">
            {/* Update prompt باید بالاتر از بقیه باشه تا همیشه قابل مشاهده باشه */}
            <UpdatePrompt />
            <div className="container">
                <Navbar theme={theme} setTheme={setTheme} />
                <Outlet />
                <Footer />
            </div>
        </div>
    );
}

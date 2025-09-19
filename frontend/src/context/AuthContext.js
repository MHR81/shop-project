import { createContext, useContext, useState, useEffect } from "react";
import { loginUser as apiLoginUser } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("userInfo")) || null
    );

    useEffect(() => {
        if (user) {
            localStorage.setItem("userInfo", JSON.stringify(user));
        } else {
            localStorage.removeItem("userInfo");
        }
    }, [user]);

    // تابع لاگین با ارسال email و password به بک‌اند
    const loginUser = async (email, password) => {
        const data = await apiLoginUser(email, password);
        setUser(data);
        return data;
    };

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

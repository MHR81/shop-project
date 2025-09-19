import axios from "axios";

const AUTH_BASE = process.env.REACT_APP_AUTH_URL; // از .env می‌خونه

export const loginUser = async (email, password) => {
    const res = await axios.post(
        `${AUTH_BASE}/login`,
        { email, password },
        { headers: { "x-api-key": "reqres-free-v1" } }
    );
    return res.data;
};

export const registerUser = async (email, password) => {
    const res = await axios.post(`${AUTH_BASE}/register`, { email, password });
    return res.data;
};

// Create Admin
import axios from "axios";

export const createAdmin = async (token, adminData) => {
    const { data } = await axios.post(`${API_URL}/create-admin`, {
        name: adminData.name,
        username: adminData.username,
        email: adminData.email,
        password: adminData.password
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};


const API_URL = process.env.REACT_APP_AUTH_URL;

// Login
export const loginUser = async (email, password) => {
    const { data } = await axios.post(`${API_URL}/login`, { email, password });
    return data;
};

// Register
export const registerUser = async (username, email, password) => {
    const { data } = await axios.post(`${API_URL}/register`, { name: username, username, email, password });
    return data;
};

// Get Profile
export const getProfile = async (token) => {
    const { data } = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

// Update Profile
export const updateProfile = async (token, profileData) => {
    const { data } = await axios.put(`${API_URL}/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

// Reset Password
export const resetPassword = async (email) => {
    const { data } = await axios.post(`${API_URL}/reset-password`, { email });
    return data;
};

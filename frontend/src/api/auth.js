import axios from "axios";

// Change Password (Admin/User)
export const changePassword = async (token, currentPassword, newPassword) => {
    const { data } = await axios.post(`${API_URL}/change-password`, { currentPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

// Ticket APIs
export const createTicket = async (token, ticketData) => {
    const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/tickets`, ticketData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

export const getAllTickets = async (token) => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/tickets/all`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

export const answerTicket = async (token, ticketId, answer) => {
    const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/tickets/${ticketId}/answer`, { answer }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};


// Create Support
export const createSupport = async (token, supportData) => {
    const { data } = await axios.post(`${API_URL}/create-support`, {
        name: supportData.name,
        username: supportData.username,
        email: supportData.email,
        password: supportData.password
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

// Create Admin

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

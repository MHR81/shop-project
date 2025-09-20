import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const sendMessage = async (token, ticketId, text) => {
    const res = await axios.post(`${API_URL}/messages/${ticketId}`, { text }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const getMessages = async (token, ticketId) => {
    const res = await axios.get(`${API_URL}/messages/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const editMessage = async (token, messageId, text) => {
    const res = await axios.put(`${API_URL}/messages/edit/${messageId}`, { text }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const deleteMessage = async (token, messageId) => {
    const res = await axios.delete(`${API_URL}/messages/delete/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

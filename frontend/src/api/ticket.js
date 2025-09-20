import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const createTicket = async (token, data) => {
    const res = await axios.post(`${API_URL}/tickets`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const getUserTickets = async (token) => {
    const res = await axios.get(`${API_URL}/tickets/my`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const getTicketDetails = async (token, id) => {
    const res = await axios.get(`${API_URL}/tickets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const closeTicket = async (token, id) => {
    const res = await axios.put(`${API_URL}/tickets/${id}/close`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const deleteTicket = async (token, id) => {
    const res = await axios.delete(`${API_URL}/tickets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const getSupportTickets = async (token) => {
    const res = await axios.get(`${API_URL}/tickets/all`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

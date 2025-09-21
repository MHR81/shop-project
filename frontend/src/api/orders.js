import axios from "axios";
export const createOrder = (token, orderData) => axios.post(`${API_URL}/orders`, orderData, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);

const API_URL = process.env.REACT_APP_API_URL;
export const deleteAllOrders = (token) => axios.delete(`${API_URL}/orders/all`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);
export const deleteOrderById = (token, id) => axios.delete(`${API_URL}/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);

export const getAllOrders = (token) => axios.get(`${API_URL}/orders/all`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);
export const getMyOrders = (token) => axios.get(`${API_URL}/orders/myorders`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);
export const getOrderById = (token, id) => axios.get(`${API_URL}/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);
export const deliverOrder = (token, id) => axios.put(`${API_URL}/orders/${id}/deliver`, {}, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);
export const payOrder = (token, id, paymentResult) => axios.put(`${API_URL}/orders/${id}/pay`, { paymentResult }, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);

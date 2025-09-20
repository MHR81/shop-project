import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const getAllUsers = (token) => axios.get(`${API_URL}/users`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);
export const getUserById = (token, id) => axios.get(`${API_URL}/users/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);
export const updateUser = (token, id, data) => axios.put(`${API_URL}/users/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);
export const deleteUser = (token, id) => axios.delete(`${API_URL}/users/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);

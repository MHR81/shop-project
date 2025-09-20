import axios from "axios";
const API_BASE = process.env.REACT_APP_API_URL; // از .env می‌خونه

export const createCategory = async (token, data) => {
  const res = await axios.post(`${API_BASE}/categories`, data, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const updateCategory = async (token, id, data) => {
  const res = await axios.put(`${API_BASE}/categories/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const deleteCategory = async (token, id) => {
  const res = await axios.delete(`${API_BASE}/categories/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const getAllProducts = async () => {
  const res = await axios.get(`${API_BASE}/products`);
  return res.data;
};

export const getProductById = async (id) => {
  const res = await axios.get(`${API_BASE}/products/${id}`);
  return res.data;
};

export const getCategories = async (token) => {
  const res = await axios.get(`${API_BASE}/categories`, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
  return res.data;
};

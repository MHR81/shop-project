import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL; // از .env می‌خونه

export const getAllProducts = async () => {
  const res = await axios.get(`${API_BASE}/products`);
  return res.data;
};

export const getProductById = async (id) => {
  const res = await axios.get(`${API_BASE}/products/${id}`);
  return res.data;
};

export const getCategories = async () => {
  const res = await axios.get(`${API_BASE}/products`);
  const uniqueCategories = [...new Set(res.data.map(item => item.category))];
  return uniqueCategories;
};

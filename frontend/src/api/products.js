import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// همه محصولات
export const getAllProducts = () => axios.get(`${API_URL}/products`).then(res => res.data);

// محصول بر اساس ID
export const getProductById = (id) => axios.get(`${API_URL}/products/${id}`).then(res => res.data);

import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// همه محصولات با فیلتر
export const getAllProducts = (filter = {}) => {
	const params = {};
	if (filter.category) params.category = filter.category;
	if (filter.minPrice) params.minPrice = filter.minPrice;
	if (filter.maxPrice) params.maxPrice = filter.maxPrice;
	if (filter.search) params.search = filter.search;
	if (filter.inStock) params.inStock = true;
	if (filter.sort) params.sort = filter.sort;
	return axios.get(`${API_URL}/products`, { params }).then(res => res.data);
};

// محصول بر اساس ID
export const getProductById = (id) => axios.get(`${API_URL}/products/${id}`).then(res => res.data);

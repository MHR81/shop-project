// دریافت محصولات بر اساس کتگوری
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

export const getProductsByCategory = (categoryId) => {
    return axios.get(`${API_URL}/products`, { params: { category: categoryId } })
        .then(res => res.data);
};

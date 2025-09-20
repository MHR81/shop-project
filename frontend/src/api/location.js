import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

export const getCountries = () => axios.get(`${API_URL}/location/countries`).then(res => res.data);
export const getProvinces = () => axios.get(`${API_URL}/location/provinces`).then(res => res.data);
export const getCities = (province) => axios.get(`${API_URL}/location/cities`, { params: { province } }).then(res => res.data);

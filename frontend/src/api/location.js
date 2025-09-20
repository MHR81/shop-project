import axios from "axios";

export const getProvinces = () => axios.get("https://iranplacesapi.liara.run/api/provinces").then(res => res.data);
export const getCitiesByProvinceName = (provinceName) => axios.get(`https://iranplacesapi.liara.run/api/provinces/name/${provinceName}/cities`).then(res => res.data);

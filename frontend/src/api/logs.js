
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "/api";

export const getUserLogs = async (token, userId) => {
  try {
    const res = await axios.get(`${API_URL}/logs?user=${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    // اگر خطا بود، آرایه خالی برگردان تا صفحه نپرد
    return [];
  }
};

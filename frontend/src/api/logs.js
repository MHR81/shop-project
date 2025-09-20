import axios from "axios";

export const getUserLogs = async (token, userId) => {
  const res = await axios.get(`/api/logs?user=${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

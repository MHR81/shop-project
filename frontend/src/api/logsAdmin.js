import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const deleteAllLogs = async (token) => {
  const res = await axios.delete(`${API_URL}/logs-admin/all`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteUserLogs = async (token, userId) => {
  const res = await axios.delete(`${API_URL}/logs-admin/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

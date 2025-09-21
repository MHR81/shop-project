import axios from "axios";

export const deleteAllLogs = async (token) => {
  const res = await axios.delete("/api/logs-admin/all", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteUserLogs = async (token, userId) => {
  const res = await axios.delete(`/api/logs-admin/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

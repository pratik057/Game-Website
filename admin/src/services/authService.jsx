import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

export const loginAdmin = async (email, password) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  localStorage.setItem("adminToken", res.data.token);
  return res.data;
};

export const logoutAdmin = () => {
  localStorage.removeItem("adminToken");
};

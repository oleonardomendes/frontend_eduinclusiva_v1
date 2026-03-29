import axios from "axios";

// ⚙️ Substitua pela URL do seu backend local ou hospedado no Render
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const createActivity = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/atividades`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const getActivities = async () => {
  const response = await axios.get(`${API_BASE_URL}/atividades`);
  return response.data;
};

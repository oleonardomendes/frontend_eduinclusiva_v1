// src/api/api.js
import axios from "axios";

// URL base do backend FastAPI (ajuste se estiver em nuvem)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// ========== AUTENTICAÇÃO ==========
export const login = async (email, senha) => {
  const response = await api.post("/auth/login", { email, senha });
  return response.data;
};

// ========== ALUNOS ==========
export const getAlunos = async () => {
  const response = await api.get("/alunos");
  return response.data;
};

export const createAluno = async (aluno) => {
  const response = await api.post("/alunos", aluno);
  return response.data;
};

// ========== PLANOS ==========
export const getPlanosAluno = async (alunoId) => {
  const response = await api.get(`/planos/${alunoId}`);
  return response.data;
};

export const gerarPlanoAdaptado = async (payload) => {
  // payload esperado: { aluno_id, descricao_aluno, conteudo, materia, competencia }
  const response = await api.post("/gerar_plano", payload);
  return response.data;
};

// ========== UPLOAD DE ATIVIDADES ==========
export const uploadPDF = async (file, alunoId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("aluno_id", alunoId);

  const response = await axios.post(`${API_BASE_URL}/api/upload_pdf`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// ========== RELATÓRIOS ==========
export const getRelatorioAluno = async (alunoId) => {
  const response = await api.get(`/relatorios/aluno/${alunoId}`);
  return response.data;
};

export default api;

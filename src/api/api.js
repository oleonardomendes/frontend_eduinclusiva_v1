// src/api/api.js
import axios from "axios";

// mesma env que está no Vercel: VITE_API_BASE_URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Centralize o prefixo de versão aqui
const API_PREFIX = "/v1";

// Instância Axios com base URL correta
export const api = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`, // ex.: https://backend.../v1
  headers: { "Content-Type": "application/json" },
});

// Anexa o Bearer token automaticamente (se existir)
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== AUTENTICAÇÃO ==========
export async function login(email, senha) {
  const { data } = await api.post("/auth/login", { email, senha });
  // Se o back devolver { access_token }, já salva localmente
  if (data?.access_token) {
    localStorage.setItem("token", data.access_token);
  }
  return data;
}

// ========== ALUNOS ==========
export async function getAlunos() {
  const { data } = await api.get("/alunos");
  return data;
}

export async function createAluno(aluno) {
  const { data } = await api.post("/alunos", aluno);
  return data;
}

// ========== IA / PLANOS ==========
export async function gerarPlanoAdaptado(payload) {
  // payload: { aluno_id, descricao_aluno, conteudo, materia, competencia }
  const { data } = await api.post("/ai/gerar_plano", payload);
  return data;
}

export async function getHistoricoPlanos(alunoId) {
  // backend: GET /v1/ai/historico/{aluno_id}
  const { data } = await api.get(`/ai/historico/${alunoId}`);
  return data;
}

// ========== UPLOAD DE ATIVIDADES (PDF/TEXTO) ==========
export async function uploadPDF(file, alunoId, extra = {}) {
  // extra pode conter { tipo: 'resposta', descricao: '...' } se seu ingest aceitar
  const formData = new FormData();
  formData.append("file", file);
  Object.entries(extra).forEach(([k, v]) => formData.append(k, v));

  const { data } = await api.post(`/pdf/ingest?aluno_id=${alunoId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export default api;
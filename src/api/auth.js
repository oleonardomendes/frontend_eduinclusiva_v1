// src/api/api.js
import axios from "axios";

// Base vem do Vercel/Vite (Settings → Environment Variables)
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

// Instância central com prefixo /v1
export const api = axios.create({
  baseURL: `${API_BASE_URL}/v1`,
  headers: { "Content-Type": "application/json" },
});

// Anexa token automaticamente em todas as requisições
api.interceptors.request.use((cfg) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    cfg.headers = cfg.headers ?? {};
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

// Opcional: se der 401, limpa token e volta ao /login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      // Evita loop de redirecionamento
      if (typeof window !== "undefined" && location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }
    return Promise.reject(err);
  }
);

// ===== Endpoints que seu front usa =====

// Alunos
export async function getAlunos() {
  const { data } = await api.get("/alunos");
  return data;
}

export async function createAluno(aluno) {
  const { data } = await api.post("/alunos", aluno);
  return data;
}

// IA / Planos
export async function gerarPlanoAdaptado(payload) {
  // payload: { aluno_id, descricao_aluno, conteudo, materia, competencia }
  const { data } = await api.post("/ai/gerar_plano", payload);
  return data;
}

export async function getHistoricoPlanos(alunoId) {
  const { data } = await api.get(`/ai/historico/${alunoId}`);
  return data;
}

// Upload (PDF / ingest) — ajuste se seu endpoint aceitar outros campos
export async function uploadPDF(file, alunoId, extra = {}) {
  const formData = new FormData();
  formData.append("file", file);
  Object.entries(extra).forEach(([k, v]) => formData.append(k, v));

  const { data } = await api.post(`/pdf/ingest?aluno_id=${alunoId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
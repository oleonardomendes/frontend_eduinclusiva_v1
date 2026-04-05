// src/api/api.js
import axios from "axios";

// mesma env que está no Vercel: VITE_API_BASE_URL
// ex.: https://backend-eduinclusiva-v1.onrender.com
const RAW_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

// remove barra(s) à direita para evitar //v1
const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");

// Centralize o prefixo de versão aqui
const API_PREFIX = "/v1";

// Instância Axios com base URL correta
export const api = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`, // ex.: https://backend.../v1
  headers: { "Content-Type": "application/json" },
  // opcional: habilite se quiser evitar pendurar demais:
  // timeout: 20000,
});

// Anexa o Bearer token automaticamente (se existir)
api.interceptors.request.use((config) => {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore storage errors
  }
  return config;
});

// Opcional: em 401, limpa token e volta ao /login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      try {
        localStorage.removeItem("token");
      } catch {}
      if (typeof window !== "undefined" && location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }
    return Promise.reject(err);
  }
);

// ========== AUTENTICAÇÃO ==========
export async function login(email, senha) {
  const { data } = await api.post("/auth/login", { email, senha });
  // Se o back devolver { access_token }, já salva localmente
  if (data?.access_token) {
    try {
      localStorage.setItem("token", data.access_token);
    } catch {}
  }
  return data;
}

// ========== ALUNOS ==========
export async function getAlunos() {
  const { data } = await api.get("/alunos");
  return data;
}

export async function getAluno(id) {
  const { data } = await api.get(`/alunos/${id}`);
  return data;
}

export async function getAlunoMetricas(id) {
  const { data } = await api.get(`/alunos/${id}/metricas`);
  return data;
}

export async function createAluno(aluno) {
  const { data } = await api.post("/alunos", aluno);
  return data;
}

export async function getPlanos(alunoId) {
  const { data } = await api.get(`/planos/${alunoId}`);
  return data;
}

// ========== METAS ==========
export async function getMetas(ano) {
  const { data } = await api.get(`/metas/?ano=${ano}`);
  return data;
}

export async function createMeta(payload) {
  const { data } = await api.post("/metas/", payload);
  return data;
}

export async function updateMeta(id, payload) {
  const { data } = await api.put(`/metas/${id}`, payload);
  return data;
}

// ========== AVALIAÇÕES ==========
export async function getAvaliacoesResumo(ano) {
  const { data } = await api.get(`/avaliacoes/resumo/?ano=${ano}`);
  return data;
}

export async function createAvaliacao(payload) {
  const { data } = await api.post("/avaliacoes/", payload);
  return data;
}

export async function getAvaliacoes(params = {}) {
  const query = new URLSearchParams(params).toString();
  const { data } = await api.get(`/avaliacoes/${query ? `?${query}` : ''}`);
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

export async function gerarAtividade(aluno_id, parametros = {}) {
  const { data } = await api.post("/ai/gerar_atividade", { aluno_id, ...parametros });
  return data;
}

export async function getAtividadesGeradas(aluno_id) {
  const { data } = await api.get(`/ai/atividades/${aluno_id}`);
  return data;
}

export async function concluirAtividade(atividade_id, payload) {
  const { data } = await api.patch(`/ai/atividades/${atividade_id}/concluir`, payload);
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
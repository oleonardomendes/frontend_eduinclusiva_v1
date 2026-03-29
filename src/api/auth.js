// src/api/auth.js
import { api } from './api';

/**
 * Faz login no backend e salva o token no localStorage.
 * Envia { email, senha } para POST /v1/auth/login.
 */
export async function login(email, senha) {
  const { data } = await api.post('/auth/login', { email, senha });
  if (data?.access_token) {
    try {
      localStorage.setItem('token', data.access_token);
    } catch {
      // ignore storage errors (modo privado, etc.)
    }
  }
  return data;
}

/**
 * Limpa token e currentUser e (opcionalmente) redireciona para /login.
 */
export function logout(redirect = true) {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  } catch {
    // ignore
  }
  if (redirect && typeof window !== 'undefined') {
    window.location.replace('/login');
  }
}
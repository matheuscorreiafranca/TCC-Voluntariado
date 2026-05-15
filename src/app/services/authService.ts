import { apiPost } from './apiClient';

const TOKEN_KEY = 'voluntamais_token';
const USER_KEY = 'voluntamais_user';

export interface AuthResponse {
  token: string;
  usuarioId: number;
  voluntarioId?: number;
  instituicaoId?: number;
  nome: string;
  email: string;
  tipo: string;
}

export interface AuthUser {
  usuarioId: number;
  voluntarioId?: number;
  instituicaoId?: number;
  nome: string;
  email: string;
  tipo: string;
}

export async function login(email: string, senha: string): Promise<AuthResponse> {
  const response = await apiPost<AuthResponse>('/Auth/login', { email, senha });

  // Salvar no localStorage
  localStorage.setItem(TOKEN_KEY, response.token);
  localStorage.setItem(USER_KEY, JSON.stringify({
    usuarioId: response.usuarioId,
    voluntarioId: response.voluntarioId,
    instituicaoId: response.instituicaoId,
    nome: response.nome,
    email: response.email,
    tipo: response.tipo,
  }));

  return response;
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;

  // Decodificar o payload do JWT para verificar expiração
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // converter para ms
    return Date.now() < exp;
  } catch {
    return false;
  }
}

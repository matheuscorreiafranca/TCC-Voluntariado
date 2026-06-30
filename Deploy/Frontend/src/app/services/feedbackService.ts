import { apiGet, apiPost } from './apiClient';

export type AutorFeedback = 'Instituicao' | 'Voluntario';

export interface ApiUsuarioResumo {
  id: number;
  nome: string;
  email: string;
}

export interface ApiVoluntarioResumo {
  id: number;
  usuarioId: number;
  usuario?: ApiUsuarioResumo | null;
}

export interface ApiInstituicaoResumo {
  id: number;
  nome: string;
  responsavel?: string | null;
}

export interface ApiOportunidadeResumo {
  id: number;
  instituicaoId: number;
  titulo: string;
  tipo: string;
  cidade?: string | null;
  estado?: string | null;
  instituicao?: ApiInstituicaoResumo | null;
}

export interface ApiInscricao {
  id: number;
  oportunidadeId: number;
  voluntarioId: number;
  status: string;
  criadoEm: string;
  atualizadoEm?: string | null;
  oportunidade?: ApiOportunidadeResumo | null;
  voluntario?: ApiVoluntarioResumo | null;
}

export interface ApiFeedback {
  id: number;
  inscricaoId: number;
  autor: AutorFeedback;
  nota: number;
  comentario?: string | null;
  respostasJson?: string | null;
  criadoEm: string;
  inscricao?: ApiInscricao | null;
}

export interface CriarFeedbackPayload {
  inscricaoId: number;
  autor: AutorFeedback;
  nota: number;
  comentario?: string;
  respostasJson?: string;
}

export function listarInscricoes(): Promise<ApiInscricao[]> {
  return apiGet<ApiInscricao[]>('/inscricoes');
}

export function listarFeedbacks(): Promise<ApiFeedback[]> {
  return apiGet<ApiFeedback[]>('/feedback');
}

export function criarFeedback(payload: CriarFeedbackPayload): Promise<ApiFeedback> {
  return apiPost<ApiFeedback>('/feedback', payload);
}

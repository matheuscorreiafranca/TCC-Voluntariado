import { apiGet, apiPatch, apiPut, apiDelete } from './apiClient';

export interface AdminResumo {
  usuarios: number;
  voluntarios: number;
  instituicoes: number;
  oportunidades: number;
  inscricoes: number;
  pendentes: number;
  aprovadas: number;
  reprovadas: number;
  concluidas: number;
}

export interface AdminInscricao {
  id: number;
  oportunidadeId: number;
  oportunidadeTitulo: string;
  instituicao: string;
  voluntarioId: number;
  voluntarioNome: string;
  voluntarioEmail: string;
  status: string;
  motivoReprovacao?: string | null;
  motivacao?: string | null;
  disponibilidade?: string | null;
  experiencia?: string | null;
  afinidades: string[];
  dataInsercao: string;
  dataAtualizacao?: string | null;
}

export interface AdminOportunidade {
  id: number;
  titulo: string;
  descricao?: string | null;
  tipo: string;
  status: string;
  categoria?: string | null;
  instituicao: string;
  cidade?: string | null;
  estado?: string | null;
  dataInicio: string;
  dataFim?: string | null;
  vagas: number;
  vagasOcupadas: number;
  vagasDisponiveis: number;
}

export interface AdminUsuario {
  id: number;
  nome: string;
  email: string;
  tipo: string;
  telefone?: string | null;
  cidade?: string | null;
  estado?: string | null;
  ativo: boolean;
  dataInsercao: string;
}

export interface AdminInstituicao {
  id: number;
  nome: string;
  responsavel?: string | null;
  status: string;
  usuarioId: number;
  email: string;
  dataInsercao: string;
}

export interface AdminDashboard {
  resumo: AdminResumo;
  inscricoes: AdminInscricao[];
  oportunidades: AdminOportunidade[];
  usuarios: AdminUsuario[];
  instituicoes: AdminInstituicao[];
}

export interface AdminActionResponse {
  id: number;
  oportunidadeId: number;
  voluntarioId: number;
  status: string;
  motivoReprovacao?: string | null;
  message: string;
}

export function carregarDashboardAdmin(): Promise<AdminDashboard> {
  return apiGet<AdminDashboard>('/Admin/dashboard');
}

export function aprovarInscricao(id: number): Promise<AdminActionResponse> {
  return apiPatch<AdminActionResponse>(`/Inscricoes/${id}/aprovar`);
}

export async function reprovarInscricao(id: number, motivoReprovacao: string): Promise<any> {
  return apiPatch(`/Inscricoes/${id}/reprovar`, { motivoReprovacao });
}

export async function finalizarInscricao(id: number, cargaHoraria: number): Promise<{ message: string }> {
  return apiPatch(`/Inscricoes/${id}/finalizar`, { horas: cargaHoraria });
}

export async function obterDetalhesUsuario(id: number): Promise<any> {
  return apiGet(`/Admin/usuarios/${id}`);
}

export async function banirUsuario(id: number): Promise<{ message: string }> {
  return apiPatch(`/Admin/usuarios/${id}/banir`, {});
}

export function atualizarOportunidade(id: number, payload: Partial<AdminOportunidade>): Promise<any> {
  return apiPut<any>(`/Oportunidades/${id}`, payload);
}

export function deletarOportunidade(id: number): Promise<any> {
  return apiDelete<any>(`/Oportunidades/${id}`);
}

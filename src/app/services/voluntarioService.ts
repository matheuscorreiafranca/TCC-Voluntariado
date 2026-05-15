import { apiPost, apiGet } from './apiClient';

export interface CadastroVoluntarioPayload {
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  senha: string;
  dataNascimento?: string;
  genero?: string;
  etnia?: string;
  disponibilidade?: string;
  habilidades?: string;
  cidade?: string;
  estado?: string;
  formacoes?: {
    nome: string;
    instituicao?: string;
    anoConclusao?: number;
    tipo: string; // "Formacao" ou "Ocupacao"
  }[];
  areasAfinidadeIds?: number[];
}

export interface VoluntarioResponse {
  id: number;
  usuarioId: number;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  dataNascimento?: string;
  genero?: string;
  etnia?: string;
  disponibilidade?: string;
  habilidades?: string;
  cidade?: string;
  estado?: string;
  ativo: boolean;
  anonimizado: boolean;
  dataInsercao: string;
  formacoes: {
    id: number;
    nome: string;
    instituicao?: string;
    anoConclusao?: number;
    tipo: string;
  }[];
  areasAfinidade: {
    id: number;
    nome: string;
  }[];
}

export async function cadastrarVoluntario(data: CadastroVoluntarioPayload): Promise<{ message: string; voluntarioId: number }> {
  return apiPost('/Voluntario/cadastro', data);
}

export async function obterVoluntarioPorId(id: number): Promise<VoluntarioResponse> {
  return apiGet(`/Voluntario/${id}`);
}

export async function listarVoluntarios(): Promise<VoluntarioResponse[]> {
  return apiGet('/Voluntario');
}

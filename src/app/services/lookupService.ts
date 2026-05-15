import { apiGet } from './apiClient';

export interface LookupItem {
  id: number;
  nome: string;
}

export async function listarCategorias(): Promise<LookupItem[]> {
  return apiGet('/Lookup/categorias');
}

export async function listarOcupacoes(): Promise<LookupItem[]> {
  return apiGet('/Lookup/ocupacoes');
}

export async function listarHabilidades(): Promise<LookupItem[]> {
  return apiGet('/Lookup/habilidades');
}

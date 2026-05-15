import { apiGet, apiPost } from './apiClient';
import { opportunities as fallbackOpportunities } from '../data/mocks';

export interface OportunidadeCard {
  id: number;
  title: string;
  category: string;
  location: string;
  time: string;
  vagas: string;
  vagasTotal: number;
  vagasPreenchidas: number;
  image: string;
  descricao: string;
  requisitos: string[];
  beneficios: string[];
  organizacao: string;
  contato: string;
}

export interface CriarOportunidadePayload {
  instituicaoId: number;
  categoriaId?: number;
  titulo: string;
  tipo: 0 | 1 | 2;
  descricao?: string;
  imagemUrl?: string;
  objetivo?: string;
  cidade?: string;
  estado?: string;
  dataInicio?: string;
  dataFim?: string;
  vagas: number;
  requisitos?: string;
  turno?: string;
  localDetalhado?: string;
  aceitaSemFormacao?: boolean;
  precisaApoioCriancas?: boolean;
}

interface ApiOportunidade {
  id: number;
  titulo: string;
  tipo?: string;
  descricao?: string;
  imagemUrl?: string;
  objetivo?: string;
  cidade?: string;
  estado?: string;
  vagas: number;
  requisitos?: string;
  turno?: string;
  localDetalhado?: string;
  vagasOcupadas?: number;
  vagasDisponiveis?: number;
  instituicao?: { nome?: string };
  categoria?: { nome?: string };
  inscricoes?: unknown[];
}

const images = [
  'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop',
];

function splitText(value?: string): string[] {
  if (!value) return [];
  return value
    .split(/[;\n]/)
    .map(item => item.replace(/^(Requisitos|Beneficios|Benefícios|Contato):/i, '').trim())
    .filter(Boolean);
}

function mapOportunidade(item: ApiOportunidade, index: number): OportunidadeCard {
  const vagasPreenchidas = item.vagasOcupadas ?? (Array.isArray(item.inscricoes) ? item.inscricoes.length : 0);
  const requisitos = splitText(item.requisitos || item.objetivo);

  return {
    id: item.id,
    title: item.titulo,
    category: item.categoria?.nome || item.tipo || 'Projeto',
    location: [item.cidade, item.estado].filter(Boolean).join(' - ') || item.localDetalhado || 'Local a definir',
    time: item.turno || 'Conforme programação',
    vagas: `${item.vagasDisponiveis ?? Math.max(0, item.vagas - vagasPreenchidas)} vagas`,
    vagasTotal: item.vagas || 1,
    vagasPreenchidas,
    image: item.imagemUrl || images[index % images.length],
    descricao: item.descricao || item.objetivo || 'Oportunidade de voluntariado cadastrada no sistema.',
    requisitos: requisitos.length > 0 ? requisitos.slice(0, 4) : ['Compromisso com a ação', 'Disponibilidade no período informado'],
    beneficios: ['Certificado de participação', 'Experiência em ação social'],
    organizacao: item.instituicao?.nome || 'Instituição cadastrada',
    contato: 'contato@voluntamais.local',
  };
}

export async function listarOportunidades(): Promise<OportunidadeCard[]> {
  const data = await apiGet<ApiOportunidade[]>('/Oportunidades');
  return data.map(mapOportunidade);
}

export async function criarInscricao(oportunidadeId: number, voluntarioId: number) {
  return apiPost('/Inscricoes', { oportunidadeId, voluntarioId });
}

export async function criarOportunidade(payload: CriarOportunidadePayload) {
  return apiPost<ApiOportunidade>('/Oportunidades', payload);
}

export function fallbackCards(): OportunidadeCard[] {
  return fallbackOpportunities;
}

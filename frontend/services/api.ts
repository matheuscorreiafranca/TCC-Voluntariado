import axios from "axios";

function resolveApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }

  return "http://127.0.0.1:5000";
}

export const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    "Content-Type": "application/json"
  }
});

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  tipo: "Admin" | "Instituicao" | "Voluntario";
  cidade?: string;
  estado?: string;
};

export type Instituicao = {
  id: number;
  usuarioId: number;
  nome: string;
  cnpj?: string;
  responsavel?: string;
  descricao?: string;
  status: string;
  usuario?: Usuario;
};

export type Voluntario = {
  id: number;
  usuarioId: number;
  disponibilidade?: string;
  habilidades?: string;
  usuario?: Usuario;
};

export type Categoria = {
  id: number;
  nome: string;
};

export type Oportunidade = {
  id: number;
  instituicaoId: number;
  categoriaId?: number;
  titulo: string;
  tipo: "Campanha" | "Evento" | "Projeto";
  descricao?: string;
  objetivo?: string;
  cidade?: string;
  estado?: string;
  dataInicio: string;
  dataFim?: string;
  vagas: number;
  status: string;
  instituicao?: Instituicao;
  categoria?: Categoria;
};

export type Inscricao = {
  id: number;
  oportunidadeId: number;
  voluntarioId: number;
  status: "Pendente" | "Aprovada" | "Reprovada" | "Concluida" | "Cancelada";
  motivoReprovacao?: string;
  oportunidade?: Oportunidade;
  voluntario?: Voluntario;
};

export async function getDashboardData() {
  const [usuarios, instituicoes, voluntarios, oportunidades, inscricoes] = await Promise.all([
    api.get<Usuario[]>("/usuarios"),
    api.get<Instituicao[]>("/instituicoes"),
    api.get<Voluntario[]>("/voluntarios"),
    api.get<Oportunidade[]>("/oportunidades"),
    api.get<Inscricao[]>("/inscricoes")
  ]);

  return {
    usuarios: usuarios.data,
    instituicoes: instituicoes.data,
    voluntarios: voluntarios.data,
    oportunidades: oportunidades.data,
    inscricoes: inscricoes.data
  };
}

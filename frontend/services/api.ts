import axios from "axios";

function resolveApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window !== "undefined") {
    if (window.location.port === "8011") {
      return `http://${window.location.hostname}:5000`;
    }

    if (window.location.port === "8012") {
      return `http://${window.location.hostname}:5000`;
    }

    if (window.location.port === "8013") {
      return `http://${window.location.hostname}:5000`;
    }

    if (window.location.port === "8014") {
      return `http://${window.location.hostname}:5000`;
    }

    if (window.location.port === "5000") {
      return window.location.origin;
    }

    if (!window.location.port) {
      return `${window.location.origin}/api`;
    }

    return `http://${window.location.hostname}:5000`;
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
  tipo: "Superadmin" | "Admin" | "Instituicao" | "Voluntario";
  telefone?: string;
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
  dataNascimento?: string;
  genero?: string;
  disponibilidade?: string;
  habilidades?: string;
  bio?: string;
  experiencia?: string;
  interesses?: string;
  preferenciasAcessibilidade?: string;
  necessitaAcessibilidade: boolean;
  aceitaContatoWhatsapp: boolean;
  usuario?: Usuario;
  voluntarioHabilidades?: VoluntarioHabilidade[];
};

export type Categoria = {
  id: number;
  nome: string;
};

export type Habilidade = {
  id: number;
  nome: string;
};

export type VoluntarioHabilidade = {
  id: number;
  voluntarioId: number;
  habilidadeId: number;
  nivelInteresse: string;
  habilidade?: Habilidade;
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
  requisitos?: string;
  turno?: string;
  localDetalhado?: string;
  aceitaSemFormacao: boolean;
  precisaApoioCriancas: boolean;
  instituicao?: Instituicao;
  categoria?: Categoria;
  inscricoes?: Inscricao[];
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

export type Notificacao = {
  id: number;
  usuarioId: number;
  titulo: string;
  mensagem: string;
  lida: boolean;
  criadoEm: string;
};

export type Feedback = {
  id: number;
  inscricaoId: number;
  autor: "Instituicao" | "Voluntario";
  nota: number;
  comentario?: string;
  criadoEm: string;
  inscricao?: Inscricao;
};

export type LoginResponse = {
  usuario: Usuario;
  voluntario?: Voluntario;
  instituicao?: Instituicao;
};

export type Recomendacao = {
  oportunidade: Oportunidade;
  score: number;
  motivo: string;
};

export type VoluntarioPortal = {
  voluntario: Voluntario;
  metricas: {
    inscricoes: number;
    pendentes: number;
    aprovadas: number;
    concluidas: number;
    horasEstimadas: number;
  };
  inscricoes: Inscricao[];
  recomendacoes: Recomendacao[];
  notificacoes: Notificacao[];
  feedbacks: Feedback[];
};

export type OportunidadeDetalhe = {
  oportunidade: Oportunidade;
  vagasOcupadas: number;
  vagasDisponiveis: number;
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

export async function login(email: string, senha: string) {
  const response = await api.post<LoginResponse>("/auth/login", { email, senha });
  return response.data;
}

export async function getVoluntarioPortal(voluntarioId: number) {
  const response = await api.get<VoluntarioPortal>(`/voluntarios/${voluntarioId}/portal`);
  return response.data;
}

export async function getOportunidadeDetalhe(id: number) {
  const response = await api.get<OportunidadeDetalhe>(`/oportunidades/${id}`);
  return response.data;
}

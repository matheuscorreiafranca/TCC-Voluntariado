import { Instituicao, Oportunidade } from "./api";

export const IVG_INSTITUICAO_ID = 6;
export const IVG_NOME = "Instituto Vitor Gabriel";

export const IVG_PROJETOS_PRINCIPAIS = [
  "Acolhimento de Mães Atípicas da Baixada Santista",
  "Rede de Apoio para Mães e Responsáveis Atípicos"
];

export const IVG_TECNOLOGIAS = [
  {
    nome: "Next.js + React",
    justificativa: "interface simples, responsiva e rápida para cadastro, eventos e gestão diária"
  },
  {
    nome: "ASP.NET Core API",
    justificativa: "backend direto para regras de voluntários, eventos, inscrições e notificações"
  },
  {
    nome: "MySQL",
    justificativa: "banco relacional adequado para organizar projetos, atividades, voluntários e vínculos"
  },
  {
    nome: "WhatsApp e Discord",
    justificativa: "WhatsApp como canal sugerido de comunicação com famílias e mães atípicas; Discord para notificações internas"
  }
];

export function isIvgInstituicao(item?: Instituicao | null) {
  return Boolean(item && (item.id === IVG_INSTITUICAO_ID || item.nome === IVG_NOME));
}

export function isIvgOportunidade(item: Oportunidade) {
  return item.instituicaoId === IVG_INSTITUICAO_ID || item.instituicao?.nome === IVG_NOME;
}

export function onlyIvgOportunidades(items: Oportunidade[]) {
  return items.filter(isIvgOportunidade);
}

export function findIvgInstituicao(items: Instituicao[]) {
  return items.find((item) => item.id === IVG_INSTITUICAO_ID) ?? items.find((item) => item.nome === IVG_NOME) ?? null;
}

export function sortEventosFirst(items: Oportunidade[]) {
  const order = { Evento: 0, Projeto: 1, Campanha: 2 };
  return [...items].sort((a, b) => order[a.tipo] - order[b.tipo] || a.titulo.localeCompare(b.titulo));
}

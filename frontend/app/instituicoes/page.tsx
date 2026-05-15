"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { StatusBadge } from "@/components/StatusBadge";
import { api, Instituicao } from "@/services/api";
import { findIvgInstituicao, IVG_NOME } from "@/services/ivg";

const perfis = [
  { nome: "Superadmin", descricao: "administração geral do sistema e acompanhamento técnico" },
  { nome: "Admin da instituição", descricao: "gestão dos eventos, projetos, campanhas e vínculos do IVG" },
  { nome: "Voluntário", descricao: "cadastro, inscrição e participação nas ações do instituto" }
];

export default function InstituicoesPage() {
  const [instituicao, setInstituicao] = useState<Instituicao | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get<Instituicao[]>("/instituicoes")
      .then((response) => setInstituicao(findIvgInstituicao(response.data)))
      .catch(() => setMessage("API indisponível. Rode o backend antes de usar a tela."));
  }, []);

  return (
    <AuthGate role="admin">
    <AppShell>
      <div className="page grid">
        <header className="page-header">
          <div>
            <p className="eyebrow">{IVG_NOME}</p>
            <h1>Instituição única do sistema</h1>
            <p className="muted">O MVP não prevê cadastro de outras ONGs nem exclusividade de voluntários.</p>
          </div>
        </header>

        {message && <div className="toast">{message}</div>}

        <section className="grid grid-2">
          <div className="card card-pad grid">
            <h2>Cadastro do instituto</h2>
            {instituicao ? (
              <>
                <article className="mini-item">
                  <strong>{instituicao.nome}</strong>
                  <p className="muted">{instituicao.descricao || "Sem descrição cadastrada."}</p>
                  <StatusBadge status={instituicao.status} />
                </article>
                <article className="mini-item">
                  <strong>Responsável</strong>
                  <p className="muted">{instituicao.responsavel || "-"}</p>
                </article>
              </>
            ) : (
              <p className="muted">Instituição IVG não encontrada no cadastro local.</p>
            )}
          </div>

          <div className="card card-pad grid">
            <h2>Tipos de usuário</h2>
            {perfis.map((perfil) => (
              <article className="mini-item" key={perfil.nome}>
                <strong>{perfil.nome}</strong>
                <p className="muted">{perfil.descricao}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
    </AuthGate>
  );
}

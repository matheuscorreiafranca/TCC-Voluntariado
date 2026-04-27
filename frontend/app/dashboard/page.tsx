"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { LoadingBlock } from "@/components/LoadingBlock";
import { getDashboardData } from "@/services/api";

type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardData()
      .then(setData)
      .catch(() => setError("Não foi possível carregar o resumo. Verifique se a API está rodando."))
      .finally(() => setLoading(false));
  }, []);

  const pendentes = data?.inscricoes.filter((item) => item.status === "Pendente").length ?? 0;
  const aprovadas = data?.inscricoes.filter((item) => item.status === "Aprovada").length ?? 0;

  return (
    <AppShell>
      <div className="page grid">
        <section className="card hero">
          <div>
            <p className="eyebrow">VoluntaMais MVP</p>
            <h1>Gestão simples para conectar voluntários e instituições.</h1>
            <p className="muted">
              Cadastre oportunidades, acompanhe inscrições, aprove voluntários e centralize
              feedbacks em uma experiência limpa de produto SaaS.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
              <Link href="/oportunidades" className="button">Ver oportunidades</Link>
              <Link href="/oportunidades/criar" className="button secondary">Criar oportunidade</Link>
            </div>
          </div>
          <Image className="hero-logo" src="/logos/voluntamais-full.svg" alt="VoluntaMais" width={360} height={220} />
        </section>

        {loading && <LoadingBlock />}
        {error && <div className="toast">{error}</div>}

        {data && (
          <>
            <section className="grid grid-4">
              <article className="card card-pad kpi">
                <span className="muted">Instituições</span>
                <strong>{data.instituicoes.length}</strong>
                <span className="muted">Organizações cadastradas</span>
              </article>
              <article className="card card-pad kpi">
                <span className="muted">Voluntários</span>
                <strong>{data.voluntarios.length}</strong>
                <span className="muted">Pessoas disponíveis</span>
              </article>
              <article className="card card-pad kpi">
                <span className="muted">Oportunidades</span>
                <strong>{data.oportunidades.length}</strong>
                <span className="muted">Campanhas, eventos e projetos</span>
              </article>
              <article className="card card-pad kpi">
                <span className="muted">Inscrições pendentes</span>
                <strong>{pendentes}</strong>
                <span className="muted">{aprovadas} já aprovadas</span>
              </article>
            </section>

            <section className="grid grid-2">
              <div className="card card-pad">
                <h2>Próximas oportunidades</h2>
                <div className="grid">
                  {data.oportunidades.slice(0, 4).map((item) => (
                    <div key={item.id} className="opportunity-meta" style={{ justifyContent: "space-between" }}>
                      <strong>{item.titulo}</strong>
                      <span className="status">{item.tipo}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card card-pad">
                <h2>Fila de decisão</h2>
                <p className="muted">
                  Use a tela de inscrições para aprovar ou reprovar voluntários. O sistema
                  registra notificações automaticamente para instituição e voluntário.
                </p>
                <Link href="/inscricoes" className="button secondary">Gerenciar inscrições</Link>
              </div>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}

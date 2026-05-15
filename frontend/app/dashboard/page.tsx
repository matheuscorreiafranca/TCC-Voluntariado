"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { LoadingBlock } from "@/components/LoadingBlock";
import { getDashboardData } from "@/services/api";
import { IVG_NOME, onlyIvgOportunidades, sortEventosFirst } from "@/services/ivg";

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
  const oportunidades = sortEventosFirst(onlyIvgOportunidades(data?.oportunidades ?? []));
  const eventos = oportunidades.filter((item) => item.tipo === "Evento");

  return (
    <AuthGate role="admin">
      <AppShell>
        <div className="portal-container">
          <header className="portal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Painel de Controle IVG</h1>
              <p>Gestão centralizada de voluntários e ações institucionais.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href="/oportunidades/criar" className="button">Nova Ação</Link>
              <Link href="/inscricoes" className="button secondary">Gerenciar Vínculos</Link>
            </div>
          </header>

          {loading && <LoadingBlock />}
          {error && <div className="card" style={{ color: 'var(--danger)', padding: '20px' }}>{error}</div>}

          {data && (
            <>
              <div className="metric-grid">
                <div className="metric-card">
                  <span className="metric-value">{data.voluntarios.length}</span>
                  <span className="metric-label">Voluntários Totais</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">{eventos.length}</span>
                  <span className="metric-label">Eventos Ativos</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">{pendentes}</span>
                  <span className="metric-label">Vínculos Pendentes</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">{aprovadas}</span>
                  <span className="metric-label">Vínculos Aprovados</span>
                </div>
              </div>

              <div className="portal-content-grid">
                <div className="grid-main">
                  <div className="card">
                    <div className="section-title">
                      <h2>Próximas Ações IVG</h2>
                      <Link href="/oportunidades" className="button outline" style={{ height: '36px', fontSize: '14px' }}>Ver todas</Link>
                    </div>
                    <div className="compact-list">
                      {oportunidades.slice(0, 6).map((item) => (
                        <div className="compact-item" key={item.id}>
                          <div style={{ display: 'grid', gap: '2px' }}>
                            <strong style={{ fontSize: '15px' }}>{item.titulo}</strong>
                            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{item.cidade}/{item.estado} • {item.tipo}</span>
                          </div>
                          <span className={`badge ${item.tipo === 'Evento' ? 'badge-approved' : 'badge-pending'}`} style={{ fontSize: '10px' }}>
                            {item.tipo}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid-aside">
                  <div className="card">
                    <div className="section-title">
                      <h2>Dica de Gestão</h2>
                    </div>
                    <div style={{ padding: '4px' }}>
                      <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--muted)' }}>
                        Priorize a análise de vínculos para <strong>Eventos</strong>. 
                        Voluntários que se inscrevem em eventos costumam ter maior urgência de confirmação para organização de logística e recepção.
                      </p>
                      <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid var(--line)' }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'var(--panel-soft)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Image src="/logos/voluntamais-icon.svg" alt="IVG" width={24} height={24} />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>Instituto Vitor Gabriel</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </AppShell>
    </AuthGate>
  );
}
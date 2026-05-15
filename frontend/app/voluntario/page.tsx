"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VolunteerShell } from "@/components/VolunteerShell";
import { EmptyState, OpportunityCard, NotificationItem } from "@/components/Ui";
import { StatusBadge } from "@/components/StatusBadge";
import { getVoluntarioPortal, VoluntarioPortal } from "@/services/api";
import { getCurrentVoluntario } from "@/services/session";

export default function VoluntarioDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<VoluntarioPortal | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const voluntario = getCurrentVoluntario();
    if (!voluntario) {
      router.push("/login");
      return;
    }

    getVoluntarioPortal(voluntario.id)
      .then(setData)
      .catch(() => setMessage("Não foi possível carregar seu portal. Verifique se a API está rodando."));
  }, [router]);

  return (
    <VolunteerShell>
      <div className="portal-container">
        {message && <div className="toast toast-danger">{message}</div>}
        
        {!data ? (
          <div className="card" style={{ textAlign: 'center', padding: '80px' }}>
            <p className="muted">Carregando seu portal personalizado...</p>
          </div>
        ) : (
          <>
            <header className="portal-header">
              <h1>Olá, {data.voluntario.usuario?.nome?.split(" ")[0] || "voluntário"} 👋</h1>
              <p>Bem-vindo ao seu portal no Instituto Vitor Gabriel.</p>
            </header>

            <div className="metric-grid">
              <div className="metric-card">
                <span className="metric-value">{data.metricas.inscricoes}</span>
                <span className="metric-label">Inscrições Totais</span>
              </div>
              <div className="metric-card">
                <span className="metric-value">{data.metricas.pendentes}</span>
                <span className="metric-label">Aguardando Aprovação</span>
              </div>
              <div className="metric-card">
                <span className="metric-value">{data.metricas.aprovadas}</span>
                <span className="metric-label">Ações Aprovadas</span>
              </div>
              <div className="metric-card">
                <span className="metric-value">{data.metricas.horasEstimadas}h</span>
                <span className="metric-label">Horas Contribuídas</span>
              </div>
            </div>

            <div className="portal-content-grid">
              <div className="grid-main">
                <div className="card" style={{ marginBottom: '32px' }}>
                  <div className="section-title">
                    <h2>Oportunidades Recomendadas</h2>
                    <Link href="/oportunidades" className="button outline" style={{ height: '36px', fontSize: '14px' }}>Ver todas</Link>
                  </div>
                  <div style={{ display: 'grid', gap: '20px' }}>
                    {data.recomendacoes.length ? data.recomendacoes.slice(0, 3).map((item) => (
                      <OpportunityCard 
                        key={item.oportunidade.id} 
                        item={item.oportunidade} 
                        href={`/oportunidades/${item.oportunidade.id}`} 
                      />
                    )) : (
                      <EmptyState title="Nenhuma recomendação" text="Complete seu perfil para receber sugestões de missões compatíveis." />
                    )}
                  </div>
                </div>
              </div>

              <div className="grid-aside" style={{ display: 'grid', gap: '32px', alignContent: 'start' }}>
                <div className="card">
                  <div className="section-title">
                    <h2>Minhas Inscrições</h2>
                  </div>
                  <div className="compact-list">
                    {data.inscricoes.length ? data.inscricoes.slice(0, 5).map((item) => (
                      <div className="compact-item" key={item.id}>
                        <div style={{ display: 'grid', gap: '2px' }}>
                          <strong style={{ fontSize: '14px' }}>{item.oportunidade?.titulo}</strong>
                          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{item.oportunidade?.tipo}</span>
                        </div>
                        <StatusBadge status={item.status} />
                      </div>
                    )) : (
                      <p className="muted" style={{ fontSize: '14px', textAlign: 'center' }}>Nenhuma inscrição ativa.</p>
                    )}
                  </div>
                </div>

                <div className="card">
                  <div className="section-title">
                    <h2>Notificações</h2>
                  </div>
                  <div className="compact-list">
                    {data.notificacoes.length ? data.notificacoes.slice(0, 4).map((item) => (
                      <NotificationItem 
                        key={item.id} 
                        title={item.titulo} 
                        text={item.mensagem} 
                        unread={!item.lida} 
                      />
                    )) : (
                      <p className="muted" style={{ fontSize: '14px', textAlign: 'center' }}>Nenhuma notificação nova.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </VolunteerShell>
  );
}
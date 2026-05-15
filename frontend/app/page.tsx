"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LoadingBlock } from "@/components/LoadingBlock";
import { OpportunityCard } from "@/components/Ui";
import { getDashboardData } from "@/services/api";
import {
  IVG_NOME,
  IVG_PROJETOS_PRINCIPAIS,
  onlyIvgOportunidades,
  sortEventosFirst
} from "@/services/ivg";

type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardData().then(setData).finally(() => setLoading(false));
  }, []);

  const oportunidades = useMemo(
    () => sortEventosFirst(onlyIvgOportunidades(data?.oportunidades ?? [])),
    [data]
  );
  const eventos = oportunidades.filter((item) => item.tipo === "Evento");
  const projetosPrincipais = oportunidades.filter((item) => IVG_PROJETOS_PRINCIPAIS.includes(item.titulo));

  return (
    <main className="landing">
      <header className="landing-nav">
        <Link className="landing-brand" href="/">
          <Image src="/logos/voluntamais-icon.svg" alt={IVG_NOME} width={32} height={32} priority />
          <span>Instituto Vitor Gabriel</span>
        </Link>
        <nav>
          <Link href="/oportunidades">Oportunidades</Link>
          <Link href="/login">Entrar</Link>
          <Link className="button" href="/cadastro-voluntario">Quero ser voluntário</Link>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-container">
          <span className="hero-badge">Portal de Voluntariado IVG</span>
          <h1>Conecte seu tempo ao que realmente importa.</h1>
          <p>
            Uma plataforma moderna para voluntários do Instituto Vitor Gabriel apoiarem ações de inclusão 
            e cuidado para pessoas com deficiência e suas famílias.
          </p>
          <div className="hero-actions">
            <Link href="/cadastro-voluntario" className="button">Começar agora</Link>
            <Link href="/login" className="button secondary">Acessar meu portal</Link>
          </div>
        </div>

        <div className="hero-preview">
          <div className="preview-card">
            <div style={{ padding: '60px', display: 'flex', justifyContent: 'center', background: 'white' }}>
              <Image src="/logos/voluntamais-full.svg" alt={IVG_NOME} width={400} height={200} priority />
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{eventos.length || "0"}</span>
                <span className="stat-label">Eventos</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{oportunidades.length || "0"}</span>
                <span className="stat-label">Ações Ativas</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{data?.voluntarios.length ?? "0"}</span>
                <span className="stat-label">Voluntários</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="hero-badge">Foco de Atuação</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Nossos Principais Projetos</h2>
        </div>
        
        {loading ? <LoadingBlock /> : (
          <div className="section-grid">
            {projetosPrincipais.map((item) => (
              <OpportunityCard key={item.id} item={item} href={`/oportunidades/${item.id}`} />
            ))}
          </div>
        )}
      </section>

      <section className="section-container" style={{ background: 'var(--panel-soft)', borderRadius: '40px', marginBottom: '100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="hero-badge">Como Funciona</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Sua jornada como voluntário</h2>
        </div>
        
        <div className="section-grid">
          <div className="journey-step">
            <div className="step-number">1</div>
            <div>
              <h3>Cadastro Simples</h3>
              <p>Crie seu perfil em poucos minutos informando suas habilidades e disponibilidades.</p>
            </div>
          </div>
          <div className="journey-step">
            <div className="step-number">2</div>
            <div>
              <h3>Portal Personalizado</h3>
              <p>Tenha acesso a um dashboard exclusivo com recomendações baseadas no seu perfil.</p>
            </div>
          </div>
          <div className="journey-step">
            <div className="step-number">3</div>
            <div>
              <h3>Inscrição Direta</h3>
              <p>Candidate-se a eventos e projetos com apenas um clique e acompanhe o status.</p>
            </div>
          </div>
          <div className="journey-step">
            <div className="step-number">4</div>
            <div>
              <h3>Feedback e Impacto</h3>
              <p>Receba feedbacks após as ações e visualize o impacto real da sua contribuição.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { LoadingBlock } from "@/components/LoadingBlock";
import { EmptyState, OpportunityCard, SectionHeader, Toast } from "@/components/Ui";
import { api, Oportunidade, Recomendacao } from "@/services/api";
import { IVG_NOME, onlyIvgOportunidades, sortEventosFirst } from "@/services/ivg";
import { getCurrentVoluntario } from "@/services/session";

export default function OportunidadesPage() {
  const [items, setItems] = useState<Oportunidade[]>([]);
  const [recomendacoes, setRecomendacoes] = useState<Recomendacao[]>([]);
  const [tipo, setTipo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const voluntario = getCurrentVoluntario();
    Promise.all([
      api.get<Oportunidade[]>("/oportunidades", { params: tipo ? { tipo } : {} }),
      voluntario ? api.get<Recomendacao[]>(`/voluntarios/${voluntario.id}/recomendacoes`) : Promise.resolve({ data: [] as Recomendacao[] })
    ]).then(([oportunidades, recomendadas]) => {
      setItems(sortEventosFirst(onlyIvgOportunidades(oportunidades.data)));
      setRecomendacoes(recomendadas.data);
    }).catch(() => {
      setMessage("API indisponível. Rode o backend antes de usar a tela.");
    }).finally(() => setLoading(false));
  }, [tipo]);

  const categorias = useMemo(
    () => Array.from(new Set(items.map((item) => item.categoria?.nome).filter(Boolean))) as string[],
    [items]
  );

  const filtered = useMemo(() => {
    const term = busca.trim().toLowerCase();
    return items.filter((item) => {
      const matchesBusca = !term || `${item.titulo} ${item.descricao} ${item.objetivo} ${item.requisitos}`.toLowerCase().includes(term);
      const matchesCategoria = !categoria || item.categoria?.nome === categoria;
      return matchesBusca && matchesCategoria;
    });
  }, [items, busca, categoria]);

  return (
    <AppShell>
      <div className="page grid">
        <header className="page-header">
          <div>
            <p className="eyebrow">{IVG_NOME}</p>
            <h1>Oportunidades para voluntários</h1>
            <p className="muted">Encontre eventos, projetos e campanhas compatíveis com seu perfil e disponibilidade.</p>
          </div>
          <Link className="button" href="/voluntario">Meu portal</Link>
        </header>

        {message && <Toast tone="danger">{message}</Toast>}

        <section className="filter-panel">
          <label className="field">
            <span>Busca</span>
            <input className="input" value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar por título, cuidado, mães atípicas..." />
          </label>
          <label className="field">
            <span>Tipo</span>
            <select className="input" value={tipo} onChange={(event) => setTipo(event.target.value)}>
              <option value="">Todos</option>
              <option value="Evento">Eventos</option>
              <option value="Projeto">Projetos</option>
              <option value="Campanha">Campanhas</option>
            </select>
          </label>
          <label className="field">
            <span>Categoria</span>
            <select className="input" value={categoria} onChange={(event) => setCategoria(event.target.value)}>
              <option value="">Todas</option>
              {categorias.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </section>

        {Boolean(recomendacoes.length) && (
          <section className="card card-pad grid">
            <SectionHeader eyebrow="Recomendadas para você" title="Sugestões por compatibilidade" />
            <div className="grid grid-3">
              {recomendacoes.slice(0, 3).map((item) => (
                <OpportunityCard key={item.oportunidade.id} item={item.oportunidade} href={`/oportunidades/${item.oportunidade.id}`} actionLabel={item.motivo} />
              ))}
            </div>
          </section>
        )}

        {loading ? (
          <LoadingBlock />
        ) : filtered.length ? (
          <section className="grid grid-3">
            {filtered.map((item) => (
              <OpportunityCard key={item.id} item={item} href={`/oportunidades/${item.id}`} />
            ))}
          </section>
        ) : (
          <EmptyState title="Nenhuma oportunidade encontrada" text="Ajuste os filtros ou volte para todos os tipos de ação." />
        )}
      </div>
    </AppShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { LoadingBlock } from "@/components/LoadingBlock";
import { StatusBadge } from "@/components/StatusBadge";
import { api, Oportunidade } from "@/services/api";

export default function OportunidadesPage() {
  const [items, setItems] = useState<Oportunidade[]>([]);
  const [tipo, setTipo] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    const response = await api.get<Oportunidade[]>("/oportunidades", { params: tipo ? { tipo } : {} });
    setItems(response.data);
    setLoading(false);
  }

  async function inscrever(oportunidadeId: number) {
    setMessage("");
    try {
      await api.post("/inscricoes", { oportunidadeId, voluntarioId: 1 });
      setMessage("Inscrição enviada. A instituição já pode avaliar a solicitação.");
    } catch (error: unknown) {
      const fallback = "Não foi possível criar a inscrição. Verifique se ela já existe.";
      const response = error as { response?: { data?: { message?: string } } };
      setMessage(response.response?.data?.message || fallback);
    }
  }

  useEffect(() => {
    load().catch(() => {
      setMessage("API indisponível. Rode o backend antes de usar a tela.");
      setLoading(false);
    });
  }, [tipo]);

  return (
    <AppShell>
      <div className="page">
        <header className="page-header">
          <div>
            <p className="eyebrow">Oportunidades</p>
            <h1>Campanhas, eventos e projetos</h1>
            <p className="muted">Filtre, avalie e inscreva voluntários em poucos cliques.</p>
          </div>
          <Link className="button" href="/oportunidades/criar">Criar oportunidade</Link>
        </header>

        <div className="toolbar">
          <label className="field" style={{ minWidth: 220 }}>
            <span>Tipo</span>
            <select className="input" value={tipo} onChange={(event) => setTipo(event.target.value)}>
              <option value="">Todos</option>
              <option value="Campanha">Campanha</option>
              <option value="Evento">Evento</option>
              <option value="Projeto">Projeto</option>
            </select>
          </label>
        </div>

        {message && <div className="toast" style={{ marginBottom: 16 }}>{message}</div>}
        {loading ? (
          <LoadingBlock />
        ) : (
          <section className="grid grid-3">
            {items.map((item) => (
              <article className="card opportunity-card" key={item.id}>
                <div className="opportunity-meta">
                  <span className="status">{item.tipo}</span>
                  <StatusBadge status={item.status} />
                </div>
                <div>
                  <h2>{item.titulo}</h2>
                  <p className="muted">{item.descricao || "Sem descrição."}</p>
                </div>
                <div className="opportunity-meta">
                  <span>{item.cidade}/{item.estado}</span>
                  <span>{item.vagas} vagas</span>
                  <span>{item.categoria?.nome || "Sem categoria"}</span>
                </div>
                <button className="button" onClick={() => inscrever(item.id)}>Inscrever-se</button>
              </article>
            ))}
          </section>
        )}
      </div>
    </AppShell>
  );
}

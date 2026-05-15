"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { EmptyState, MetricCard, SectionHeader, Toast } from "@/components/Ui";
import { StatusBadge } from "@/components/StatusBadge";
import { api, getOportunidadeDetalhe, OportunidadeDetalhe } from "@/services/api";
import { getCurrentVoluntario } from "@/services/session";

export default function OportunidadeDetalhePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<OportunidadeDetalhe | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getOportunidadeDetalhe(Number(params.id))
      .then(setData)
      .catch(() => setMessage("Não foi possível carregar a oportunidade."));
  }, [params.id]);

  async function inscrever() {
    const voluntario = getCurrentVoluntario();
    if (!voluntario) {
      router.push("/login");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      await api.post("/inscricoes", { oportunidadeId: Number(params.id), voluntarioId: voluntario.id });
      setMessage("Inscrição enviada para avaliação do Instituto Vitor Gabriel.");
    } catch (error: unknown) {
      const response = error as { response?: { data?: { message?: string } } };
      setMessage(response.response?.data?.message || "Não foi possível enviar a inscrição.");
    } finally {
      setSaving(false);
    }
  }

  const item = data?.oportunidade;

  return (
    <AppShell>
      <div className="page grid">
        {message && <Toast tone={message.includes("enviada") ? "success" : "danger"}>{message}</Toast>}
        {!item ? (
          <EmptyState title="Carregando oportunidade" text="Buscando dados da ação do IVG." />
        ) : (
          <>
            <section className="detail-hero">
              <div>
                <p className="eyebrow">{item.tipo}</p>
                <h1>{item.titulo}</h1>
                <p className="muted">{item.descricao || item.objetivo}</p>
                <div className="actions">
                  <button className="button" onClick={inscrever} disabled={saving || data.vagasDisponiveis <= 0}>
                    {saving ? "Enviando..." : "Inscrever-me"}
                  </button>
                  <Link className="button secondary" href="/oportunidades">Voltar</Link>
                </div>
              </div>
              <aside className="card card-pad grid">
                <StatusBadge status={item.status} />
                <MetricCard label="Vagas livres" value={data.vagasDisponiveis} detail={`${data.vagasOcupadas} em avaliação/aprovadas`} />
                <MetricCard label="Turno" value={item.turno || "Conforme agenda"} />
              </aside>
            </section>

            <section className="grid grid-2">
              <div className="card card-pad grid">
                <SectionHeader eyebrow="Detalhes" title="Como será a participação" />
                <p className="muted">{item.objetivo}</p>
                <p>{item.requisitos || "Postura acolhedora, disponibilidade e compromisso com a ação."}</p>
              </div>
              <div className="card card-pad grid">
                <SectionHeader eyebrow="Local e perfil" title="Informações importantes" />
                <div className="detail-list">
                  <span>{item.localDetalhado || `${item.cidade}/${item.estado}`}</span>
                  <span>{item.aceitaSemFormacao ? "Aceita voluntários sem formação específica" : "Requer experiência/formação"}</span>
                  <span>{item.precisaApoioCriancas ? "Pode precisar de apoio no cuidado de crianças" : "Apoio geral à organização"}</span>
                  <span>{item.categoria?.nome || "Sem categoria"}</span>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}

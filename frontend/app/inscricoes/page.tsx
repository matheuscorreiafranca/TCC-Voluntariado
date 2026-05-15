"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { LoadingBlock } from "@/components/LoadingBlock";
import { StatusBadge } from "@/components/StatusBadge";
import { api, Inscricao } from "@/services/api";
import { IVG_NOME, isIvgOportunidade } from "@/services/ivg";

export default function InscricoesPage() {
  const [items, setItems] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    const response = await api.get<Inscricao[]>("/inscricoes");
    setItems(response.data.filter((item) => item.oportunidade && isIvgOportunidade(item.oportunidade)));
    setLoading(false);
  }

  async function patch(id: number, action: "aprovar" | "reprovar") {
    setMessage("");
    await api.patch(`/inscricoes/${id}/${action}`, action === "reprovar" ? { motivoReprovacao: "Não aderente ao perfil da vaga." } : {});
    setMessage(action === "aprovar" ? "Inscrição aprovada." : "Inscrição reprovada.");
    await load();
  }

  useEffect(() => {
    load().catch(() => {
      setMessage("API indisponível. Rode o backend antes de usar a tela.");
      setLoading(false);
    });
  }, []);

  return (
    <AuthGate role="admin">
    <AppShell>
      <div className="page">
        <header className="page-header">
          <div>
            <p className="eyebrow">{IVG_NOME}</p>
            <h1>Vínculo de voluntários aos eventos</h1>
            <p className="muted">Aprove voluntários para ações do instituto e acompanhe quem está alocado.</p>
          </div>
        </header>

        {message && <div className="toast" style={{ marginBottom: 16 }}>{message}</div>}
        {loading ? <LoadingBlock /> : (
          <div className="card table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Voluntário</th>
                  <th>Ação IVG</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.voluntario?.usuario?.nome || `Voluntário #${item.voluntarioId}`}</td>
                    <td>{item.oportunidade?.titulo || `Oportunidade #${item.oportunidadeId}`}</td>
                    <td><StatusBadge status={item.status} /></td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="button" disabled={item.status !== "Pendente"} onClick={() => patch(item.id, "aprovar")}>Aprovar</button>
                        <button className="button danger" disabled={item.status !== "Pendente"} onClick={() => patch(item.id, "reprovar")}>Reprovar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
    </AuthGate>
  );
}

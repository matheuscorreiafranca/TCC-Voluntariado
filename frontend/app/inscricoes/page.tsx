"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { LoadingBlock } from "@/components/LoadingBlock";
import { StatusBadge } from "@/components/StatusBadge";
import { api, Inscricao } from "@/services/api";

export default function InscricoesPage() {
  const [items, setItems] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    const response = await api.get<Inscricao[]>("/inscricoes");
    setItems(response.data);
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
    <AppShell>
      <div className="page">
        <header className="page-header">
          <div>
            <p className="eyebrow">Inscrições</p>
            <h1>Aprovação de voluntários</h1>
            <p className="muted">Acompanhe solicitações e tome decisões rapidamente.</p>
          </div>
        </header>

        {message && <div className="toast" style={{ marginBottom: 16 }}>{message}</div>}
        {loading ? <LoadingBlock /> : (
          <div className="card table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Voluntário</th>
                  <th>Oportunidade</th>
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
  );
}

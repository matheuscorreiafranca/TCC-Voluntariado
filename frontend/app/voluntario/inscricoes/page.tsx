"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { VolunteerShell } from "@/components/VolunteerShell";
import { EmptyState, SectionHeader } from "@/components/Ui";
import { StatusBadge } from "@/components/StatusBadge";
import { getVoluntarioPortal, Inscricao } from "@/services/api";
import { getCurrentVoluntario } from "@/services/session";

export default function VoluntarioInscricoesPage() {
  const router = useRouter();
  const [items, setItems] = useState<Inscricao[]>([]);

  useEffect(() => {
    const voluntario = getCurrentVoluntario();
    if (!voluntario) {
      router.push("/login");
      return;
    }
    getVoluntarioPortal(voluntario.id).then((data) => setItems(data.inscricoes));
  }, [router]);

  return (
    <VolunteerShell>
      <div className="portal-page">
        <SectionHeader eyebrow="Portal do voluntário" title="Minhas inscrições">
          <Link className="button" href="/oportunidades">Buscar oportunidades</Link>
        </SectionHeader>
        <div className="card table-wrap">
          {items.length ? (
            <table>
              <thead><tr><th>Ação</th><th>Tipo</th><th>Local</th><th>Status</th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.oportunidade?.titulo}</td>
                    <td>{item.oportunidade?.tipo}</td>
                    <td>{item.oportunidade?.cidade}/{item.oportunidade?.estado}</td>
                    <td><StatusBadge status={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState title="Você ainda não se inscreveu" text="Explore as oportunidades do IVG e envie sua primeira inscrição." />
          )}
        </div>
      </div>
    </VolunteerShell>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VolunteerShell } from "@/components/VolunteerShell";
import { Field, SectionHeader, Toast } from "@/components/Ui";
import { api, Habilidade, VoluntarioHabilidade, getVoluntarioPortal } from "@/services/api";
import { getCurrentVoluntario } from "@/services/session";

export default function VoluntarioHabilidadesPage() {
  const router = useRouter();
  const [voluntarioId, setVoluntarioId] = useState(0);
  const [todas, setTodas] = useState<Habilidade[]>([]);
  const [selecionadas, setSelecionadas] = useState<number[]>([]);
  const [interesses, setInteresses] = useState("");
  const [habilidadesTexto, setHabilidadesTexto] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const voluntario = getCurrentVoluntario();
    if (!voluntario) {
      router.push("/login");
      return;
    }
    setVoluntarioId(voluntario.id);
    Promise.all([
      api.get<{ todas: Habilidade[]; selecionadas: VoluntarioHabilidade[] }>(`/voluntarios/${voluntario.id}/habilidades`),
      getVoluntarioPortal(voluntario.id)
    ]).then(([habilidades, portal]) => {
      setTodas(habilidades.data.todas);
      setSelecionadas(habilidades.data.selecionadas.map((item) => item.habilidadeId));
      setInteresses(portal.voluntario.interesses || "");
      setHabilidadesTexto(portal.voluntario.habilidades || "");
    });
  }, [router]);

  function toggle(id: number) {
    setSelecionadas((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    try {
      await api.put(`/voluntarios/${voluntarioId}/habilidades`, {
        habilidadeIds: selecionadas,
        interesses,
        habilidadesTexto
      });
      setMessage("Habilidades atualizadas. Suas recomendações já usam essas informações.");
    } catch {
      setMessage("Não foi possível atualizar suas habilidades.");
    }
  }

  return (
    <VolunteerShell>
      <div className="portal-page">
        <SectionHeader eyebrow="Compatibilidade" title="Habilidades e interesses" />
        {message && <Toast tone={message.includes("atualizadas") ? "success" : "danger"}>{message}</Toast>}
        <form className="card card-pad volunteer-form" onSubmit={submit}>
          <div className="skill-grid">
            {todas.map((item) => (
              <label className={`skill-chip ${selecionadas.includes(item.id) ? "selected" : ""}`} key={item.id}>
                <input type="checkbox" checked={selecionadas.includes(item.id)} onChange={() => toggle(item.id)} />
                <span>{item.nome}</span>
              </label>
            ))}
          </div>
          <Field label="Interesses">
            <textarea className="input" value={interesses} onChange={(event) => setInteresses(event.target.value)} />
          </Field>
          <Field label="Habilidades em texto livre">
            <textarea className="input" value={habilidadesTexto} onChange={(event) => setHabilidadesTexto(event.target.value)} />
          </Field>
          <button className="button submit-main">Salvar habilidades</button>
        </form>
      </div>
    </VolunteerShell>
  );
}

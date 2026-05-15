"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VolunteerShell } from "@/components/VolunteerShell";
import { Field, SectionHeader, Toast } from "@/components/Ui";
import { api, getVoluntarioPortal, VoluntarioPortal } from "@/services/api";
import { getCurrentVoluntario } from "@/services/session";

export default function VoluntarioPerfilPage() {
  const router = useRouter();
  const [data, setData] = useState<VoluntarioPortal | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const voluntario = getCurrentVoluntario();
    if (!voluntario) {
      router.push("/login");
      return;
    }
    getVoluntarioPortal(voluntario.id).then(setData);
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!data) return;
    setSaving(true);
    setMessage("");
    const form = new FormData(event.currentTarget);

    try {
      await api.patch(`/voluntarios/${data.voluntario.id}/perfil`, {
        nome: String(form.get("nome")),
        telefone: String(form.get("telefone")),
        cidade: String(form.get("cidade")),
        estado: String(form.get("estado")),
        genero: String(form.get("genero")),
        disponibilidade: String(form.get("disponibilidade")),
        bio: String(form.get("bio")),
        experiencia: String(form.get("experiencia")),
        interesses: String(form.get("interesses")),
        preferenciasAcessibilidade: String(form.get("preferenciasAcessibilidade")),
        necessitaAcessibilidade: Boolean(form.get("necessitaAcessibilidade")),
        aceitaContatoWhatsapp: Boolean(form.get("aceitaContatoWhatsapp"))
      });
      setMessage("Perfil atualizado com sucesso.");
    } catch {
      setMessage("Não foi possível salvar o perfil.");
    } finally {
      setSaving(false);
    }
  }

  const voluntario = data?.voluntario;

  return (
    <VolunteerShell>
      <div className="portal-page">
        <SectionHeader eyebrow="Perfil" title="Meus dados e preferências" />
        {message && <Toast tone={message.includes("sucesso") ? "success" : "danger"}>{message}</Toast>}
        {!voluntario ? (
          <div className="loading-card">Carregando perfil...</div>
        ) : (
          <form className="card card-pad volunteer-form" onSubmit={submit}>
            <div className="grid grid-2">
              <Field label="Nome"><input className="input" name="nome" defaultValue={voluntario.usuario?.nome} required /></Field>
              <Field label="Telefone"><input className="input" name="telefone" defaultValue={voluntario.usuario?.telefone} /></Field>
            </div>
            <div className="grid grid-3">
              <Field label="Cidade"><input className="input" name="cidade" defaultValue={voluntario.usuario?.cidade} /></Field>
              <Field label="UF"><input className="input" name="estado" defaultValue={voluntario.usuario?.estado} maxLength={2} /></Field>
              <Field label="Gênero"><input className="input" name="genero" defaultValue={voluntario.genero} /></Field>
            </div>
            <Field label="Bio"><textarea className="input" name="bio" defaultValue={voluntario.bio} /></Field>
            <Field label="Disponibilidade"><input className="input" name="disponibilidade" defaultValue={voluntario.disponibilidade} /></Field>
            <Field label="Experiência"><textarea className="input" name="experiencia" defaultValue={voluntario.experiencia} /></Field>
            <Field label="Interesses"><textarea className="input" name="interesses" defaultValue={voluntario.interesses} /></Field>
            <Field label="Preferências de acessibilidade"><textarea className="input" name="preferenciasAcessibilidade" defaultValue={voluntario.preferenciasAcessibilidade} /></Field>
            <div className="volunteer-options">
              <label className="option-card">
                <input name="necessitaAcessibilidade" type="checkbox" defaultChecked={voluntario.necessitaAcessibilidade} />
                <span><strong>Preciso de acessibilidade</strong><small>A instituição deve observar minhas preferências.</small></span>
              </label>
              <label className="option-card">
                <input name="aceitaContatoWhatsapp" type="checkbox" defaultChecked={voluntario.aceitaContatoWhatsapp} />
                <span><strong>Aceito contato por WhatsApp</strong><small>Canal sugerido para comunicação com voluntários.</small></span>
              </label>
            </div>
            <button className="button submit-main" disabled={saving}>{saving ? "Salvando..." : "Salvar perfil"}</button>
          </form>
        )}
      </div>
    </VolunteerShell>
  );
}

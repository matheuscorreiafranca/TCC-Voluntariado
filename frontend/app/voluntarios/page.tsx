"use client";

import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { AppShell } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { api, Usuario, Voluntario } from "@/services/api";
import { IVG_NOME } from "@/services/ivg";

export default function VoluntariosPage() {
  const [items, setItems] = useState<Voluntario[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const [voluntarios, usuariosResponse] = await Promise.all([
      api.get<Voluntario[]>("/voluntarios"),
      api.get<Usuario[]>("/usuarios")
    ]);
    setItems(voluntarios.data);
    setUsuarios(usuariosResponse.data.filter((item) => item.tipo === "Voluntario"));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const target = event.currentTarget;
    const form = new FormData(target);
    const selectedUsuarioId = Number(form.get("usuarioId"));
    const nome = String(form.get("nome")).trim();
    const email = String(form.get("email")).trim();

    try {
      let usuarioId = selectedUsuarioId;

      if (!usuarioId) {
        if (!email) {
          setMessage("Informe um e-mail para criar o usuário voluntário.");
          setSaving(false);
          return;
        }

        const usuario = await api.post<Usuario>("/usuarios", {
          nome,
          email,
          senha: String(form.get("senha") || "123456"),
          tipo: "Voluntario",
          telefone: String(form.get("telefone") || ""),
          cidade: String(form.get("cidade") || ""),
          estado: String(form.get("estado") || "").toUpperCase()
        });

        usuarioId = usuario.data.id;
      }

      const habilidades = [
        String(form.get("perfil")),
        String(form.get("apoioCriancas") ? "Disponível para cuidar de crianças durante eventos" : ""),
        String(form.get("habilidades") || "")
      ].filter(Boolean).join(", ");

      await api.post("/voluntarios", {
        usuarioId,
        dataNascimento: String(form.get("dataNascimento") || "") || null,
        genero: String(form.get("genero") || ""),
        disponibilidade: String(form.get("disponibilidade") || ""),
        habilidades,
        bio: "",
        experiencia: String(form.get("habilidades") || ""),
        interesses: habilidades,
        preferenciasAcessibilidade: "",
        necessitaAcessibilidade: false,
        aceitaContatoWhatsapp: true
      });

      setMessage("Voluntário cadastrado para ações do IVG.");
      target.reset();
      await load();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Não foi possível cadastrar o voluntário.");
      }
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    load().catch(() => setMessage("API indisponível. Rode o backend antes de usar a tela."));
  }, []);

  const usuariosDisponiveis = usuarios.filter(
    (usuario) => !items.some((voluntario) => voluntario.usuarioId === usuario.id)
  );

  return (
    <AuthGate role="admin">
    <AppShell>
      <div className="page grid">
        <header className="page-header">
          <div>
            <p className="eyebrow">{IVG_NOME}</p>
            <h1>Cadastro de voluntários</h1>
            <p className="muted">
              Inclui voluntário comum e pessoas sem formação, com indicação de disponibilidade
              para apoiar crianças durante eventos.
            </p>
          </div>
        </header>

        {message && <div className="toast">{message}</div>}

        <section className="grid grid-2">
          <form className="card card-pad grid" onSubmit={submit}>
            <h2>Novo voluntário</h2>
            <label className="field">
              <span>Usuário voluntário</span>
              <select className="input" name="usuarioId">
                <option value="">Criar novo usuário automaticamente</option>
                {usuariosDisponiveis.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
              </select>
            </label>
            <label className="field"><span>Nome</span><input className="input" name="nome" required /></label>
            <label className="field"><span>E-mail</span><input className="input" name="email" type="email" /></label>
            <label className="field"><span>Senha inicial</span><input className="input" name="senha" defaultValue="123456" minLength={6} /></label>
            <label className="field"><span>Telefone</span><input className="input" name="telefone" /></label>
            <div className="grid grid-2">
              <label className="field"><span>Cidade</span><input className="input" name="cidade" defaultValue="Santos" /></label>
              <label className="field"><span>UF</span><input className="input" name="estado" defaultValue="SP" maxLength={2} /></label>
            </div>
            <div className="grid grid-2">
              <label className="field"><span>Nascimento</span><input className="input" name="dataNascimento" type="date" /></label>
              <label className="field"><span>Gênero</span><input className="input" name="genero" /></label>
            </div>
            <label className="field">
              <span>Perfil</span>
              <select className="input" name="perfil" defaultValue="Voluntário comum sem formação específica">
                <option>Voluntário comum sem formação específica</option>
                <option>Voluntário com formação ou experiência</option>
                <option>Mãe, tutor ou responsável atípico</option>
              </select>
            </label>
            <label className="field"><span>Disponibilidade</span><input className="input" name="disponibilidade" placeholder="Ex.: finais de semana, noites, eventos pontuais" /></label>
            <label className="field"><span>Habilidades ou observações</span><textarea className="input" name="habilidades" /></label>
            <label className="check-row">
              <input name="apoioCriancas" type="checkbox" />
              <span>Disponível para cuidar de crianças durante eventos</span>
            </label>
            <button className="button" disabled={saving}>{saving ? "Salvando..." : "Cadastrar voluntário"}</button>
          </form>

          <div className="card table-wrap">
            <table>
              <thead><tr><th>Voluntário</th><th>Disponibilidade</th><th>Perfil</th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.usuario?.nome || `Voluntário #${item.id}`}</td>
                    <td>{item.disponibilidade || "-"}</td>
                    <td>{item.habilidades || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
    </AuthGate>
  );
}

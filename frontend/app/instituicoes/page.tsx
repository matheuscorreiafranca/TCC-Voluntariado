"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { api, Instituicao, Usuario } from "@/services/api";

export default function InstituicoesPage() {
  const [items, setItems] = useState<Instituicao[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [message, setMessage] = useState("");

  async function load() {
    const [instituicoes, usuariosResponse] = await Promise.all([
      api.get<Instituicao[]>("/instituicoes"),
      api.get<Usuario[]>("/usuarios")
    ]);
    setItems(instituicoes.data);
    setUsuarios(usuariosResponse.data.filter((item) => item.tipo === "Instituicao"));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await api.post("/instituicoes", {
        usuarioId: Number(form.get("usuarioId")),
        nome: String(form.get("nome")),
        cnpj: String(form.get("cnpj")),
        responsavel: String(form.get("responsavel")),
        descricao: String(form.get("descricao"))
      });
      setMessage("Instituição cadastrada.");
      event.currentTarget.reset();
      await load();
    } catch {
      setMessage("Não foi possível cadastrar. Confira se o usuário já possui instituição.");
    }
  }

  useEffect(() => {
    load().catch(() => setMessage("API indisponível. Rode o backend antes de usar a tela."));
  }, []);

  return (
    <AppShell>
      <div className="page grid">
        <header className="page-header">
          <div>
            <p className="eyebrow">Instituições</p>
            <h1>Organizações parceiras</h1>
            <p className="muted">Cadastro simples para entidades que publicam oportunidades.</p>
          </div>
        </header>

        {message && <div className="toast">{message}</div>}

        <section className="grid grid-2">
          <form className="card card-pad grid" onSubmit={submit}>
            <h2>Nova instituição</h2>
            <label className="field">
              <span>Usuário</span>
              <select className="input" name="usuarioId" required>
                <option value="">Selecione</option>
                {usuarios.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
              </select>
            </label>
            <label className="field"><span>Nome</span><input className="input" name="nome" required /></label>
            <label className="field"><span>CNPJ</span><input className="input" name="cnpj" /></label>
            <label className="field"><span>Responsável</span><input className="input" name="responsavel" /></label>
            <label className="field"><span>Descrição</span><textarea className="input" name="descricao" /></label>
            <button className="button">Cadastrar</button>
          </form>

          <div className="card table-wrap">
            <table>
              <thead><tr><th>Instituição</th><th>Responsável</th><th>Status</th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nome}</td>
                    <td>{item.responsavel || "-"}</td>
                    <td><StatusBadge status={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

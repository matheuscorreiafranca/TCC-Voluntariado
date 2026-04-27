"use client";

import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
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
    const target = event.currentTarget;
    const form = new FormData(target);
    const selectedUsuarioId = Number(form.get("usuarioId"));
    const nome = String(form.get("nome")).trim();
    const email = String(form.get("email")).trim();

    try {
      let usuarioId = selectedUsuarioId;

      if (!usuarioId) {
        if (!email) {
          setMessage("Informe um e-mail para criar o usuário institucional.");
          return;
        }

        const usuario = await api.post<Usuario>("/usuarios", {
          nome,
          email,
          senha: String(form.get("senha") || "123456"),
          tipo: "Instituicao",
          telefone: String(form.get("telefone") || ""),
          cidade: String(form.get("cidade") || ""),
          estado: String(form.get("estado") || "").toUpperCase()
        });

        usuarioId = usuario.data.id;
      }

      await api.post("/instituicoes", {
        usuarioId,
        nome,
        cnpj: String(form.get("cnpj")),
        responsavel: String(form.get("responsavel")),
        descricao: String(form.get("descricao"))
      });
      setMessage("Instituição cadastrada.");
      target.reset();
      await load();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setMessage(error.response.data.message);
        return;
      }

      setMessage("Não foi possível cadastrar. Confira os dados e tente novamente.");
    }
  }

  useEffect(() => {
    load().catch(() => setMessage("API indisponível. Rode o backend antes de usar a tela."));
  }, []);

  const usuariosDisponiveis = usuarios.filter(
    (usuario) => !items.some((instituicao) => instituicao.usuarioId === usuario.id)
  );

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
              <span>Usuário institucional</span>
              <select className="input" name="usuarioId">
                <option value="">Criar novo usuário automaticamente</option>
                {usuariosDisponiveis.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
              </select>
            </label>
            <label className="field"><span>Nome</span><input className="input" name="nome" required /></label>
            <label className="field"><span>E-mail do usuário</span><input className="input" name="email" type="email" /></label>
            <label className="field"><span>Senha inicial</span><input className="input" name="senha" defaultValue="123456" minLength={6} /></label>
            <label className="field"><span>Telefone</span><input className="input" name="telefone" /></label>
            <div className="grid grid-2">
              <label className="field"><span>Cidade</span><input className="input" name="cidade" /></label>
              <label className="field"><span>UF</span><input className="input" name="estado" maxLength={2} /></label>
            </div>
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

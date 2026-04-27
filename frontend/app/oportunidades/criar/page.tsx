"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { api, Categoria, Instituicao } from "@/services/api";

export default function CriarOportunidadePage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      api.get<Categoria[]>("/categorias"),
      api.get<Instituicao[]>("/instituicoes")
    ]).then(([categoriasResponse, instituicoesResponse]) => {
      setCategorias(categoriasResponse.data);
      setInstituicoes(instituicoesResponse.data);
    }).catch(() => setMessage("Não foi possível carregar os cadastros de apoio."));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    const payload = {
      instituicaoId: Number(form.get("instituicaoId")),
      categoriaId: Number(form.get("categoriaId")) || null,
      titulo: String(form.get("titulo")),
      tipo: String(form.get("tipo")),
      descricao: String(form.get("descricao")),
      objetivo: String(form.get("objetivo")),
      cidade: String(form.get("cidade")),
      estado: String(form.get("estado")),
      dataInicio: String(form.get("dataInicio")),
      dataFim: String(form.get("dataFim")) || null,
      vagas: Number(form.get("vagas") || 1),
      status: "Ativa"
    };

    try {
      await api.post("/oportunidades", payload);
      event.currentTarget.reset();
      setMessage("Oportunidade criada com sucesso.");
    } catch {
      setMessage("Não foi possível criar a oportunidade.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <div className="page">
        <header className="page-header">
          <div>
            <p className="eyebrow">Instituição</p>
            <h1>Criar oportunidade</h1>
            <p className="muted">Publique campanha, evento ou projeto com dados essenciais.</p>
          </div>
        </header>

        {message && <div className="toast" style={{ marginBottom: 16 }}>{message}</div>}

        <form className="card card-pad grid" onSubmit={submit}>
          <div className="grid grid-2">
            <label className="field">
              <span>Instituição</span>
              <select className="input" name="instituicaoId" required>
                <option value="">Selecione</option>
                {instituicoes.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Categoria</span>
              <select className="input" name="categoriaId">
                <option value="">Sem categoria</option>
                {categorias.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
              </select>
            </label>
          </div>

          <div className="grid grid-2">
            <label className="field">
              <span>Título</span>
              <input className="input" name="titulo" required />
            </label>
            <label className="field">
              <span>Tipo</span>
              <select className="input" name="tipo" required>
                <option value="Campanha">Campanha</option>
                <option value="Evento">Evento</option>
                <option value="Projeto">Projeto</option>
              </select>
            </label>
          </div>

          <label className="field">
            <span>Descrição</span>
            <textarea className="input" name="descricao" />
          </label>
          <label className="field">
            <span>Objetivo</span>
            <textarea className="input" name="objetivo" />
          </label>

          <div className="grid grid-4">
            <label className="field">
              <span>Cidade</span>
              <input className="input" name="cidade" defaultValue="Cubatão" />
            </label>
            <label className="field">
              <span>Estado</span>
              <input className="input" name="estado" defaultValue="SP" maxLength={2} />
            </label>
            <label className="field">
              <span>Vagas</span>
              <input className="input" name="vagas" type="number" min={1} defaultValue={10} />
            </label>
            <label className="field">
              <span>Início</span>
              <input className="input" name="dataInicio" type="datetime-local" required />
            </label>
          </div>

          <label className="field">
            <span>Fim</span>
            <input className="input" name="dataFim" type="datetime-local" />
          </label>

          <button className="button" disabled={saving}>{saving ? "Salvando..." : "Publicar oportunidade"}</button>
        </form>
      </div>
    </AppShell>
  );
}

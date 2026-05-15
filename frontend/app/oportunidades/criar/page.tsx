"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { api, Categoria, Instituicao } from "@/services/api";
import { findIvgInstituicao, IVG_INSTITUICAO_ID, IVG_NOME } from "@/services/ivg";

export default function CriarOportunidadePage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [instituicaoId, setInstituicaoId] = useState(IVG_INSTITUICAO_ID);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      api.get<Categoria[]>("/categorias"),
      api.get<Instituicao[]>("/instituicoes")
    ]).then(([categoriasResponse, instituicoesResponse]) => {
      const ivg = findIvgInstituicao(instituicoesResponse.data);
      setCategorias(categoriasResponse.data);
      setInstituicoes(ivg ? [ivg] : []);
      setInstituicaoId(ivg?.id ?? IVG_INSTITUICAO_ID);
    }).catch(() => setMessage("Não foi possível carregar os cadastros de apoio."));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    const payload = {
      instituicaoId,
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
      status: "Ativa",
      requisitos: String(form.get("requisitos") || ""),
      turno: String(form.get("turno") || ""),
      localDetalhado: String(form.get("localDetalhado") || ""),
      aceitaSemFormacao: Boolean(form.get("aceitaSemFormacao")),
      precisaApoioCriancas: Boolean(form.get("precisaApoioCriancas"))
    };

    try {
      await api.post("/oportunidades", payload);
      event.currentTarget.reset();
      setMessage("Ação do IVG criada com sucesso.");
    } catch {
      setMessage("Não foi possível criar a ação do IVG.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthGate role="admin">
    <AppShell>
      <div className="page">
        <header className="page-header">
          <div>
            <p className="eyebrow">{IVG_NOME}</p>
            <h1>Criar evento, projeto ou campanha</h1>
            <p className="muted">Cadastro direto para ações exclusivas do Instituto Vitor Gabriel.</p>
          </div>
        </header>

        {message && <div className="toast" style={{ marginBottom: 16 }}>{message}</div>}

        <form className="card card-pad grid" onSubmit={submit}>
          <div className="grid grid-2">
            <label className="field">
              <span>Instituição</span>
              <select className="input" name="instituicaoId" value={instituicaoId} disabled>
                {!instituicoes.length && <option value={instituicaoId}>{IVG_NOME}</option>}
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
              <span>Título da ação</span>
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
              <input className="input" name="cidade" defaultValue="Santos" />
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

          <label className="field">
            <span>Necessidade de voluntários</span>
            <input className="input" value="Apoio em eventos, acolhimento, organização e cuidado de crianças quando houver encontro com famílias." readOnly />
          </label>
          <div className="grid grid-2">
            <label className="field">
              <span>Turno</span>
              <input className="input" name="turno" placeholder="Ex.: manhã, tarde, conforme programação" />
            </label>
            <label className="field">
              <span>Local detalhado</span>
              <input className="input" name="localDetalhado" placeholder="Ex.: Santos/SP - local a confirmar" />
            </label>
          </div>
          <label className="field">
            <span>Requisitos</span>
            <textarea className="input" name="requisitos" placeholder="Informe postura, disponibilidade e habilidades esperadas" />
          </label>
          <div className="volunteer-options">
            <label className="option-card">
              <input name="aceitaSemFormacao" type="checkbox" defaultChecked />
              <span><strong>Aceita sem formação</strong><small>Pessoas voluntárias comuns podem participar.</small></span>
            </label>
            <label className="option-card">
              <input name="precisaApoioCriancas" type="checkbox" />
              <span><strong>Apoio com crianças</strong><small>Ação pode demandar cuidado de crianças durante evento.</small></span>
            </label>
          </div>

          <button className="button" disabled={saving}>{saving ? "Salvando..." : "Publicar ação IVG"}</button>
        </form>
      </div>
    </AppShell>
    </AuthGate>
  );
}

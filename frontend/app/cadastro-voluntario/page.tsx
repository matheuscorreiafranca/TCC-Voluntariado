"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import axios from "axios";
import { api, Usuario } from "@/services/api";
import { saveSession } from "@/services/session";
import { IVG_NOME } from "@/services/ivg";
import { useRouter } from "next/navigation";

const perfis = [
  "Voluntário comum sem formação específica",
  "Voluntário com formação ou experiência",
  "Mãe, tutor ou responsável atípico"
];

export default function CadastroVoluntarioPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const target = event.currentTarget;
    const form = new FormData(target);
    const nome = String(form.get("nome")).trim();
    const email = String(form.get("email")).trim();

    try {
      if (!email) {
        setMessage("Informe um e-mail para concluir o cadastro.");
        setSaving(false);
        return;
      }

      const response = await api.post<{ usuario: Usuario; voluntario: any }>("/voluntarios/cadastro", {
        nome,
        email,
        senha: String(form.get("senha") || "123456"),
        telefone: String(form.get("telefone") || ""),
        cidade: String(form.get("cidade") || ""),
        estado: String(form.get("estado") || "").toUpperCase(),
        dataNascimento: String(form.get("dataNascimento") || "") || null,
        genero: String(form.get("genero") || ""),
        disponibilidade: String(form.get("disponibilidade") || ""),
        habilidades: [
          String(form.get("perfil")),
          String(form.get("apoioCriancas") ? "Disponível para cuidar de crianças durante eventos" : ""),
          String(form.get("acolhimentoFamilias") ? "Disponível para acolhimento de mães atípicas e famílias" : ""),
          String(form.get("habilidades") || "")
        ].filter(Boolean).join(", "),
        bio: String(form.get("bio") || ""),
        experiencia: String(form.get("experiencia") || ""),
        interesses: String(form.get("interesses") || ""),
        preferenciasAcessibilidade: String(form.get("preferenciasAcessibilidade") || ""),
        necessitaAcessibilidade: Boolean(form.get("necessitaAcessibilidade")),
        aceitaContatoWhatsapp: Boolean(form.get("aceitaContatoWhatsapp"))
      });

      saveSession(response.data);
      setMessage("Cadastro enviado com sucesso. Abrindo seu portal do voluntário...");
      target.reset();
      router.push("/voluntario");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else if (axios.isAxiosError(error)) {
        setMessage("Falha no cadastro. Confira a conexão com a API.");
      } else {
        setMessage("Não foi possível cadastrar o voluntário. Confira se a API está rodando.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <Image src="/logos/voluntamais-full.svg" alt={IVG_NOME} width={140} height={40} priority />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:inline">Já tem uma conta?</span>
            <Link href="/login" className="text-sm font-bold text-emerald-600 hover:text-emerald-700">Entrar no portal</Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Faça parte da nossa <span className="text-emerald-600 font-black">rede de carinho</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Seja você um profissional especializado ou alguém com vontade de ajudar, o Instituto Vitor Gabriel tem um lugar especial para você.
          </p>
        </div>

        {message && (
          <div className="mb-8 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 font-medium animate-in fade-in slide-in-from-top-2">
            {message}
          </div>
        )}

        <form className="space-y-8" onSubmit={submit}>
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">1</div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Informações Pessoais</h2>
                <p className="text-sm text-slate-500">Dados básicos para sua identificação e contato.</p>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Nome completo</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none bg-white text-slate-800" name="nome" placeholder="Como quer ser chamado?" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">E-mail</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none bg-white text-slate-800" name="email" type="email" placeholder="seu@email.com" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Telefone (WhatsApp)</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none bg-white text-slate-800" name="telefone" placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Senha de acesso</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none bg-white text-slate-800" name="senha" type="password" defaultValue="123456" minLength={6} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Data de Nascimento</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none bg-white text-slate-800" name="dataNascimento" type="date" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Cidade</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none bg-white text-slate-800" name="cidade" defaultValue="Santos" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">UF</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none bg-white text-slate-800" name="estado" defaultValue="SP" maxLength={2} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Gênero</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none bg-white text-slate-800" name="genero">
                    <option value="">Selecione...</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Outro">Outro / Prefiro não dizer</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">2</div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Seu Perfil de Voluntário</h2>
                <p className="text-sm text-slate-500">Ajude-nos a encontrar as melhores oportunidades para você.</p>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Qual perfil melhor te descreve?</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {perfis.map((perfil) => (
                    <label key={perfil} className="relative group cursor-pointer">
                      <input type="radio" name="perfil" value={perfil} className="peer sr-only" defaultChecked={perfil === perfis[0]} />
                      <div className="p-4 rounded-xl border-2 border-slate-100 peer-checked:border-emerald-50 peer-checked:bg-emerald-50 transition-all h-full text-center flex items-center justify-center">
                        <p className="text-sm font-bold text-slate-700 peer-checked:text-emerald-700">{perfil}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Breve Bio</label>
                <textarea 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none bg-white text-slate-800 h-24 resize-none" 
                  name="bio" 
                  placeholder="Conte um pouco sobre suas motivações..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "apoioCriancas", label: "Cuidado de Crianças", sub: "Apoio durante eventos e atividades." },
                  { id: "acolhimentoFamilias", label: "Acolhimento Familiar", sub: "Suporte especializado para famílias atípicas." },
                  { id: "aceitaContatoWhatsapp", label: "WhatsApp Ativo", sub: "Aceito receber escalas e orientações.", checked: true },
                  { id: "necessitaAcessibilidade", label: "Acessibilidade", sub: "Tenho necessidades de acessibilidade específicas." }
                ].map((opt) => (
                  <label key={opt.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all cursor-pointer">
                    <input type="checkbox" name={opt.id} defaultChecked={opt.checked} className="mt-1 w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700 text-sm">{opt.label}</span>
                      <span className="text-xs text-slate-500">{opt.sub}</span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Habilidades, cursos ou hobbies</label>
                <input 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none bg-white text-slate-800" 
                  name="habilidades" 
                  placeholder="Ex: Recreação, Primeiros Socorros, Organização, Música..." 
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button 
              type="submit"
              disabled={saving}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-200 transition-all transform active:scale-[0.98] disabled:opacity-70"
            >
              {saving ? "Processando Cadastro..." : "Finalizar Cadastro e Entrar"}
            </button>
            <Link 
              href="/" 
              className="px-8 py-4 text-center rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
            >
              Cancelar
            </Link>
          </div>
        </form>

        <footer className="mt-16 text-center space-y-4">
          <p className="text-sm text-slate-400">
            Ao se cadastrar, você concorda com nossos termos de voluntariado e privacidade.
          </p>
          <div className="flex justify-center gap-6">
            <Image src="/logos/voluntamais-icon.svg" alt="" width={32} height={32} className="opacity-30" />
          </div>
        </footer>
      </div>
    </main>
  );
}

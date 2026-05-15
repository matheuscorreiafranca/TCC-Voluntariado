"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/api";
import { saveSession } from "@/services/session";
import { Field, Toast } from "@/components/Ui";

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    try {
      const data = await login(String(form.get("email")), String(form.get("senha")));
      saveSession(data);
      router.push(data.voluntario ? "/voluntario" : "/dashboard");
    } catch {
      setMessage("E-mail ou senha inválidos. Para a demo, use voluntario@ivg.local / 123456.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* Lado Esquerdo - Branding/Marketing */}
      <section className="hidden lg:flex lg:w-1/2 bg-emerald-600 p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/">
            <Image 
              src="/logos/voluntamais-full.svg" 
              alt="Instituto Vitor Gabriel" 
              width={180} 
              height={60} 
              className="brightness-0 invert opacity-90"
            />
          </Link>
          <div className="mt-24 max-w-lg">
            <h2 className="text-4xl font-bold leading-tight mb-6">
              Transforme vidas através do <span className="text-emerald-200">voluntariado</span>.
            </h2>
            <p className="text-emerald-50 text-xl leading-relaxed opacity-90">
              O portal do voluntário é sua porta de entrada para impactar a comunidade. Gerencie suas participações e descubra novas causas.
            </p>
          </div>
        </div>
        
        <div className="relative z-10 bg-emerald-500/30 p-6 rounded-2xl backdrop-blur-sm border border-emerald-400/30">
          <p className="italic text-lg mb-4 text-emerald-50">
            "Ser voluntário no IVG mudou minha perspectiva sobre impacto social. A plataforma facilita encontrar causas que realmente combinam com meu perfil."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800 font-bold">R</div>
            <div>
              <p className="font-semibold text-white">Ricardo Silva</p>
              <p className="text-xs text-emerald-100">Voluntário há 2 anos</p>
            </div>
          </div>
        </div>

        {/* Círculos decorativos */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400 rounded-full opacity-30 blur-3xl"></div>
      </section>

      {/* Lado Direito - Formuário */}
      <section className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <div className="lg:hidden mb-8 flex justify-center">
              <Image src="/logos/voluntamais-full.svg" alt="Instituto Vitor Gabriel" width={220} height={80} priority />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Bem-vindo de volta</h1>
            <p className="text-slate-500">Acesse sua conta para continuar sua jornada.</p>
          </div>

          {message && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm animate-in fade-in slide-in-from-top-2">
              {message}
            </div>
          )}

          <form className="space-y-6" onSubmit={submit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">E-mail</label>
              <input 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none bg-white text-slate-800" 
                name="email" 
                type="email" 
                placeholder="exemplo@email.com"
                defaultValue="voluntario@ivg.local" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700">Senha</label>
                <Link href="#" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">Esqueceu a senha?</Link>
              </div>
              <input 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none bg-white text-slate-800" 
                name="senha" 
                type="password" 
                placeholder="••••••••"
                defaultValue="123456" 
                required 
              />
            </div>

            <button 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none" 
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar no portal"}
            </button>
            
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-50 text-slate-400 italic">Novo por aqui?</span>
              </div>
            </div>

            <Link 
              href="/cadastro-voluntario" 
              className="w-full flex justify-center items-center gap-2 border-2 border-slate-200 hover:border-emerald-500 hover:text-emerald-600 text-slate-600 font-bold py-3 rounded-xl transition-all"
            >
              Criar conta de voluntário
            </Link>
          </form>

          <p className="mt-12 text-center text-xs text-slate-400 uppercase tracking-widest font-semibold">
            &copy; {new Date().getFullYear()} Instituto Vitor Gabriel
          </p>
        </div>
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { getSession, isAdminSession, isVolunteerSession } from "@/services/session";

type Role = "admin" | "voluntario" | "any";

export function AuthGate({ role, children }: { role: Role; children: ReactNode }) {
  const [allowed, setAllowed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const session = getSession();
    const ok = role === "any"
      ? Boolean(session)
      : role === "admin"
        ? isAdminSession()
        : isVolunteerSession();
    setAllowed(ok);
    setChecked(true);
  }, [role]);

  if (!checked) {
    return <div className="loading-card">Verificando acesso...</div>;
  }

  if (!allowed) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <p className="eyebrow">Acesso restrito</p>
          <h1>Esta área não está disponível para este perfil.</h1>
          <p className="muted">Entre com uma conta autorizada para continuar. Voluntários acessam apenas o portal do voluntário.</p>
          <div className="actions">
            <Link className="button" href="/login">Entrar</Link>
            <Link className="button secondary" href="/voluntario">Portal do voluntário</Link>
          </div>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { clearSession, getSession } from "@/services/session";

const nav = [
  { href: "/voluntario", label: "Visão geral" },
  { href: "/voluntario/inscricoes", label: "Minhas inscrições" },
  { href: "/voluntario/habilidades", label: "Habilidades" },
  { href: "/voluntario/perfil", label: "Perfil" },
  { href: "/oportunidades", label: "Oportunidades" }
];

export function VolunteerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = getSession();

  function logout() {
    clearSession();
    router.push("/login");
  }

  return (
    <div className="volunteer-shell">
      <aside className="volunteer-nav">
        <Link className="brand brand-text" href="/voluntario">
          <Image src="/logos/voluntamais-icon.svg" alt="Instituto Vitor Gabriel" width={46} height={46} />
          <span>
            <strong>Portal IVG</strong>
            <small>{session?.usuario?.nome || "Voluntário"}</small>
          </span>
        </Link>
        <nav>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={pathname === item.href ? "active" : ""}>
              {item.label}
            </Link>
          ))}
        </nav>
        <button className="button secondary" onClick={logout}>Sair</button>
      </aside>
      <main className="volunteer-main">{children}</main>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSession, isAdminSession, isVolunteerSession } from "@/services/session";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const session = getSession();
  const navItems = [
    { href: "/", label: "Home", show: true },
    { href: "/login", label: "Entrar", show: !session },
    { href: "/cadastro-voluntario", label: "Cadastrar voluntário", show: !session || isAdminSession() },
    { href: "/voluntario", label: "Portal do voluntário", show: isVolunteerSession() },
    { href: "/oportunidades", label: "Eventos e projetos", show: true },
    { href: "/dashboard", label: "Painel admin", show: isAdminSession() },
    { href: "/oportunidades/criar", label: "Novo evento", show: isAdminSession() },
    { href: "/voluntarios", label: "Voluntários", show: isAdminSession() },
    { href: "/inscricoes", label: "Vínculos", show: isAdminSession() },
    { href: "/instituicoes", label: "Instituto", show: isAdminSession() }
  ];

  return (
    <div className="shell">
      <aside className="sidebar">
        <Link className="brand brand-text" href="/">
          <Image src="/logos/voluntamais-icon.svg" alt="Instituto Vitor Gabriel" width={46} height={46} />
          <span>
            <strong>Instituto Vitor Gabriel</strong>
            <small>Voluntariado</small>
          </span>
        </Link>

        <nav className="nav">
          {navItems.filter((item) => item.show).map((item) => (
            <Link
              key={item.href}
              className={pathname === item.href ? "active" : ""}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="main">{children}</main>
    </div>
  );
}

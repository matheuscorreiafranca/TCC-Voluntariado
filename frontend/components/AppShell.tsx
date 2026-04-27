"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/oportunidades", label: "Oportunidades" },
  { href: "/oportunidades/criar", label: "Criar oportunidade" },
  { href: "/inscricoes", label: "Inscrições" },
  { href: "/instituicoes", label: "Instituições" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="shell">
      <aside className="sidebar">
        <Link className="brand" href="/dashboard">
          <Image src="/logos/voluntamais-icon.svg" alt="VoluntaMais" width={44} height={44} />
          <Image src="/logos/voluntamais-wordmark.svg" alt="VoluntaMais" width={160} height={44} />
        </Link>

        <nav className="nav">
          {navItems.map((item) => (
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

import Link from "next/link";
import { ReactNode } from "react";
import { StatusBadge } from "./StatusBadge";
import { Oportunidade } from "@/services/api";

export function SectionHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="section-header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}

export function MetricCard({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </article>
  );
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function Toast({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "success" | "danger" }) {
  return <div className={`toast toast-${tone}`}>{children}</div>;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function OpportunityCard({ item, href, actionLabel = "Ver detalhes" }: { item: Oportunidade; href?: string; actionLabel?: string }) {
  const ocupadas = item.inscricoes?.filter((x) => x.status === "Pendente" || x.status === "Aprovada").length ?? 0;

  return (
    <article className="opportunity-card premium-card">
      <div className="opportunity-meta">
        <span className="status">{item.tipo}</span>
        <StatusBadge status={item.status} />
      </div>
      <div>
        <h3>{item.titulo}</h3>
        <p className="muted">{item.descricao || item.objetivo || "Ação do Instituto Vitor Gabriel."}</p>
      </div>
      <div className="opportunity-facts">
        <span>{item.categoria?.nome || "Sem categoria"}</span>
        <span>{item.turno || "Conforme agenda"}</span>
        <span>{item.cidade}/{item.estado}</span>
        <span>{Math.max(0, item.vagas - ocupadas)} vagas livres</span>
      </div>
      {href && <Link className="button secondary" href={href}>{actionLabel}</Link>}
    </article>
  );
}

export function NotificationItem({ title, text, unread }: { title: string; text: string; unread?: boolean }) {
  return (
    <article className={`notification-item ${unread ? "unread" : ""}`}>
      <span aria-hidden="true" />
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </article>
  );
}

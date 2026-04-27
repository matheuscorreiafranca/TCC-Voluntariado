export function LoadingBlock({ label = "Carregando dados..." }: { label?: string }) {
  return <div className="card card-pad muted">{label}</div>;
}

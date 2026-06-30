export function statusClasses(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized === 'aprovada' || normalized === 'aprovado' || normalized === 'ativa') {
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  }
  if (normalized === 'reprovada' || normalized === 'reprovado' || normalized === 'cancelada') {
    return 'bg-red-100 text-red-700 border-red-200';
  }
  if (normalized === 'concluida' || normalized === 'encerrada') {
    return 'bg-blue-100 text-blue-700 border-blue-200';
  }
  return 'bg-amber-100 text-amber-800 border-amber-200';
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses(status)}`}>
      {status}
    </span>
  );
}

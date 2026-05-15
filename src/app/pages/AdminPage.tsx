import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Check,
  ClipboardList,
  HeartHandshake,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Users,
  X
} from 'lucide-react';
import {
  AdminDashboard,
  AdminInscricao,
  aprovarInscricao,
  carregarDashboardAdmin,
  reprovarInscricao
} from '../services/adminService';
import { ApiException } from '../services/apiClient';

type AdminTab = 'inscricoes' | 'oportunidades' | 'usuarios' | 'instituicoes';

interface AdminPageProps {
  adminName: string;
  setShowNovoProjeto: (show: boolean) => void;
}

const tabs: { id: AdminTab; label: string }[] = [
  { id: 'inscricoes', label: 'Inscricoes' },
  { id: 'oportunidades', label: 'Oportunidades' },
  { id: 'usuarios', label: 'Usuarios' },
  { id: 'instituicoes', label: 'Instituicoes' }
];

function formatDate(value?: string | null): string {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('pt-BR');
}

function statusClasses(status: string): string {
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

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses(status)}`}>
      {status}
    </span>
  );
}

export function AdminPage({ adminName, setShowNovoProjeto }: AdminPageProps) {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('inscricoes');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState('');

  const pendentes = useMemo(
    () => dashboard?.inscricoes.filter((inscricao) => inscricao.status === 'Pendente') ?? [],
    [dashboard]
  );

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      setDashboard(await carregarDashboardAdmin());
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Nao foi possivel carregar o painel administrativo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleAprovar = async (inscricao: AdminInscricao) => {
    setActionLoading(inscricao.id);
    try {
      await aprovarInscricao(inscricao.id);
      await loadDashboard();
    } catch (err) {
      alert(err instanceof ApiException ? err.message : 'Erro ao aprovar inscricao.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReprovar = async (inscricao: AdminInscricao) => {
    const motivo = window.prompt('Informe o motivo da reprovacao:', inscricao.motivoReprovacao || '');
    if (motivo === null) return;

    setActionLoading(inscricao.id);
    try {
      await reprovarInscricao(inscricao.id, motivo.trim() || 'Reprovada pela administracao.');
      await loadDashboard();
    } catch (err) {
      alert(err instanceof ApiException ? err.message : 'Erro ao reprovar inscricao.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-[#123E5C] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                <ShieldCheck className="w-4 h-4" />
                Painel administrativo
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold">Ola, {adminName || 'Administrador'}</h1>
              <p className="text-white/80 mt-2">Acompanhe cadastros, oportunidades e aprove ou reprove inscricoes.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => setShowNovoProjeto(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFD500] text-gray-900 px-4 py-2.5 text-sm font-medium hover:bg-[#FFC700] transition-colors"
              >
                Nova oportunidade
              </button>
              <button
                onClick={loadDashboard}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-[#123E5C] px-4 py-2.5 text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && !dashboard ? (
          <div className="flex min-h-[360px] items-center justify-center text-gray-600">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Carregando painel...
          </div>
        ) : dashboard ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <MetricCard icon={<Users className="w-5 h-5" />} label="Usuarios" value={dashboard.resumo.usuarios} color="teal" />
              <MetricCard icon={<Building2 className="w-5 h-5" />} label="Instituicoes" value={dashboard.resumo.instituicoes} color="indigo" />
              <MetricCard icon={<HeartHandshake className="w-5 h-5" />} label="Oportunidades" value={dashboard.resumo.oportunidades} color="rose" />
              <MetricCard icon={<ClipboardList className="w-5 h-5" />} label="Inscricoes pendentes" value={dashboard.resumo.pendentes} color="amber" />
            </div>

            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Gestao do sistema</h2>
                <p className="text-sm text-gray-600">
                  {dashboard.resumo.inscricoes} inscricoes no total, {dashboard.resumo.aprovadas} aprovadas e {dashboard.resumo.reprovadas} reprovadas.
                </p>
              </div>
              <div className="inline-flex w-full overflow-hidden rounded-lg border border-gray-200 bg-white p-1 lg:w-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors lg:flex-none ${
                      activeTab === tab.id ? 'bg-[#4A9DB5] text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'inscricoes' && (
              <section className="space-y-4">
                {pendentes.length > 0 && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    Existem {pendentes.length} inscricoes aguardando aprovacao.
                  </div>
                )}
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100 text-left text-xs uppercase text-gray-600">
                      <tr>
                        <th className="px-4 py-3">Voluntario</th>
                        <th className="px-4 py-3">Oportunidade</th>
                        <th className="px-4 py-3">Instituicao</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Data</th>
                        <th className="px-4 py-3 text-right">Acoes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {dashboard.inscricoes.map((inscricao) => (
                        <tr key={inscricao.id} className="align-top">
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{inscricao.voluntarioNome}</div>
                            <div className="text-xs text-gray-500">{inscricao.voluntarioEmail}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-700">{inscricao.oportunidadeTitulo}</td>
                          <td className="px-4 py-3 text-gray-700">{inscricao.instituicao}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={inscricao.status} />
                            {inscricao.motivoReprovacao && (
                              <div className="mt-2 max-w-xs text-xs text-gray-500">{inscricao.motivoReprovacao}</div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-600">{formatDate(inscricao.dataInsercao)}</td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleAprovar(inscricao)}
                                disabled={actionLoading === inscricao.id}
                                title="Aprovar inscricao"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                              >
                                {actionLoading === inscricao.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleReprovar(inscricao)}
                                disabled={actionLoading === inscricao.id}
                                title="Reprovar inscricao"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activeTab === 'oportunidades' && (
              <AdminTable
                headers={['Titulo', 'Instituicao', 'Categoria', 'Status', 'Vagas']}
                rows={dashboard.oportunidades.map((item) => [
                  item.titulo,
                  item.instituicao,
                  item.categoria || '-',
                  <StatusBadge status={item.status} />,
                  `${item.vagasOcupadas}/${item.vagas} (${item.vagasDisponiveis} livres)`
                ])}
              />
            )}

            {activeTab === 'usuarios' && (
              <AdminTable
                headers={['Nome', 'Email', 'Tipo', 'Local', 'Situacao']}
                rows={dashboard.usuarios.map((item) => [
                  item.nome,
                  item.email,
                  item.tipo,
                  [item.cidade, item.estado].filter(Boolean).join(' - ') || '-',
                  item.ativo ? 'Ativo' : 'Inativo'
                ])}
              />
            )}

            {activeTab === 'instituicoes' && (
              <AdminTable
                headers={['Instituicao', 'Responsavel', 'Email', 'Status', 'Criada em']}
                rows={dashboard.instituicoes.map((item) => [
                  item.nome,
                  item.responsavel || '-',
                  item.email,
                  <StatusBadge status={item.status} />,
                  formatDate(item.dataInsercao)
                ])}
              />
            )}
          </>
        ) : null}
      </main>
    </div>
  );
}

function MetricCard({ icon, label, value, color }: { icon: ReactNode; label: string; value: number; color: 'teal' | 'indigo' | 'rose' | 'amber' }) {
  const colors = {
    teal: 'bg-teal-100 text-teal-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    rose: 'bg-rose-100 text-rose-700',
    amber: 'bg-amber-100 text-amber-800'
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${colors[color]}`}>{icon}</div>
        <div>
          <div className="text-2xl font-semibold text-gray-900">{value}</div>
          <div className="text-sm text-gray-600">{label}</div>
        </div>
      </div>
    </div>
  );
}

function AdminTable({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100 text-left text-xs uppercase text-gray-600">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 text-gray-700">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

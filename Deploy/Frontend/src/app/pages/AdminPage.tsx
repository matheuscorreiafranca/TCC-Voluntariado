import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Check,
  ClipboardList,
  HeartHandshake,
  Loader2,
  MessageSquareText,
  RefreshCw,
  ShieldCheck,
  Users,
  X,
  Eye,
  Trash2,
  Edit2,
  Award,
  User
} from 'lucide-react';
import {
  AdminDashboard,
  AdminInscricao,
  AdminOportunidade,
  carregarDashboardAdmin, 
  aprovarInscricao, 
  reprovarInscricao, 
  finalizarInscricao,
  atualizarOportunidade, 
  deletarOportunidade,
  obterDetalhesUsuario,
  banirUsuario
} from '../services/adminService';
import { ApiException } from '../services/apiClient';
import { StatusBadge } from '../components/ui/StatusBadge';
import { GenericModal } from '../components/modals/GenericModal';

type AdminTab = 'inscricoes' | 'oportunidades' | 'usuarios';

interface AdminPageProps {
  adminName: string;
  setShowNovoProjeto: (show: boolean) => void;
  setCurrentPage: (page: 'home' | 'oportunidades' | 'detalhes' | 'painel' | 'painel-org' | 'painel-admin' | 'feedbacks') => void;
}

const tabs: { id: AdminTab; label: string }[] = [
  { id: 'inscricoes', label: 'Inscricoes' },
  { id: 'oportunidades', label: 'Oportunidades' },
  { id: 'usuarios', label: 'Usuarios' },
  // { id: 'instituicoes', label: 'Instituicoes' }
];

function formatDate(value?: string | null): string {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('pt-BR');
}

export function AdminPage({ adminName, setShowNovoProjeto, setCurrentPage }: AdminPageProps) {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('inscricoes');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState('');

  const [editingOportunidade, setEditingOportunidade] = useState<AdminOportunidade | null>(null);
  const [editForm, setEditForm] = useState({ titulo: '', descricao: '', vagas: 0, status: '' });
  const [deletingOportunidade, setDeletingOportunidade] = useState<AdminOportunidade | null>(null);
  const [visualizandoUsuario, setVisualizandoUsuario] = useState<any>(null);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  
  const [reprovandoInscricao, setReprovandoInscricao] = useState<AdminInscricao | null>(null);
  const [motivoReprovacao, setMotivoReprovacao] = useState('');

  const [finalizandoInscricao, setFinalizandoInscricao] = useState<AdminInscricao | null>(null);
  const [horasComprovadas, setHorasComprovadas] = useState<number>(0);
  
  const [visualizandoInscricao, setVisualizandoInscricao] = useState<AdminInscricao | null>(null);

  const pendentes = useMemo(
    () => dashboard?.inscricoes.filter((inscricao) => inscricao.status === 'Pendente') ?? [],
    [dashboard]
  );

  const sortedInscricoes = useMemo(() => {
    if (!dashboard?.inscricoes) return [];
    const statusOrder: Record<string, number> = {
      'Pendente': 1,
      'Aprovada': 2,
      'Reprovada': 3
    };
    return [...dashboard.inscricoes].sort((a, b) => {
      const orderA = statusOrder[a.status] || 99;
      const orderB = statusOrder[b.status] || 99;
      
      if (orderA === orderB) {
        return new Date(b.dataInsercao).getTime() - new Date(a.dataInsercao).getTime();
      }
      
      return orderA - orderB;
    });
  }, [dashboard?.inscricoes]);

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

  const handleViewUser = async (id: number) => {
    setLoadingUserDetails(true);
    try {
      const data = await obterDetalhesUsuario(id);
      setVisualizandoUsuario(data);
    } catch (err: any) {
      alert("Erro ao carregar detalhes: " + (err.message || ''));
    } finally {
      setLoadingUserDetails(false);
    }
  };

  const handleBanUser = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja banir este usuário? Ele não poderá mais acessar o sistema.")) return;
    
    setActionLoading(id);
    try {
      await banirUsuario(id);
      alert("Usuário banido com sucesso.");
      setVisualizandoUsuario(null);
      await loadDashboard();
    } catch (err: any) {
      alert("Erro ao banir usuário: " + (err.message || ''));
    } finally {
      setActionLoading(null);
    }
  };

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

  const handleReprovar = (inscricao: AdminInscricao) => {
    setReprovandoInscricao(inscricao);
    setMotivoReprovacao(inscricao.motivoReprovacao || '');
  };

  const confirmReprovarInscricao = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!reprovandoInscricao) return;

    setActionLoading(reprovandoInscricao.id);
    try {
      await reprovarInscricao(reprovandoInscricao.id, motivoReprovacao.trim() || 'Reprovada pela administração.');
      setReprovandoInscricao(null);
      await loadDashboard();
    } catch (err) {
      alert(err instanceof ApiException ? err.message : 'Erro ao reprovar inscricao.');
    } finally {
      setActionLoading(null);
    }
  };

  const confirmFinalizarInscricao = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!finalizandoInscricao) return;

    if (horasComprovadas <= 0) {
      alert('Informe uma quantidade de horas válida.');
      return;
    }

    setActionLoading(finalizandoInscricao.id);
    try {
      await finalizarInscricao(finalizandoInscricao.id, horasComprovadas);
      setFinalizandoInscricao(null);
      await loadDashboard();
    } catch (err) {
      alert(err instanceof ApiException ? err.message : 'Erro ao finalizar inscrição.');
    } finally {
      setActionLoading(null);
    }
  };

  const confirmDeleteOportunidade = async () => {
    if (!deletingOportunidade) return;

    setActionLoading(deletingOportunidade.id);
    try {
      await deletarOportunidade(deletingOportunidade.id);
      setDeletingOportunidade(null);
      await loadDashboard();
    } catch (err) {
      alert(err instanceof ApiException ? err.message : 'Erro ao excluir oportunidade.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditOportunidadeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOportunidade) return;

    setActionLoading(editingOportunidade.id);
    try {
      await atualizarOportunidade(editingOportunidade.id, {
        titulo: editForm.titulo,
        descricao: editForm.descricao,
        vagas: editForm.vagas
      });
      setEditingOportunidade(null);
      await loadDashboard();
    } catch (err) {
      alert(err instanceof ApiException ? err.message : 'Erro ao atualizar oportunidade.');
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
              <button
                onClick={() => setCurrentPage('feedbacks')}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 text-white px-4 py-2.5 text-sm font-medium ring-1 ring-white/30 hover:bg-white/20 transition-colors"
              >
                <MessageSquareText className="w-4 h-4" />
                Feedbacks
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
                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors lg:flex-none ${activeTab === tab.id ? 'bg-[#4A9DB5] text-white' : 'text-gray-700 hover:bg-gray-100'
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
                      {sortedInscricoes.map((inscricao) => (
                        <tr key={inscricao.id} className="align-top">
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{inscricao.voluntarioNome}</div>
                            <div className="text-xs text-gray-500">{inscricao.voluntarioEmail}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-700">{inscricao.oportunidadeTitulo}</td>
                          <td className="px-4 py-3 text-gray-700">{inscricao.instituicao}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={inscricao.status} />
                          </td>
                          <td className="px-4 py-3 text-gray-600">{formatDate(inscricao.dataInsercao)}</td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setVisualizandoInscricao(inscricao)}
                                title="Ver detalhes do voluntário"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleAprovar(inscricao)}
                                disabled={actionLoading === inscricao.id || inscricao.status !== 'Pendente'}
                                title="Aprovar inscricao"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {actionLoading === inscricao.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleReprovar(inscricao)}
                                disabled={actionLoading === inscricao.id || inscricao.status !== 'Pendente'}
                                title="Reprovar inscricao"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              {inscricao.status === 'Aprovada' && (
                                <button
                                  onClick={() => {
                                    setFinalizandoInscricao(inscricao);
                                    setHorasComprovadas(0);
                                  }}
                                  disabled={actionLoading === inscricao.id}
                                  title="Finalizar Inscrição e Gerar Certificado"
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Award className="w-4 h-4" />
                                </button>
                              )}
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
                headers={['Titulo', 'Instituicao', 'Categoria', 'Status', 'Vagas', 'Acoes']}
                rows={dashboard.oportunidades.map((item) => [
                  item.titulo,
                  item.instituicao,
                  item.categoria || '-',
                  <StatusBadge status={item.status} />,
                  `${item.vagasOcupadas}/${item.vagas} (${item.vagasDisponiveis} livres)`,
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingOportunidade(item);
                        setEditForm({ titulo: item.titulo, descricao: item.descricao || '', vagas: item.vagas, status: item.status });
                      }}
                      disabled={actionLoading === item.id || item.status.toLowerCase() === 'encerrada' || item.vagasOcupadas > 0}
                      title={item.vagasOcupadas > 0 ? "Não é possível editar oportunidades com inscrições" : "Editar"}
                      className="inline-flex h-8 w-8 items-center justify-center rounded bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeletingOportunidade(item)}
                      disabled={actionLoading === item.id || item.status.toLowerCase() === 'encerrada'}
                      title="Excluir"
                      className="inline-flex h-8 w-8 items-center justify-center rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                    >
                      {actionLoading === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                ])}
              />
            )}

            {activeTab === 'usuarios' && (
              <AdminTable
                headers={['Nome', 'Email', 'Tipo', 'Local', 'Situacao', 'Acoes']}
                rows={dashboard.usuarios.map((item) => [
                  item.nome,
                  item.email,
                  item.tipo,
                  [item.cidade, item.estado].filter(Boolean).join(' - ') || '-',
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${item.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.ativo ? 'Ativo' : 'Inativo'}
                  </span>,
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewUser(item.id)}
                      disabled={loadingUserDetails}
                      title="Ver Detalhes"
                      className="inline-flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                    >
                      <User className="h-4 w-4" />
                    </button>
                  </div>
                ])}
              />
            )}

            {/* {activeTab === 'instituicoes' && (
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
            )} */}
          </>
        ) : null}

        {visualizandoUsuario && (
          <GenericModal
            isOpen={!!visualizandoUsuario}
            onClose={() => setVisualizandoUsuario(null)}
            title="Detalhes do Usuário"
            maxWidth="2xl"
            footer={
              <div className="w-full flex justify-between items-center">
                <button
                  type="button"
                  disabled={!visualizandoUsuario.ativo || actionLoading === visualizandoUsuario.id}
                  onClick={() => handleBanUser(visualizandoUsuario.id)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 border border-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {actionLoading === visualizandoUsuario.id ? 'Aguarde...' : 'Banir Usuário'}
                </button>
                <button
                  type="button"
                  onClick={() => setVisualizandoUsuario(null)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-[#123E5C] hover:bg-[#0c2a3e] transition-colors"
                >
                  Fechar
                </button>
              </div>
            }
          >
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold">Nome</div>
                  <div className="text-gray-900">{visualizandoUsuario.nome}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold">E-mail</div>
                  <div className="text-gray-900">{visualizandoUsuario.email}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold">Tipo de Conta</div>
                  <div className="text-gray-900">{visualizandoUsuario.tipo}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold">Status</div>
                  <div className="text-gray-900">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${visualizandoUsuario.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {visualizandoUsuario.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              </div>

              {visualizandoUsuario.tipo === 'Voluntario' && (
                <>
                  {/* Total Hours */}
                  <div className="flex items-center gap-4 bg-[#FFD500]/10 p-4 rounded-lg">
                    <div className="w-12 h-12 bg-[#FFD500]/20 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-[#FFD500]" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Horas Totais Comprovadas</div>
                      <div className="text-2xl font-bold text-gray-900">{visualizandoUsuario.horasTotais}h</div>
                    </div>
                  </div>

                  {/* Actions / Participations */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Ações como Voluntário</h3>
                    <div className="space-y-2">
                      {visualizandoUsuario.inscricoes?.length > 0 ? (
                        visualizandoUsuario.inscricoes.map((insc: any) => (
                          <div key={insc.id} className="p-3 border border-gray-200 rounded-lg flex justify-between items-center">
                            <div>
                              <div className="font-medium text-gray-900 line-clamp-1">{insc.oportunidadeTitulo}</div>
                              <div className="text-sm text-gray-500">{insc.instituicaoNome}</div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-1">
                              <StatusBadge status={insc.status} />
                              <span className="text-xs text-gray-500">{insc.horasComprovadas ? `${insc.horasComprovadas}h` : '-'}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">Nenhuma ação registrada.</p>
                      )}
                    </div>
                  </div>

                  {/* Feedbacks */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Feedbacks Recebidos</h3>
                    <div className="space-y-3">
                      {visualizandoUsuario.feedbacks?.length > 0 ? (
                        visualizandoUsuario.feedbacks.map((fb: any, idx: number) => (
                          <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{fb.instituicaoNome}</div>
                                <div className="text-xs text-gray-500">Na oportunidade: {fb.oportunidadeTitulo}</div>
                              </div>
                              <div className="bg-[#4A9DB5]/10 text-[#4A9DB5] px-2 py-1 rounded text-sm font-medium">
                                Nota: {fb.nota}/5
                              </div>
                            </div>
                            {fb.comentario && (
                              <p className="text-sm text-gray-700 italic border-l-2 border-gray-300 pl-3">
                                "{fb.comentario}"
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">Nenhum feedback recebido ainda.</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </GenericModal>
        )}

        <GenericModal
          isOpen={!!editingOportunidade}
          onClose={() => setEditingOportunidade(null)}
          title="Editar Oportunidade"
          maxWidth="md"
          footer={
            <>
              <button
                type="button"
                onClick={() => setEditingOportunidade(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="edit-oportunidade-form"
                disabled={actionLoading === editingOportunidade?.id}
                className="inline-flex items-center gap-2 rounded-lg bg-[#123E5C] px-4 py-2 text-sm font-medium text-white hover:bg-[#0c2a3e] disabled:opacity-70 transition-colors"
              >
                {actionLoading === editingOportunidade?.id && <Loader2 className="h-4 w-4 animate-spin" />}
                Salvar Alterações
              </button>
            </>
          }
        >
          <form id="edit-oportunidade-form" onSubmit={handleEditOportunidadeSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#123E5C] focus:ring-1 focus:ring-[#123E5C]"
                value={editForm.titulo}
                onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                required
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#123E5C] focus:ring-1 focus:ring-[#123E5C] resize-none"
                value={editForm.descricao}
                onChange={(e) => setEditForm({ ...editForm, descricao: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vagas</label>
              <input
                type="number"
                min="1"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#123E5C] focus:ring-1 focus:ring-[#123E5C]"
                value={editForm.vagas}
                onChange={(e) => setEditForm({ ...editForm, vagas: parseInt(e.target.value) || 0 })}
              />
            </div>
          </form>
        </GenericModal>

        <GenericModal
          isOpen={!!deletingOportunidade}
          onClose={() => setDeletingOportunidade(null)}
          title="Excluir Oportunidade"
          subtitle={`Tem certeza que deseja excluir a oportunidade "${deletingOportunidade?.titulo}"? Esta ação não pode ser desfeita e a oportunidade será encerrada.`}
          maxWidth="sm"
          footer={
            <>
              <button
                type="button"
                onClick={() => setDeletingOportunidade(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDeleteOportunidade}
                disabled={actionLoading === deletingOportunidade?.id}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-70 transition-colors"
              >
                {actionLoading === deletingOportunidade?.id && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirmar Exclusão
              </button>
            </>
          }
        >
          <div className="flex items-center gap-4 text-red-600">
            <Trash2 className="h-8 w-8" />
            <p className="text-sm text-gray-600">
              Ao excluir, a oportunidade desaparecerá das listas públicas e do painel, mas o histórico de inscrições será mantido por segurança.
            </p>
          </div>
        </GenericModal>

        <GenericModal
          isOpen={!!reprovandoInscricao}
          onClose={() => setReprovandoInscricao(null)}
          title="Reprovar Inscrição"
          subtitle={`Informe o motivo da reprovação para ${reprovandoInscricao?.voluntarioNome}.`}
          maxWidth="md"
          footer={
            <>
              <button
                type="button"
                onClick={() => setReprovandoInscricao(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => confirmReprovarInscricao()}
                disabled={actionLoading === reprovandoInscricao?.id}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-70 transition-colors"
              >
                {actionLoading === reprovandoInscricao?.id && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirmar Reprovação
              </button>
            </>
          }
        >
          <form id="reprovar-form" onSubmit={confirmReprovarInscricao} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motivo (enviado ao voluntário)</label>
              <textarea
                required
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#123E5C] focus:ring-1 focus:ring-[#123E5C] resize-none"
                value={motivoReprovacao}
                onChange={(e) => setMotivoReprovacao(e.target.value)}
                placeholder="Descreva o motivo da recusa de forma clara..."
              />
            </div>
          </form>
        </GenericModal>

        <GenericModal
          isOpen={!!visualizandoInscricao}
          onClose={() => setVisualizandoInscricao(null)}
          title="Detalhes da Inscrição"
          subtitle={`Informações do voluntário na oportunidade: ${visualizandoInscricao?.oportunidadeTitulo}`}
          maxWidth="md"
          footer={
            <button
              onClick={() => setVisualizandoInscricao(null)}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors w-full"
            >
              Fechar
            </button>
          }
        >
          {visualizandoInscricao && (
            <div className="space-y-4 text-sm">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Por que quer participar?</h4>
                <p className="text-gray-700">{visualizandoInscricao.motivacao || "Não informado."}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-1">Afinidades</h4>
                  <p className="text-gray-700">
                    {visualizandoInscricao.afinidades?.length > 0 
                      ? visualizandoInscricao.afinidades.join(', ') 
                      : "Nenhuma afinidade registrada."}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-1">Situação / Disponibilidade</h4>
                  <p className="text-gray-700">{visualizandoInscricao.disponibilidade || "Não informada."}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Experiência anterior</h4>
                <p className="text-gray-700">{visualizandoInscricao.experiencia || "Nenhuma experiência informada."}</p>
              </div>

              {visualizandoInscricao.motivoReprovacao && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <h4 className="font-semibold text-red-800 mb-1">Motivo da Reprovação</h4>
                  <p className="text-red-700">{visualizandoInscricao.motivoReprovacao}</p>
                </div>
              )}
            </div>
          )}
        </GenericModal>

        <GenericModal
          isOpen={!!finalizandoInscricao}
          onClose={() => setFinalizandoInscricao(null)}
          title="Finalizar Inscrição"
          subtitle={`Atribua as horas completadas por ${finalizandoInscricao?.voluntarioNome} nesta oportunidade.`}
          maxWidth="sm"
          footer={
            <>
              <button
                type="button"
                onClick={() => setFinalizandoInscricao(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmFinalizarInscricao}
                disabled={actionLoading === finalizandoInscricao?.id || horasComprovadas <= 0}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-70 transition-colors"
              >
                {actionLoading === finalizandoInscricao?.id && <Loader2 className="h-4 w-4 animate-spin" />}
                Concluir e Gerar Certificado
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horas Comprovadas
              </label>
              <input
                type="number"
                min="1"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#123E5C] focus:ring-1 focus:ring-[#123E5C]"
                value={horasComprovadas || ''}
                onChange={(e) => setHorasComprovadas(parseInt(e.target.value) || 0)}
              />
              <p className="mt-1 text-xs text-gray-500">
                Estas horas serão creditadas no perfil do voluntário.
              </p>
            </div>
          </div>
        </GenericModal>
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

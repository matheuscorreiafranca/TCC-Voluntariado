import { useState } from 'react';
import { Calendar, MessageSquareText, Users, Award } from 'lucide-react';
import { ptBR } from '../locales/pt-BR';
import { OportunidadeCard } from '../services/oportunidadeService';
import { VoluntarioDashboardResponse, deletarConta } from '../services/voluntarioService';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAuth } from '../contexts/AuthContext';
import { CertificadoModal } from '../components/ui/CertificadoModal';

interface PainelPageProps {
  userData: {
    nome: string;
    email: string;
    horasVoluntarias: number;
    inscricoesAtivas: number;
    certificados: number;
    inscricoes: VoluntarioDashboardResponse['inscricoes'];
  };
  setCurrentPage: (page: 'home' | 'oportunidades' | 'detalhes' | 'painel' | 'painel-org' | 'painel-admin' | 'feedbacks') => void;
  openOportunidade: (id: number) => void;
  setShowCertificados: (show: boolean) => void;
  setShowCalendario: (show: boolean) => void;
  opportunities: OportunidadeCard[];
}

export function PainelPage({
  userData,
  setCurrentPage,
  openOportunidade,
  setShowCertificados,
  setShowCalendario,
  opportunities
}: PainelPageProps) {
  const [visualizandoCertificado, setVisualizandoCertificado] = useState<any>(null);
  const t = ptBR.painelPage;
  const { logout } = useAuth();

  const handleDeleteAccount = async () => {
    if (window.confirm(t.confirmarExclusao || "Tem certeza que deseja excluir sua conta? Ela será removida permanentemente em 30 dias.")) {
      try {
        await deletarConta();
        alert("Sua conta foi agendada para exclusão e você será desconectado.");
        logout();
      } catch (err: any) {
        alert(err.message || "Erro ao solicitar exclusão da conta.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero do Painel */}
      <section className="bg-gradient-to-r from-[#4A9DB5] to-[#5BACBD] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl mb-2">{t.bemVindo}, {userData.nome}!</h1>
          <p className="text-white/90">{t.acompanhe}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cards de Estatísticas */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#4A9DB5]/10 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#4A9DB5]" />
              </div>
              <div>
                <div className="text-3xl text-gray-900">{userData.horasVoluntarias}h</div>
                <div className="text-sm text-gray-600">{t.horasVoluntarias}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FFD500]/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-[#FFD500]" />
              </div>
              <div>
                <div className="text-3xl text-gray-900">{userData.inscricoesAtivas}</div>
                <div className="text-sm text-gray-600">{t.inscricoesAtivas}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-3xl text-gray-900">{userData.certificados}</div>
                <div className="text-sm text-gray-600">{t.certificados}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Minhas Inscrições */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl mb-6 text-gray-900">{t.minhasInscricoes}</h2>

            <div className="space-y-4">
              {userData.inscricoes.map(insc => (
                  <div key={insc.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                      {insc.oportunidade.imagemUrl ? (
                        <img src={insc.oportunidade.imagemUrl} alt={insc.oportunidade.titulo} className="w-24 h-24 object-cover rounded-lg" />
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400">Sem foto</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg text-gray-900 mb-1">{insc.oportunidade.titulo}</h3>
                            <p className="text-sm text-gray-600">{insc.instituicaoNome}</p>
                          </div>
                          <StatusBadge status={insc.status} />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(insc.dataInscricao).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center gap-1">
                            📍 {insc.oportunidade.cidade} - {insc.oportunidade.estado}
                          </div>
                        </div>
                        <button
                          onClick={() => openOportunidade(insc.oportunidade.id)}
                          className="text-[#4A9DB5] hover:underline text-sm"
                        >
                          {t.verDetalhes}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              {userData.inscricoes.length === 0 && (
                <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg text-gray-900 mb-2">{t.nenhumaInscricao}</h3>
                  <p className="text-gray-600 mb-4">{t.exploreOportunidades}</p>
                  <button
                    onClick={() => setCurrentPage('oportunidades')}
                    className="bg-[#FFD500] hover:bg-[#FFC700] text-gray-900 px-6 py-3 rounded-full transition-colors"
                  >
                    {t.verOportunidades}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Perfil */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg mb-4 text-gray-900">{t.meuPerfil}</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">{t.nome}</div>
                  <div className="text-gray-900">{userData.nome}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">{t.email}</div>
                  <div className="text-gray-900">{userData.email}</div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <button 
                  onClick={handleDeleteAccount}
                  className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                >
                  {t.excluirConta || 'Excluir conta'}
                </button>
              </div>
            </div>
            </div>

            {/* Certificados */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#4A9DB5]/10 rounded-full flex items-center justify-center">
                  <MessageSquareText className="w-5 h-5 text-[#4A9DB5]" />
                </div>
                <h3 className="text-lg text-gray-900">Feedbacks</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Avalie campanhas aprovadas ou concluidas e acompanhe seu historico.</p>
              <button
                onClick={() => setCurrentPage('feedbacks')}
                className="w-full bg-[#FFD500] hover:bg-[#FFC700] text-gray-900 px-4 py-2.5 rounded-lg transition-colors text-sm"
              >
                Abrir feedbacks
              </button>
            </div>

            {/* Certificados */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg mb-4 text-gray-900">{t.certificados}</h3>
              <div className="space-y-3">
                {userData.inscricoes.filter(i => i.certificadoGerado).length > 0 ? (
                  userData.inscricoes
                    .filter(i => i.certificadoGerado)
                    .slice(0, 2)
                    .map(cert => (
                      <div key={cert.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Award className="w-5 h-5 text-[#FFD500]" />
                        <div className="flex-1">
                          <div className="text-sm text-gray-900 line-clamp-1">{cert.oportunidadeTitulo}</div>
                          <div className="text-xs text-gray-500">{cert.horasComprovadas || 0} {t.horas}</div>
                        </div>
                        <button 
                          onClick={() => setVisualizandoCertificado(cert)}
                          className="text-[#4A9DB5] hover:underline text-xs shrink-0"
                        >
                          {t.baixar}
                        </button>
                      </div>
                    ))
                ) : (
                  <div className="text-sm text-gray-500 text-center py-4">Nenhum certificado emitido.</div>
                )}
              </div>
              {userData.inscricoes.filter(i => i.certificadoGerado).length > 2 && (
                <button
                  onClick={() => setShowCertificados(true)}
                  className="w-full mt-4 text-[#4A9DB5] hover:underline text-sm"
                >
                  {t.verMaisCertificados}
                </button>
              )}
            </div>

            {/* Próximas Atividades */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg mb-4 text-gray-900">{t.proximasAtividades}</h3>
              <div className="space-y-4">
                {userData.inscricoes
                  .filter(insc => (insc.status === 'Aprovada' || insc.status === 'Pendente') && insc.oportunidade?.dataInicio)
                  .sort((a, b) => new Date(a.oportunidade.dataInicio!).getTime() - new Date(b.oportunidade.dataInicio!).getTime())
                  .filter(insc => new Date(insc.oportunidade.dataInicio!).getTime() + 86400000 > Date.now())
                  .slice(0, 3)
                  .map(insc => {
                    const data = new Date(insc.oportunidade.dataInicio!);
                    const dia = data.getDate().toString().padStart(2, '0');
                    const mes = data.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
                    return (
                      <div key={insc.id} className="flex gap-3 items-center">
                        <div className="text-center w-12 shrink-0">
                          <div className="text-2xl text-[#4A9DB5] font-semibold leading-none mb-1">{dia}</div>
                          <div className="text-xs text-gray-500 font-medium leading-none">{mes}</div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-900 font-medium line-clamp-1" title={insc.oportunidadeTitulo}>{insc.oportunidadeTitulo}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">{insc.instituicaoNome}</div>
                        </div>
                      </div>
                    );
                  })}
                {userData.inscricoes.length === 0 && (
                  <div className="text-sm text-gray-500 text-center py-4">Nenhuma atividade próxima.</div>
                )}
              </div>
              <button
                onClick={() => setShowCalendario(true)}
                className="w-full mt-4 text-[#4A9DB5] hover:underline text-sm"
              >
                {t.verCalendario}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {visualizandoCertificado && (
        <CertificadoModal 
          isOpen={!!visualizandoCertificado}
          onClose={() => setVisualizandoCertificado(null)}
          voluntarioNome={userData.nome}
          inscricao={visualizandoCertificado}
        />
      )}
    </div>
  );
}

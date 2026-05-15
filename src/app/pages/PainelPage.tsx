import { Calendar, Users, Award } from 'lucide-react';
import { certificados, proximasAtividades } from '../data/mocks';
import { ptBR } from '../locales/pt-BR';
import { OportunidadeCard } from '../services/oportunidadeService';

interface PainelPageProps {
  userData: {
    nome: string;
    email: string;
    horasVoluntarias: number;
    inscricoes: number[];
  };
  setCurrentPage: (page: 'home' | 'oportunidades' | 'detalhes' | 'painel' | 'painel-org' | 'painel-admin') => void;
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
  const t = ptBR.painelPage;

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
                <div className="text-3xl text-gray-900">{userData.inscricoes.length}</div>
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
                <div className="text-3xl text-gray-900">2</div>
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
              {opportunities
                .filter(opp => userData.inscricoes.includes(opp.id))
                .map(opp => (
                  <div key={opp.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                      <img src={opp.image} alt={opp.title} className="w-24 h-24 object-cover rounded-lg" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg text-gray-900 mb-1">{opp.title}</h3>
                            <p className="text-sm text-gray-600">{opp.organizacao}</p>
                          </div>
                          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                            {t.ativa}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {opp.time}
                          </div>
                          <div className="flex items-center gap-1">
                            📍 {opp.location}
                          </div>
                        </div>
                        <button
                          onClick={() => openOportunidade(opp.id)}
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
                <button className="w-full text-[#4A9DB5] hover:underline text-sm mt-4">
                  {t.editarPerfil}
                </button>
              </div>
            </div>

            {/* Certificados */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg mb-4 text-gray-900">{t.certificados}</h3>
              <div className="space-y-3">
                {certificados.slice(0, 2).map(cert => (
                  <div key={cert.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Award className="w-5 h-5 text-[#FFD500]" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{cert.titulo}</div>
                      <div className="text-xs text-gray-500">{cert.horas} {t.horas}</div>
                    </div>
                    <button className="text-[#4A9DB5] hover:underline text-xs">
                      {t.baixar}
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowCertificados(true)}
                className="w-full mt-4 text-[#4A9DB5] hover:underline text-sm"
              >
                {t.verMaisCertificados}
              </button>
            </div>

            {/* Próximas Atividades */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg mb-4 text-gray-900">{t.proximasAtividades}</h3>
              <div className="space-y-3">
                {proximasAtividades.slice(0, 2).map(ativ => {
                  const data = new Date(ativ.data);
                  const dia = data.getDate();
                  const mes = data.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase();
                  return (
                    <div key={ativ.id} className="flex gap-3">
                      <div className="text-center">
                        <div className="text-2xl text-[#4A9DB5]">{dia}</div>
                        <div className="text-xs text-gray-500">{mes}</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">{ativ.titulo}</div>
                        <div className="text-xs text-gray-500">{ativ.hora}</div>
                      </div>
                    </div>
                  );
                })}
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
    </div>
  );
}

import { Users, Calendar, Heart, Award } from 'lucide-react';
import { ptBR } from '../locales/pt-BR';
import { OportunidadeCard } from '../services/oportunidadeService';

interface PainelOrgPageProps {
  orgData: {
    nome: string;
    email: string;
    oportunidades: number[];
  };
  opportunities: OportunidadeCard[];
}

export function PainelOrgPage({ orgData, opportunities }: PainelOrgPageProps) {
  const t = ptBR.painelOrgPage;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero do Painel */}
      <section className="bg-gradient-to-r from-[#4A9DB5] to-[#5BACBD] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl mb-2">{t.titulo}</h1>
          <p className="text-white/90">{orgData.nome}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cards de Métricas */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#4A9DB5]/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-[#4A9DB5]" />
              </div>
              <div>
                <div className="text-3xl text-gray-900">47</div>
                <div className="text-sm text-gray-600">{t.candidatos}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-3xl text-gray-900">23</div>
                <div className="text-sm text-gray-600">{t.voluntariosAtivos}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FFD500]/20 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-[#FFD500]" />
              </div>
              <div>
                <div className="text-3xl text-gray-900">3</div>
                <div className="text-sm text-gray-600">{t.oportunidades}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-3xl text-gray-900">520h</div>
                <div className="text-sm text-gray-600">{t.horasTotais}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Candidatos Recentes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-gray-900">{t.candidatosRecentes}</h2>
                <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>{t.todasOportunidades}</option>
                  <option>Aulas de Reforço Escolar</option>
                  <option>Apoio em Atividades Recreativas</option>
                  <option>Acompanhamento Escolar</option>
                </select>
              </div>

              <div className="space-y-4">
                {[
                  { nome: 'João Silva', email: 'joao@email.com', oportunidade: 'Aulas de Reforço Escolar', data: '2026-05-03', status: 'pendente' },
                  { nome: 'Ana Costa', email: 'ana@email.com', oportunidade: 'Apoio em Atividades Recreativas', data: '2026-05-02', status: 'aprovado' },
                  { nome: 'Pedro Santos', email: 'pedro@email.com', oportunidade: 'Aulas de Reforço Escolar', data: '2026-05-02', status: 'pendente' },
                  { nome: 'Maria Oliveira', email: 'maria@email.com', oportunidade: 'Acompanhamento Escolar', data: '2026-05-01', status: 'aprovado' },
                  { nome: 'Carlos Ferreira', email: 'carlos@email.com', oportunidade: 'Aulas de Reforço Escolar', data: '2026-04-30', status: 'recusado' },
                ].map((candidato, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-[#4A9DB5] rounded-full flex items-center justify-center text-white">
                        {candidato.nome.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-900">{candidato.nome}</h3>
                        <p className="text-sm text-gray-600">{candidato.email}</p>
                        <p className="text-xs text-gray-500 mt-1">{candidato.oportunidade}</p>
                      </div>
                      <div className="text-right mr-4">
                        <div className="text-xs text-gray-500">
                          {new Date(candidato.data).toLocaleDateString('pt-BR')}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          candidato.status === 'aprovado' ? 'bg-green-100 text-green-700' :
                          candidato.status === 'recusado' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {candidato.status === 'aprovado' ? t.aprovado :
                           candidato.status === 'recusado' ? t.recusado : t.pendente}
                        </span>
                      </div>
                    </div>
                    {candidato.status === 'pendente' && (
                      <div className="flex gap-2">
                        <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors">
                          ✓
                        </button>
                        <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors">
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Minhas Oportunidades */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg mb-4 text-gray-900">{t.minhasOportunidades}</h3>
              <div className="space-y-3">
                {opportunities
                  .filter(opp => orgData.oportunidades.includes(opp.id))
                  .map(opp => (
                    <div key={opp.id} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm text-gray-900 mb-1">{opp.title}</h4>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{opp.vagasPreenchidas}/{opp.vagasTotal} {t.vagas}</span>
                        <button className="text-[#4A9DB5] hover:underline">{t.editar}</button>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="mt-4 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                A criacao de oportunidades e feita pelo administrador do sistema.
              </div>
            </div>

            {/* Estatísticas */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg mb-4 text-gray-900">{t.estatisticas}</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">{t.novasInscricoes}</span>
                    <span className="text-gray-900">+12</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#4A9DB5] h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">{t.taxaAprovacao}</span>
                    <span className="text-gray-900">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">{t.horasCompletadas}</span>
                    <span className="text-gray-900">120h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#FFD500] h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

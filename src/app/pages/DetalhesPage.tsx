import { ArrowRight, Calendar, Users } from 'lucide-react';
import { ptBR } from '../locales/pt-BR';
import { OportunidadeCard } from '../services/oportunidadeService';

interface DetalhesPageProps {
  selectedOportunidade: number | null;
  setCurrentPage: (page: 'home' | 'oportunidades' | 'detalhes' | 'painel' | 'painel-org' | 'painel-admin') => void;
  setSelectedOportunidade: (id: number | null) => void;
  handleInscricao: (e: React.FormEvent) => void;
  inscricaoData: { motivacao: string; disponibilidade: string; experiencia: string; };
  setInscricaoData: (data: any) => void;
  opportunities: OportunidadeCard[];
}

export function DetalhesPage({
  selectedOportunidade,
  setCurrentPage,
  setSelectedOportunidade,
  handleInscricao,
  inscricaoData,
  setInscricaoData,
  opportunities
}: DetalhesPageProps) {
  const t = ptBR.detalhesPage;
  const opp = opportunities.find(o => o.id === selectedOportunidade);
  if (!opp) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero com Imagem */}
      <div className="relative h-96 overflow-hidden">
        <img src={opp.image} alt={opp.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => {
                setCurrentPage('home');
                setSelectedOportunidade(null);
              }}
              className="mb-4 flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              {t.voltar}
            </button>
            <span className="inline-block text-sm bg-[#4A9DB5] px-3 py-1 rounded-full mb-3">
              {opp.category}
            </span>
            <h1 className="text-4xl md:text-5xl mb-2">{opp.title}</h1>
            <p className="text-lg text-white/90">{opp.organizacao}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Informações Principais */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-6 h-6 text-[#4A9DB5]" />
                  <h3 className="text-lg text-gray-900">{t.horario}</h3>
                </div>
                <p className="text-gray-600">{opp.time}</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-[#4A9DB5]" />
                  <h3 className="text-lg text-gray-900">{t.vagas}</h3>
                </div>
                <p className="text-gray-600">{opp.vagasTotal - opp.vagasPreenchidas} {t.de} {opp.vagasTotal} {t.disponiveis}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div
                    className="bg-[#4A9DB5] h-2 rounded-full"
                    style={{ width: `${(opp.vagasPreenchidas / opp.vagasTotal) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <h2 className="text-2xl mb-4 text-gray-900">{t.sobreOportunidade}</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{opp.descricao}</p>
            </div>

            {/* Localização Completa */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-[#4A9DB5] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📍</span>
                </div>
                <div>
                  <h3 className="text-lg mb-2 text-gray-900">{t.localizacao}</h3>
                  <p className="text-gray-700 mb-1">{opp.location}</p>
                  <p className="text-sm text-gray-600">
                    {t.enderecoDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Galeria de Imagens */}
            <div>
              <h2 className="text-2xl mb-4 text-gray-900">{t.fotosProjeto}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <img src={opp.image} alt="Foto 1" className="w-full h-48 object-cover rounded-lg" />
                <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop" alt="Foto 2" className="w-full h-48 object-cover rounded-lg" />
                <img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&auto=format&fit=crop" alt="Foto 3" className="w-full h-48 object-cover rounded-lg" />
              </div>
            </div>

            {/* Requisitos e Benefícios */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl mb-4 text-gray-900">{t.requisitos}</h2>
                <ul className="space-y-3">
                  {opp.requisitos.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-600">
                      <div className="w-6 h-6 bg-[#4A9DB5]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="text-[#4A9DB5] text-sm">✓</div>
                      </div>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl mb-4 text-gray-900">{t.beneficios}</h2>
                <ul className="space-y-3">
                  {opp.beneficios.map((ben, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-600">
                      <div className="w-6 h-6 bg-[#FFD500]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="text-sm">🎁</div>
                      </div>
                      {ben}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar - Formulário de Inscrição */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gray-50 p-8 rounded-2xl border border-gray-200">
              <h2 className="text-2xl mb-6 text-gray-900">{t.inscrevaSe}</h2>

              <form onSubmit={handleInscricao} className="space-y-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-700">{t.motivacaoLabel}</label>
                  <textarea
                    required
                    value={inscricaoData.motivacao}
                    onChange={(e) => setInscricaoData({...inscricaoData, motivacao: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent resize-none"
                    rows={4}
                    placeholder={t.motivacaoPlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">{t.disponibilidadeLabel}</label>
                  <select
                    required
                    value={inscricaoData.disponibilidade}
                    onChange={(e) => setInscricaoData({...inscricaoData, disponibilidade: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                  >
                    <option value="">{t.selecione}</option>
                    <option value="total">{t.dispTotal}</option>
                    <option value="parcial">{t.dispParcial}</option>
                    <option value="flexivel">{t.dispFlexivel}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">{t.experienciaLabel}</label>
                  <textarea
                    value={inscricaoData.experiencia}
                    onChange={(e) => setInscricaoData({...inscricaoData, experiencia: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent resize-none"
                    rows={3}
                    placeholder={t.experienciaPlaceholder}
                  />
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm mb-2 text-gray-900">{t.infoContato}</h3>
                  <p className="text-sm text-gray-600">
                    <strong>{opp.organizacao}</strong><br/>
                    📧 {opp.contato}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FFD500] hover:bg-[#FFC700] text-gray-900 py-4 rounded-full text-lg transition-colors"
                >
                  {t.enviarInscricao}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  {t.termosUso}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

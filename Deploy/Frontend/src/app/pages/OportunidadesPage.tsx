import { useMemo, useState } from 'react';
import { Calendar } from 'lucide-react';
import { ptBR } from '../locales/pt-BR';
import { OportunidadeCard } from '../services/oportunidadeService';

interface OportunidadesPageProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  openOportunidade: (id: number) => void;
  opportunities: OportunidadeCard[];
}

export function OportunidadesPage({
  selectedCategory,
  setSelectedCategory,
  openOportunidade,
  opportunities
}: OportunidadesPageProps) {
  const t = ptBR.oportunidadesPage;
  const [searchQuery, setSearchQuery] = useState('');

  const uniqueCategories = useMemo(() => {
    const cats = Array.from(new Set(opportunities.map(o => o.category).filter(Boolean)));
    return ['Todas', ...cats.sort()];
  }, [opportunities]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Oportunidades */}
      <section className="bg-gradient-to-r from-[#4A9DB5] to-[#5BACBD] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl mb-4">{t.titulo}</h1>
          <p className="text-lg text-white/90 max-w-2xl">
            {t.subtitulo}
          </p>
        </div>
      </section>

      {/* Filtros e Busca */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder={t.buscarPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            {uniqueCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#4A9DB5] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lista de Oportunidades */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 text-gray-600">
            {opportunities.filter((opp) => {
              const matchesCategory = selectedCategory === 'Todas' || opp.category === selectedCategory;
              const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                    (opp.descricao && opp.descricao.toLowerCase().includes(searchQuery.toLowerCase()));
              return matchesCategory && matchesSearch;
            }).length} {t.encontradas}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities
              .filter((opp) => {
                const matchesCategory = selectedCategory === 'Todas' || opp.category === selectedCategory;
                const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                      (opp.descricao && opp.descricao.toLowerCase().includes(searchQuery.toLowerCase()));
                return matchesCategory && matchesSearch;
              })
              .map((opp) => {
                const isEncerrada = opp.status?.toLowerCase() === 'encerrada';
                return (
                <div key={opp.id} className={`flex flex-col h-full bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all relative ${isEncerrada ? 'opacity-75 grayscale-[50%]' : ''}`}>
                  <div className="h-48 overflow-hidden relative shrink-0">
                    {isEncerrada && (
                      <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-4 py-1.5 rounded-full font-medium text-sm">
                          Oportunidade Encerrada
                        </span>
                      </div>
                    )}
                    <img
                      src={opp.image}
                      alt={opp.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-sm px-3 py-1 rounded-full ${isEncerrada ? 'bg-gray-200 text-gray-600' : 'bg-[#4A9DB5]/10 text-[#4A9DB5]'}`}>
                        {opp.category}
                      </span>
                      <span className="text-sm text-gray-500">{isEncerrada ? 'Vagas Esgotadas' : opp.vagas}</span>
                    </div>
                    
                    {/* Fixed title height to max 2 lines and line-clamp */}
                    <h3 className="text-xl mb-3 text-gray-900 line-clamp-2 min-h-[3.5rem]">{opp.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{opp.descricao}</p>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                        {opp.location === 'Remoto - ND' || opp.location === 'Remoto' ? 'Atividade Remota (Online)' : opp.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span className="truncate">{opp.time}</span>
                      </div>
                      {opp.dataFimInscricoes && (
                        <div className="flex items-center gap-2 text-orange-600 font-medium">
                          <Calendar className="w-4 h-4 shrink-0" />
                          <span className="truncate">Inscrições até {new Date(opp.dataFimInscricoes).toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-auto">
                      {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{opp.vagasPreenchidas} {t.voluntarios}</span>
                        <span>{opp.vagasTotal} {t.vagas}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#4A9DB5] h-2 rounded-full"
                          style={{ width: `${(opp.vagasPreenchidas / opp.vagasTotal) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <button
                      onClick={() => !isEncerrada && openOportunidade(opp.id)}
                      disabled={isEncerrada}
                      className={`w-full py-2.5 rounded-full transition-colors text-sm ${
                        isEncerrada 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-[#FFD500] hover:bg-[#FFC700] text-gray-900'
                      }`}
                    >
                      {isEncerrada ? 'Oportunidade Encerrada' : t.verDetalhes}
                    </button>
                    </div>
                  </div>
                </div>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
}

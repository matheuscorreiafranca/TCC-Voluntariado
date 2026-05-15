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
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
            />
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent">
              <option>{t.todasCidades}</option>
              <option>São Paulo - SP</option>
              <option>Rio de Janeiro - RJ</option>
              <option>Belo Horizonte - MG</option>
              <option>Curitiba - PR</option>
              <option>Salvador - BA</option>
              <option>Recife - PE</option>
              <option>Brasília - DF</option>
            </select>
            <button className="bg-[#4A9DB5] hover:bg-[#3D8CA3] text-white px-8 py-3 rounded-lg transition-colors">
              {t.buscar}
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            {['Todas', 'Educação', 'Assistência Social', 'Cultura', 'Tecnologia', 'Eventos', 'Desenvolvimento Pessoal'].map((category) => (
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
            {opportunities.filter((opp) => selectedCategory === 'Todas' || opp.category === selectedCategory).length} {t.encontradas}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities
              .filter((opp) => selectedCategory === 'Todas' || opp.category === selectedCategory)
              .map((opp) => (
                <div key={opp.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={opp.image}
                      alt={opp.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-[#4A9DB5] bg-[#4A9DB5]/10 px-3 py-1 rounded-full">
                        {opp.category}
                      </span>
                      <span className="text-sm text-gray-500">{opp.vagas}</span>
                    </div>
                    <h3 className="text-xl mb-3 text-gray-900">{opp.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{opp.descricao}</p>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                        {opp.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {opp.time}
                      </div>
                    </div>

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
                      onClick={() => openOportunidade(opp.id)}
                      className="w-full bg-[#FFD500] hover:bg-[#FFC700] text-gray-900 py-2.5 rounded-full transition-colors text-sm"
                    >
                      {t.verDetalhes}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}

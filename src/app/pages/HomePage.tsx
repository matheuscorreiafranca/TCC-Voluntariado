import { ChevronDown, Heart, Users, Award, Calendar } from 'lucide-react';
import logoInstituto from '../../assets/images/logoInstituto.png';
import logoIfsp from '../../assets/images/ifsp_primary.png';
import logoCacuin from '../../assets/images/cacuin_primary.svg';
import { ptBR } from '../locales/pt-BR';
import { OportunidadeCard } from '../services/oportunidadeService';

interface HomePageProps {
  setShowCadastro: (show: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  openOportunidade: (id: number) => void;
  setCurrentPage: (page: 'home' | 'oportunidades' | 'detalhes' | 'painel' | 'painel-org' | 'painel-admin') => void;
  opportunities: OportunidadeCard[];
}

export function HomePage({
  setShowCadastro,
  selectedCategory,
  setSelectedCategory,
  openOportunidade,
  setCurrentPage,
  opportunities
}: HomePageProps) {
  const t = ptBR.homePage;

  return (
    <>
      {/* Hero Section */}
      <section id="inicio" className="relative bg-gradient-to-r from-blue-600/90 via-purple-600/80 to-blue-700/90 text-white py-32 lg:py-40">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1600&auto=format&fit=crop"
            alt="Background"
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex flex-col items-center justify-center mb-8">
              <img src={logoInstituto} alt="Instituto Victor Gabriel" className="h-20 md:h-24 brightness-0 invert drop-shadow-lg mb-8" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 uppercase">
              {t.heroTitulo}
            </h1>
            <p className="text-lg md:text-xl mb-4 text-white/95 max-w-2xl mx-auto">
              {t.heroSubtitulo1}
            </p>
            <p className="text-base mb-8 text-white/90 max-w-2xl mx-auto">
              {t.heroSubtitulo2}<span className="font-semibold">Instituto Victor Gabriel</span>{t.heroSubtitulo3}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowCadastro(true)}
                className="bg-[#FFD500] hover:bg-[#FFC700] text-gray-900 px-10 py-4 rounded-full text-lg transition-colors"
              >
                {t.cadastreSeAgora}
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white opacity-80" />
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl mb-2 text-[#4A9DB5]">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Impact Areas Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">{t.areasAtuacao}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t.areasAtuacaoSub}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#4A9DB5] rounded-full flex items-center justify-center mb-6 mx-auto">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900 text-center">{t.educacaoCultura}</h3>
              <p className="text-gray-600 text-center">
                {t.educacaoCulturaDesc}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#4A9DB5] rounded-full flex items-center justify-center mb-6 mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900 text-center">{t.desenvolvimentoPessoal}</h3>
              <p className="text-gray-600 text-center">
                {t.desenvolvimentoPessoalDesc}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#4A9DB5] rounded-full flex items-center justify-center mb-6 mx-auto">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900 text-center">{t.assistenciaSocial}</h3>
              <p className="text-gray-600 text-center">
                {t.assistenciaSocialDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaign */}
      <section className="py-16 bg-gradient-to-r from-[#4A9DB5] to-[#5BACBD] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block bg-[#FFD500] text-gray-900 px-4 py-1.5 rounded-full text-sm mb-4">
                {t.campanhaDestaqueBadge}
              </div>
              <h2 className="text-3xl md:text-4xl mb-4">
                {t.campanhaDestaqueTitulo}
              </h2>
              <p className="text-white/90 mb-6 text-lg">
                {t.campanhaDestaqueDesc}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowCadastro(true)}
                  className="bg-[#FFD500] hover:bg-[#FFC700] text-gray-900 px-8 py-3 rounded-full transition-colors"
                >
                  {t.participarCampanha}
                </button>
                <button className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-full transition-colors">
                  {t.saibaMais}
                </button>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl mb-2 text-[#FFD500]">350</div>
                  <div className="text-sm text-white/80">{t.voluntariosAtivos}</div>
                </div>
                <div>
                  <div className="text-4xl mb-2 text-[#FFD500]">150</div>
                  <div className="text-sm text-white/80">{t.vagasRestantes}</div>
                </div>
                <div>
                  <div className="text-4xl mb-2 text-[#FFD500]">70%</div>
                  <div className="text-sm text-white/80">{t.daMeta}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section id="oportunidades" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">{t.oportunidadesTitulo}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t.oportunidadesSub}
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['Todas', 'Educação', 'Assistência Social', 'Cultura', 'Tecnologia', 'Eventos'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full transition-colors ${selectedCategory === category
                  ? 'bg-[#4A9DB5] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {opportunities
              .filter((opp) => selectedCategory === 'Todas' || opp.category === selectedCategory)
              .map((opp, index) => (
                <div
                  key={index}
                  onClick={() => openOportunidade(opp.id)}
                  className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={opp.image}
                      alt={opp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 flex flex-col h-full">
                    <div className="text-sm text-[#4A9DB5] mb-2">{opp.category}</div>
                    <h3 className="text-lg mb-3 text-gray-900 h-14 line-clamp-2">{opp.title}</h3>
                    <div className="space-y-2 text-sm text-gray-600 mb-4 flex-grow">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                        {opp.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {opp.time}
                      </div>
                      <div className="flex items-center gap-2 text-[#4A9DB5]">
                        <Users className="w-4 h-4" />
                        {opp.vagas}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openOportunidade(opp.id);
                      }}
                      className="w-full bg-[#FFD500] hover:bg-[#FFC700] text-gray-900 py-2.5 rounded-full transition-colors mt-auto"
                    >
                      {t.verDetalhes}
                    </button>
                  </div>
                </div>
              ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => {
                setSelectedCategory('Todas');
                setCurrentPage('oportunidades');
                window.scrollTo(0, 0);
              }}
              className="bg-[#FFD500] hover:bg-[#FFC700] text-gray-900 px-8 py-3 rounded-full transition-colors"
            >
              {t.verTodasOportunidades}
            </button>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">{t.comoFunciona}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t.comoFuncionaSub}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#4A9DB5] text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl mb-3 text-gray-900">{t.passo1Titulo}</h3>
              <p className="text-gray-600">
                {t.passo1Desc}
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#4A9DB5] text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl mb-3 text-gray-900">{t.passo2Titulo}</h3>
              <p className="text-gray-600">
                {t.passo2Desc}
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#4A9DB5] text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl mb-3 text-gray-900">{t.passo3Titulo}</h3>
              <p className="text-gray-600">
                {t.passo3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">{t.valoresTitulo}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t.valoresSub}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="text-4xl mb-3">💙</div>
              <h3 className="text-lg mb-2 text-gray-900">{t.valorEmpatia}</h3>
              <p className="text-sm text-gray-600">{t.valorEmpatiaDesc}</p>
            </div>

            <div className="bg-white p-6 rounded-lg text-center">
              <div className="text-4xl mb-3">🌟</div>
              <h3 className="text-lg mb-2 text-gray-900">{t.valorTransformacao}</h3>
              <p className="text-sm text-gray-600">{t.valorTransformacaoDesc}</p>
            </div>

            <div className="bg-white p-6 rounded-lg text-center">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="text-lg mb-2 text-gray-900">{t.valorColaboracao}</h3>
              <p className="text-sm text-gray-600">{t.valorColaboracaoDesc}</p>
            </div>

            <div className="bg-white p-6 rounded-lg text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-lg mb-2 text-gray-900">{t.valorImpacto}</h3>
              <p className="text-sm text-gray-600">{t.valorImpactoDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Institute Section */}
      <section id="instituto" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <img src={logoInstituto} alt="Instituto Victor Gabriel" className="h-16 mb-6" />
              <h2 className="text-3xl md:text-4xl mb-6 text-gray-900">
                {t.institutoTitulo}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t.institutoP1}
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {t.institutoP2}
              </p>
              <a
                href="https://institutovictorgabriel.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#FFD500] hover:bg-[#FFC700] text-gray-900 px-8 py-3 rounded-full transition-colors"
              >
                {t.conhecaInstituto}
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://institutovictorgabriel.com.br/wp-content/uploads/2024/04/WhatsApp-Image-2024-04-02-at-11.25.21-AM-300x294.webp"
                alt="Atividade 1"
                className="rounded-lg w-full h-48 object-cover"
              />
              <img
                src="https://institutovictorgabriel.com.br/wp-content/uploads/2024/04/436926720_7596210317068777_5318676563486284836_n.jpg"
                alt="Atividade 2"
                className="rounded-lg w-full h-48 object-cover"
              />
              <img
                src="https://institutovictorgabriel.com.br/wp-content/uploads/2024/02/1707779795030.webp"
                alt="Atividade 3"
                className="rounded-lg w-full h-48 object-cover"
              />
              <img
                src="https://institutovictorgabriel.com.br/wp-content/uploads/2024/02/ivg-8.webp"
                alt="Atividade 4"
                className="rounded-lg w-full h-48 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl mb-3 text-gray-900">{t.parceirasTitulo}</h2>
            <p className="text-gray-600">
              {t.parceirasSub}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
            <div className="bg-white p-6 rounded-lg flex items-center justify-center h-24 border border-gray-200 w-full max-w-[250px]">
              <img
                src={logoIfsp}
                alt="IFSP"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="bg-white p-6 rounded-lg flex items-center justify-center h-24 border border-gray-200 w-full max-w-[250px]">
              <img
                src={logoCacuin}
                alt="Cacuin"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#4ECDC4] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl mb-6">
            {t.ctaTitulo}
          </h2>
          <p className="text-lg mb-8 text-white/95">
            {t.ctaSub}
          </p>
          <button
            onClick={() => setShowCadastro(true)}
            className="bg-[#FFD500] hover:bg-[#FFC700] text-gray-900 px-10 py-4 rounded-full text-lg transition-colors"
          >
            {t.cadastreGratuitamente}
          </button>
        </div>
      </section>
    </>
  );
}

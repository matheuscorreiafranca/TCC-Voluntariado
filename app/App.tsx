import { Heart, Users, Calendar, Award, ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [showCadastro, setShowCadastro] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showCertificados, setShowCertificados] = useState(false);
  const [showCalendario, setShowCalendario] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    horasVoluntarias: 0,
    inscricoes: [] as number[]
  });
  const [currentPage, setCurrentPage] = useState<'home' | 'oportunidades' | 'detalhes' | 'painel'>('home');
  const [selectedOportunidade, setSelectedOportunidade] = useState<number | null>(null);
  const [inscricaoData, setInscricaoData] = useState({
    motivacao: '',
    disponibilidade: '',
    experiencia: ''
  });
  const [loginData, setLoginData] = useState({
    email: '',
    senha: ''
  });
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    cpf: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    ocupacao: '',
    afinidades: [] as string[],
    raca: '',
    genero: '',
    aceitaTermos: false
  });

  const opportunities = [
    {
      id: 1,
      title: 'Aulas de Reforço Escolar',
      category: 'Educação',
      location: 'São Paulo - SP',
      time: 'Sábados, 14h-17h',
      vagas: '5 vagas',
      vagasTotal: 10,
      vagasPreenchidas: 5,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop',
      descricao: 'Ajude crianças do ensino fundamental com reforço escolar em matemática e português. Voluntários darão suporte individualizado para alunos com dificuldades de aprendizagem.',
      requisitos: ['Ensino médio completo', 'Paciência com crianças', 'Conhecimento em matemática básica'],
      beneficios: ['Certificado de horas voluntárias', 'Treinamento inicial', 'Material didático fornecido'],
      organizacao: 'ONG Educar para Crescer',
      contato: 'contato@educar.org.br'
    },
    {
      id: 2,
      title: 'Apoio em Atividades Recreativas',
      category: 'Educação',
      location: 'São Paulo - SP',
      time: 'Terças e Quintas, 15h-18h',
      vagas: '3 vagas',
      vagasTotal: 8,
      vagasPreenchidas: 5,
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop',
      descricao: 'Organize e conduza atividades recreativas e esportivas para crianças de 6 a 12 anos em comunidade carente.',
      requisitos: ['Maior de 18 anos', 'Disponibilidade para 2 dias por semana', 'Criatividade'],
      beneficios: ['Certificado de participação', 'Seguro contra acidentes', 'Alimentação no local'],
      organizacao: 'Projeto Infância Feliz',
      contato: 'voluntarios@infanciafeliz.org.br'
    },
    {
      id: 3,
      title: 'Mentoria para Jovens',
      category: 'Desenvolvimento Pessoal',
      location: 'Rio de Janeiro - RJ',
      time: 'Flexível',
      vagas: '8 vagas',
      vagasTotal: 20,
      vagasPreenchidas: 12,
      image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&auto=format&fit=crop',
      descricao: 'Seja mentor de jovens de 15 a 21 anos, ajudando no desenvolvimento pessoal, profissional e na preparação para o mercado de trabalho.',
      requisitos: ['Experiência profissional de 5+ anos', 'Disponibilidade de 2h semanais', 'Habilidades de comunicação'],
      beneficios: ['Certificado digital', 'Acesso a plataforma de mentoria', 'Network com outros mentores'],
      organizacao: 'Instituto Jovem Futuro',
      contato: 'mentoria@jovemfuturo.org.br'
    },
    {
      id: 4,
      title: 'Distribuição de Alimentos',
      category: 'Assistência Social',
      location: 'Belo Horizonte - MG',
      time: 'Sextas, 18h-21h',
      vagas: '10 vagas',
      vagasTotal: 15,
      vagasPreenchidas: 5,
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop',
      descricao: 'Participe da distribuição semanal de cestas básicas e refeições para famílias em situação de vulnerabilidade social.',
      requisitos: ['Maior de 16 anos', 'Disponibilidade às sextas-feiras', 'Disposição física'],
      beneficios: ['Certificado de horas', 'Lanche no local', 'Transporte fornecido'],
      organizacao: 'Banco de Alimentos BH',
      contato: 'voluntarios@bancodealimentos.org.br'
    },
    {
      id: 5,
      title: 'Oficinas de Arte e Cultura',
      category: 'Cultura',
      location: 'Curitiba - PR',
      time: 'Sábados, 10h-13h',
      vagas: '4 vagas',
      vagasTotal: 6,
      vagasPreenchidas: 2,
      image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&auto=format&fit=crop',
      descricao: 'Ensine música, dança, pintura ou teatro para crianças e adolescentes. Compartilhe seu talento artístico!',
      requisitos: ['Habilidade em alguma arte', 'Experiência com ensino (preferencial)', 'Paciência'],
      beneficios: ['Certificado', 'Material artístico fornecido', 'Espaço equipado'],
      organizacao: 'Casa da Cultura Popular',
      contato: 'cultura@casacultura.org.br'
    },
    {
      id: 6,
      title: 'Apoio em Eventos Comunitários',
      category: 'Eventos',
      location: 'Salvador - BA',
      time: 'Conforme demanda',
      vagas: '15 vagas',
      vagasTotal: 25,
      vagasPreenchidas: 10,
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop',
      descricao: 'Ajude na organização e execução de eventos sociais, culturais e educativos realizados na comunidade.',
      requisitos: ['Maior de 18 anos', 'Flexibilidade de horários', 'Trabalho em equipe'],
      beneficios: ['Certificado por evento', 'Alimentação', 'Experiência em gestão de eventos'],
      organizacao: 'Coletivo Comunidade Ativa',
      contato: 'eventos@comunidadeativa.org.br'
    },
    {
      id: 7,
      title: 'Acompanhamento Escolar',
      category: 'Educação',
      location: 'Recife - PE',
      time: 'Quartas, 14h-17h',
      vagas: '6 vagas',
      vagasTotal: 10,
      vagasPreenchidas: 4,
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&auto=format&fit=crop',
      descricao: 'Acompanhe estudantes do ensino médio em suas atividades escolares, auxiliando no planejamento e organização dos estudos.',
      requisitos: ['Cursando ou formado em licenciatura', 'Conhecimento pedagógico', 'Compromisso semanal'],
      beneficios: ['Certificado', 'Curso de capacitação', 'Material de apoio'],
      organizacao: 'Programa Educação para Todos',
      contato: 'acompanhamento@educacaotodos.org.br'
    },
    {
      id: 8,
      title: 'Apoio Digital e Tecnologia',
      category: 'Tecnologia',
      location: 'Brasília - DF',
      time: 'Flexível - Remoto',
      vagas: '12 vagas',
      vagasTotal: 20,
      vagasPreenchidas: 8,
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop',
      descricao: 'Ensine informática básica, programação ou uso de ferramentas digitais para jovens e adultos em inclusão digital.',
      requisitos: ['Conhecimento em tecnologia', 'Computador e internet', 'Disponibilidade remota'],
      beneficios: ['Totalmente remoto', 'Certificado digital', 'Flexibilidade de horários'],
      organizacao: 'Tech para Todos',
      contato: 'tech@techparatodos.org.br'
    }
  ];

  const stats = [
    { number: '5.000+', label: 'Voluntários cadastrados' },
    { number: '300+', label: 'Projetos ativos' },
    { number: '50+', label: 'Cidades atendidas' },
    { number: '100K+', label: 'Vidas transformadas' }
  ];

  const certificados = [
    { id: 1, titulo: 'Alfabetização 2025', horas: 20, data: '2025-03-15', organizacao: 'ONG Educar para Crescer' },
    { id: 2, titulo: 'Apoio Digital', horas: 25, data: '2025-02-20', organizacao: 'Tech para Todos' },
    { id: 3, titulo: 'Distribuição de Alimentos', horas: 15, data: '2024-12-10', organizacao: 'Banco de Alimentos' },
    { id: 4, titulo: 'Oficinas de Arte', horas: 30, data: '2024-11-05', organizacao: 'Casa da Cultura' },
    { id: 5, titulo: 'Mentoria Jovens', horas: 40, data: '2024-10-18', organizacao: 'Instituto Jovem Futuro' }
  ];

  const proximasAtividades = [
    { id: 1, titulo: 'Aulas de Reforço', data: '2026-05-15', hora: '14h-17h', local: 'São Paulo - SP' },
    { id: 2, titulo: 'Oficinas de Arte', data: '2026-05-18', hora: '10h-13h', local: 'Curitiba - PR' },
    { id: 3, titulo: 'Mentoria para Jovens', data: '2026-05-20', hora: '15h-17h', local: 'Rio de Janeiro - RJ' },
    { id: 4, titulo: 'Apoio Digital', data: '2026-05-22', hora: 'Flexível', local: 'Remoto' },
    { id: 5, titulo: 'Aulas de Reforço', data: '2026-05-25', hora: '14h-17h', local: 'São Paulo - SP' },
    { id: 6, titulo: 'Distribuição de Alimentos', data: '2026-05-27', hora: '18h-21h', local: 'Belo Horizonte - MG' }
  ];

  const handleSubmitCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados do cadastro:', formData);
    alert('Cadastro realizado com sucesso! (mock)');
    setShowCadastro(false);
    setFormData({
      nomeCompleto: '',
      cpf: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      ocupacao: '',
      afinidades: [],
      raca: '',
      genero: '',
      aceitaTermos: false
    });
  };

  const toggleAfinidade = (afinidade: string) => {
    setFormData(prev => ({
      ...prev,
      afinidades: prev.afinidades.includes(afinidade)
        ? prev.afinidades.filter(a => a !== afinidade)
        : [...prev.afinidades, afinidade]
    }));
  };

  const handleInscricao = (e: React.FormEvent) => {
    e.preventDefault();
    const opp = opportunities.find(o => o.id === selectedOportunidade);
    console.log('Inscrição enviada:', { oportunidade: opp?.title, ...inscricaoData });
    alert('Inscrição enviada com sucesso! Entraremos em contato em breve.');
    setInscricaoData({ motivacao: '', disponibilidade: '', experiencia: '' });
    setCurrentPage('home');
    setSelectedOportunidade(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', loginData);

    // Mock login - simula usuário logado
    setIsLoggedIn(true);
    setUserData({
      nome: 'Maria Silva',
      email: loginData.email,
      horasVoluntarias: 45,
      inscricoes: [1, 3, 5] // IDs das oportunidades que o usuário se inscreveu
    });

    setShowLogin(false);
    setLoginData({ email: '', senha: '' });
    setCurrentPage('painel');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData({
      nome: '',
      email: '',
      horasVoluntarias: 0,
      inscricoes: []
    });
    setCurrentPage('home');
  };

  const openOportunidade = (id: number) => {
    setSelectedOportunidade(id);
    setCurrentPage('detalhes');
    window.scrollTo(0, 0);
  };

  return (
    <div className="size-full bg-white overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <img src="../imports/image-1.png" alt="VoluntaMais" className="h-12" />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => setCurrentPage('home')}
                className="text-gray-700 hover:text-[#4A9DB5] transition-colors"
              >
                Início
              </button>
              <button
                onClick={() => setCurrentPage('oportunidades')}
                className="text-gray-700 hover:text-[#4A9DB5] transition-colors"
              >
                Oportunidades
              </button>
              <button
                onClick={() => {
                  setCurrentPage('home');
                  setTimeout(() => {
                    document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-gray-700 hover:text-[#4A9DB5] transition-colors"
              >
                Como Funciona
              </button>
              <button
                onClick={() => {
                  setCurrentPage('home');
                  setTimeout(() => {
                    document.getElementById('instituto')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-gray-700 hover:text-[#4A9DB5] transition-colors"
              >
                Instituto
              </button>

              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setCurrentPage('painel')}
                    className="text-gray-700 hover:text-[#4A9DB5] transition-colors"
                  >
                    Meu Painel
                  </button>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700 text-sm">Olá, {userData.nome.split(' ')[0]}</span>
                    <button
                      onClick={handleLogout}
                      className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
                    >
                      Sair
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="text-gray-700 hover:text-[#4A9DB5] transition-colors"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => setShowCadastro(true)}
                    className="bg-[#FFD500] hover:bg-[#FFC700] text-gray-900 px-6 py-2.5 rounded-full transition-colors"
                  >
                    Quero Ser Voluntário
                  </button>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {menuOpen && (
            <nav className="md:hidden pb-4 flex flex-col gap-4">
              <button
                onClick={() => { setCurrentPage('home'); setMenuOpen(false); }}
                className="text-gray-700 hover:text-[#4A9DB5] transition-colors text-left"
              >
                Início
              </button>
              <button
                onClick={() => { setCurrentPage('oportunidades'); setMenuOpen(false); }}
                className="text-gray-700 hover:text-[#4A9DB5] transition-colors text-left"
              >
                Oportunidades
              </button>
              <button
                onClick={() => {
                  setCurrentPage('home');
                  setMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-gray-700 hover:text-[#4A9DB5] transition-colors text-left"
              >
                Como Funciona
              </button>
              <button
                onClick={() => {
                  setCurrentPage('home');
                  setMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('instituto')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-gray-700 hover:text-[#4A9DB5] transition-colors text-left"
              >
                Instituto
              </button>

              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => { setCurrentPage('painel'); setMenuOpen(false); }}
                    className="text-gray-700 hover:text-[#4A9DB5] transition-colors text-left"
                  >
                    Meu Painel
                  </button>
                  <div className="text-gray-700 text-sm">Olá, {userData.nome.split(' ')[0]}</div>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="text-gray-500 hover:text-gray-700 transition-colors text-left text-sm"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setShowLogin(true); setMenuOpen(false); }}
                    className="text-gray-700 hover:text-[#4A9DB5] transition-colors text-left"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => { setShowCadastro(true); setMenuOpen(false); }}
                    className="bg-[#FFD500] hover:bg-[#FFC700] text-gray-900 px-6 py-2.5 rounded-full transition-colors"
                  >
                    Quero Ser Voluntário
                  </button>
                </>
              )}
            </nav>
          )}
        </div>
      </header>

      {currentPage === 'home' ? (
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
            <div className="flex flex-col items-center justify-center gap-4 mb-8">
              <img src="../imports/image-2.png" alt="Instituto Victor Gabriel" className="h-20 md:h-24 brightness-0 invert drop-shadow-lg" />
              <span className="text-white text-xl md:text-2xl font-light tracking-wide">apresenta</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">
              Transforme vidas através do voluntariado
            </h1>
            <p className="text-lg md:text-xl mb-4 text-white/95 max-w-2xl mx-auto">
              Conectamos pessoas que desejam fazer a diferença com projetos sociais que precisam de apoio.
            </p>
            <p className="text-base mb-8 text-white/90 max-w-2xl mx-auto">
              Uma iniciativa do <span className="font-semibold">Instituto Victor Gabriel</span> para mudar o Brasil através de jovens e adultos que são agentes de transformação em suas famílias e comunidades.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowCadastro(true)}
                className="bg-[#FFD500] hover:bg-[#FFC700] text-gray-900 px-10 py-4 rounded-full text-lg transition-colors"
              >
                Cadastre-se Agora
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl mb-2 text-[#4A9DB5]">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Areas Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">Nossas áreas de atuação</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Transformando vidas através de diferentes frentes sociais
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#4A9DB5] rounded-full flex items-center justify-center mb-6 mx-auto">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900 text-center">Educação e Cultura</h3>
              <p className="text-gray-600 text-center">
                Promovemos educação de qualidade, reforço escolar e atividades culturais que desenvolvem crianças e jovens.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#4A9DB5] rounded-full flex items-center justify-center mb-6 mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900 text-center">Desenvolvimento pessoal</h3>
              <p className="text-gray-600 text-center">
                Apoiamos jovens e adultos a se tornarem agentes de mudança através de mentoria e capacitação.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#4A9DB5] rounded-full flex items-center justify-center mb-6 mx-auto">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900 text-center">Assistência social</h3>
              <p className="text-gray-600 text-center">
                Oferecemos suporte direto às comunidades através de distribuição de alimentos e apoio emergencial.
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
                🔥 Campanha em destaque
              </div>
              <h2 className="text-3xl md:text-4xl mb-4">
                Mutirão de Alfabetização 2026
              </h2>
              <p className="text-white/90 mb-6 text-lg">
                Junte-se a nós em uma grande mobilização para alfabetizar crianças e adultos em comunidades carentes.
                Meta: 500 voluntários até junho!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowCadastro(true)}
                  className="bg-[#FFD500] hover:bg-[#FFC700] text-gray-900 px-8 py-3 rounded-full transition-colors"
                >
                  Participar da campanha
                </button>
                <button className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-full transition-colors">
                  Saiba mais
                </button>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl mb-2 text-[#FFD500]">350</div>
                  <div className="text-sm text-white/80">Voluntários ativos</div>
                </div>
                <div>
                  <div className="text-4xl mb-2 text-[#FFD500]">150</div>
                  <div className="text-sm text-white/80">Vagas restantes</div>
                </div>
                <div>
                  <div className="text-4xl mb-2 text-[#FFD500]">70%</div>
                  <div className="text-sm text-white/80">Da meta</div>
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
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">Oportunidades de voluntariado</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Encontre o projeto perfeito para você e comece a fazer a diferença hoje mesmo
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['Todas', 'Educação', 'Assistência Social', 'Cultura', 'Tecnologia', 'Eventos'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full transition-colors ${
                  selectedCategory === category
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
                    Ver detalhes
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
              Ver todas as oportunidades
            </button>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">Como funciona</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Em apenas 3 passos simples, você pode começar a transformar vidas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#4A9DB5] text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Cadastre-se</h3>
              <p className="text-gray-600">
                Crie sua conta gratuitamente e complete seu perfil com suas habilidades e interesses
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#4A9DB5] text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Escolha um projeto</h3>
              <p className="text-gray-600">
                Navegue pelas oportunidades disponíveis e encontre aquela que mais combina com você
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#4A9DB5] text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Faça a diferença</h3>
              <p className="text-gray-600">
                Participe das atividades e contribua para transformar vidas e comunidades
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">Nossos valores</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Os princípios que guiam nossa missão de transformar o Brasil
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="text-4xl mb-3">💙</div>
              <h3 className="text-lg mb-2 text-gray-900">Empatia</h3>
              <p className="text-sm text-gray-600">Colocamos o amor e a compaixão no centro de nossas ações</p>
            </div>

            <div className="bg-white p-6 rounded-lg text-center">
              <div className="text-4xl mb-3">🌟</div>
              <h3 className="text-lg mb-2 text-gray-900">Transformação</h3>
              <p className="text-sm text-gray-600">Acreditamos no poder de cada pessoa para mudar o mundo</p>
            </div>

            <div className="bg-white p-6 rounded-lg text-center">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="text-lg mb-2 text-gray-900">Colaboração</h3>
              <p className="text-sm text-gray-600">Juntos somos mais fortes e alcançamos mais</p>
            </div>

            <div className="bg-white p-6 rounded-lg text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-lg mb-2 text-gray-900">Impacto</h3>
              <p className="text-sm text-gray-600">Focamos em resultados reais que transformam vidas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Institute Section */}
      <section id="instituto" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <img src="../imports/image-2.png" alt="Instituto Victor Gabriel" className="h-16 mb-6" />
              <h2 className="text-3xl md:text-4xl mb-6 text-gray-900">
                Uma iniciativa do Instituto Victor Gabriel
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                O Instituto Victor Gabriel acredita que é possível mudar o Brasil através de Jovens e
                Adultos que são a transformação que queremos ver no mundo: são agentes de mudança que
                investem em suas famílias.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Desde 2021, trabalhamos para desenvolver pessoas, promover educação de qualidade e
                criar oportunidades que transformem comunidades inteiras.
              </p>
              <a
                href="https://institutovictorgabriel.org.br"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#FFD500] hover:bg-[#FFC700] text-gray-900 px-8 py-3 rounded-full transition-colors"
              >
                Conheça o Instituto
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&auto=format&fit=crop"
                alt="Atividade 1"
                className="rounded-lg w-full h-48 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop"
                alt="Atividade 2"
                className="rounded-lg w-full h-48 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop"
                alt="Atividade 3"
                className="rounded-lg w-full h-48 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&auto=format&fit=crop"
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
            <h2 className="text-2xl md:text-3xl mb-3 text-gray-900">Organizações parceiras</h2>
            <p className="text-gray-600">
              Trabalhamos junto com diversas instituições para ampliar nosso impacto
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="bg-white p-6 rounded-lg flex items-center justify-center h-24 border border-gray-200">
              <div className="text-gray-400 text-center text-sm">Organização 1</div>
            </div>
            <div className="bg-white p-6 rounded-lg flex items-center justify-center h-24 border border-gray-200">
              <div className="text-gray-400 text-center text-sm">Organização 2</div>
            </div>
            <div className="bg-white p-6 rounded-lg flex items-center justify-center h-24 border border-gray-200">
              <div className="text-gray-400 text-center text-sm">Organização 3</div>
            </div>
            <div className="bg-white p-6 rounded-lg flex items-center justify-center h-24 border border-gray-200">
              <div className="text-gray-400 text-center text-sm">Organização 4</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#4ECDC4] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl mb-6">
            Pronto para fazer a diferença?
          </h2>
          <p className="text-lg mb-8 text-white/95">
            Junte-se a milhares de voluntários que estão transformando o Brasil.
          </p>
          <button
            onClick={() => setShowCadastro(true)}
            className="bg-[#FFD500] hover:bg-[#FFC700] text-gray-900 px-10 py-4 rounded-full text-lg transition-colors"
          >
            Cadastre-se gratuitamente
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e3a8a] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src="../imports/image-1.png" alt="VoluntaMais" className="h-12 mb-4 brightness-0 invert" />
              <p className="text-white/80 text-sm mb-4">
                Uma iniciativa do Instituto Victor Gabriel para conectar voluntários e transformar vidas.
              </p>
              <img src="../imports/image-2.png" alt="Instituto Victor Gabriel" className="h-10 brightness-0 invert opacity-70" />
            </div>

            <div>
              <h3 className="mb-4">Navegação</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#inicio" className="hover:text-white transition-colors">Início</a></li>
                <li><a href="#oportunidades" className="hover:text-white transition-colors">Oportunidades</a></li>
                <li><a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a></li>
                <li><a href="#instituto" className="hover:text-white transition-colors">Instituto</a></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4">Para voluntários</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Como funciona</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cadastre-se</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4">Contato</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li>contato@voluntamais.org.br</li>
                <li>(11) 1234-5678</li>
                <li className="pt-4 flex gap-4">
                  <a href="#" className="hover:text-white transition-colors">Facebook</a>
                  <a href="#" className="hover:text-white transition-colors">Instagram</a>
                  <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center text-sm text-white/70">
            <p>© 2026 VoluntaMais - Instituto Victor Gabriel. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
      </>
      ) : currentPage === 'oportunidades' ? (
        /* Página de Oportunidades */
        <div className="min-h-screen bg-gray-50 pb-20">
          {/* Hero Oportunidades */}
          <section className="bg-gradient-to-r from-[#4A9DB5] to-[#5BACBD] text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl md:text-5xl mb-4">Oportunidades de Voluntariado</h1>
              <p className="text-lg text-white/90 max-w-2xl">
                Encontre a oportunidade perfeita para fazer a diferença. Explore, filtre e candidate-se!
              </p>
            </div>
          </section>

          {/* Filtros e Busca */}
          <section className="py-8 bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Buscar por palavra-chave..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                />
                <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent">
                  <option>Todas as cidades</option>
                  <option>São Paulo - SP</option>
                  <option>Rio de Janeiro - RJ</option>
                  <option>Belo Horizonte - MG</option>
                  <option>Curitiba - PR</option>
                  <option>Salvador - BA</option>
                  <option>Recife - PE</option>
                  <option>Brasília - DF</option>
                </select>
                <button className="bg-[#4A9DB5] hover:bg-[#3D8CA3] text-white px-8 py-3 rounded-lg transition-colors">
                  Buscar
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
                {opportunities.filter((opp) => selectedCategory === 'Todas' || opp.category === selectedCategory).length} oportunidades encontradas
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
                            <span>{opp.vagasPreenchidas} voluntários</span>
                            <span>{opp.vagasTotal} vagas</span>
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
                          Ver detalhes e candidatar
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        </div>
      ) : currentPage === 'painel' ? (
        /* Painel do Voluntário */
        <div className="min-h-screen bg-gray-50">
          {/* Hero do Painel */}
          <section className="bg-gradient-to-r from-[#4A9DB5] to-[#5BACBD] text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl md:text-4xl mb-2">Bem-vindo(a), {userData.nome}!</h1>
              <p className="text-white/90">Acompanhe suas atividades voluntárias</p>
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
                    <div className="text-sm text-gray-600">Horas voluntárias</div>
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
                    <div className="text-sm text-gray-600">Inscrições ativas</div>
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
                    <div className="text-sm text-gray-600">Certificados</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Minhas Inscrições */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl mb-6 text-gray-900">Minhas Inscrições</h2>

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
                                Ativa
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
                              Ver detalhes →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                  {userData.inscricoes.length === 0 && (
                    <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg text-gray-900 mb-2">Nenhuma inscrição ainda</h3>
                      <p className="text-gray-600 mb-4">Explore as oportunidades disponíveis e comece a fazer a diferença!</p>
                      <button
                        onClick={() => setCurrentPage('oportunidades')}
                        className="bg-[#FFD500] hover:bg-[#FFC700] text-gray-900 px-6 py-3 rounded-full transition-colors"
                      >
                        Ver oportunidades
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Perfil */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg mb-4 text-gray-900">Meu Perfil</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">Nome</div>
                      <div className="text-gray-900">{userData.nome}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">E-mail</div>
                      <div className="text-gray-900">{userData.email}</div>
                    </div>
                    <button className="w-full text-[#4A9DB5] hover:underline text-sm mt-4">
                      Editar perfil
                    </button>
                  </div>
                </div>

                {/* Certificados */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg mb-4 text-gray-900">Certificados</h3>
                  <div className="space-y-3">
                    {certificados.slice(0, 2).map(cert => (
                      <div key={cert.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Award className="w-5 h-5 text-[#FFD500]" />
                        <div className="flex-1">
                          <div className="text-sm text-gray-900">{cert.titulo}</div>
                          <div className="text-xs text-gray-500">{cert.horas} horas</div>
                        </div>
                        <button className="text-[#4A9DB5] hover:underline text-xs">
                          Baixar
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowCertificados(true)}
                    className="w-full mt-4 text-[#4A9DB5] hover:underline text-sm"
                  >
                    Ver mais certificados →
                  </button>
                </div>

                {/* Próximas Atividades */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg mb-4 text-gray-900">Próximas Atividades</h3>
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
                    Ver calendário completo →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : currentPage === 'detalhes' && selectedOportunidade ? (
        /* Página de Detalhes Completa (da página de Oportunidades) */
        (() => {
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
                      Voltar
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
                          <h3 className="text-lg text-gray-900">Horário</h3>
                        </div>
                        <p className="text-gray-600">{opp.time}</p>
                      </div>

                      <div className="bg-gray-50 p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <Users className="w-6 h-6 text-[#4A9DB5]" />
                          <h3 className="text-lg text-gray-900">Vagas</h3>
                        </div>
                        <p className="text-gray-600">{opp.vagasTotal - opp.vagasPreenchidas} de {opp.vagasTotal} disponíveis</p>
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
                      <h2 className="text-2xl mb-4 text-gray-900">Sobre a oportunidade</h2>
                      <p className="text-gray-600 leading-relaxed text-lg">{opp.descricao}</p>
                    </div>

                    {/* Localização Completa */}
                    <div className="bg-blue-50 p-6 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-[#4A9DB5] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">📍</span>
                        </div>
                        <div>
                          <h3 className="text-lg mb-2 text-gray-900">Localização</h3>
                          <p className="text-gray-700 mb-1">{opp.location}</p>
                          <p className="text-sm text-gray-600">
                            Endereço completo será fornecido após a confirmação da inscrição
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Galeria de Imagens */}
                    <div>
                      <h2 className="text-2xl mb-4 text-gray-900">Fotos do projeto</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <img src={opp.image} alt="Foto 1" className="w-full h-48 object-cover rounded-lg" />
                        <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop" alt="Foto 2" className="w-full h-48 object-cover rounded-lg" />
                        <img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&auto=format&fit=crop" alt="Foto 3" className="w-full h-48 object-cover rounded-lg" />
                      </div>
                    </div>

                    {/* Requisitos e Benefícios */}
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h2 className="text-2xl mb-4 text-gray-900">Requisitos</h2>
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
                        <h2 className="text-2xl mb-4 text-gray-900">Benefícios</h2>
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
                      <h2 className="text-2xl mb-6 text-gray-900">Inscreva-se</h2>

                      <form onSubmit={handleInscricao} className="space-y-4">
                        <div>
                          <label className="block text-sm mb-2 text-gray-700">Por que você quer participar? *</label>
                          <textarea
                            required
                            value={inscricaoData.motivacao}
                            onChange={(e) => setInscricaoData({...inscricaoData, motivacao: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent resize-none"
                            rows={4}
                            placeholder="Conte-nos sua motivação..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm mb-2 text-gray-700">Sua disponibilidade *</label>
                          <select
                            required
                            value={inscricaoData.disponibilidade}
                            onChange={(e) => setInscricaoData({...inscricaoData, disponibilidade: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                          >
                            <option value="">Selecione</option>
                            <option value="total">Total - posso no horário indicado</option>
                            <option value="parcial">Parcial - alguns horários</option>
                            <option value="flexivel">Flexível - posso ajustar</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm mb-2 text-gray-700">Experiência relacionada</label>
                          <textarea
                            value={inscricaoData.experiencia}
                            onChange={(e) => setInscricaoData({...inscricaoData, experiencia: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent resize-none"
                            rows={3}
                            placeholder="Experiências anteriores (opcional)"
                          />
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h3 className="text-sm mb-2 text-gray-900">Informações de contato</h3>
                          <p className="text-sm text-gray-600">
                            <strong>{opp.organizacao}</strong><br/>
                            📧 {opp.contato}
                          </p>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#FFD500] hover:bg-[#FFC700] text-gray-900 py-4 rounded-full text-lg transition-colors"
                        >
                          Enviar inscrição
                        </button>

                        <p className="text-xs text-gray-500 text-center">
                          Ao se inscrever, você concorda com nossos termos de uso
                        </p>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()
      ) : null}

      {/* Modal de Certificados */}
      {showCertificados && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full my-8 relative">
            <button
              onClick={() => setShowCertificados(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8">
              <h2 className="text-3xl mb-2 text-gray-900">Meus Certificados</h2>
              <p className="text-gray-600 mb-8">Total de {userData.horasVoluntarias} horas voluntárias certificadas</p>

              <div className="space-y-4">
                {certificados.map(cert => (
                  <div key={cert.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-[#FFD500]/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-8 h-8 text-[#FFD500]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg text-gray-900 mb-1">{cert.titulo}</h3>
                      <p className="text-sm text-gray-600">{cert.organizacao}</p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>{cert.horas} horas</span>
                        <span>•</span>
                        <span>{new Date(cert.data).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <button className="bg-[#4A9DB5] hover:bg-[#3D8CA3] text-white px-6 py-2.5 rounded-full transition-colors text-sm">
                      Baixar PDF
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowCertificados(false)}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-full hover:bg-gray-50 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Calendário */}
      {showCalendario && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full my-8 relative">
            <button
              onClick={() => setShowCalendario(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8">
              <h2 className="text-3xl mb-2 text-gray-900">Calendário de Atividades</h2>
              <p className="text-gray-600 mb-8">Suas próximas atividades voluntárias - Maio 2026</p>

              {/* Calendário Visual */}
              <div className="mb-8">
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
                    <div key={dia} className="text-center text-sm text-gray-600 py-2">
                      {dia}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {/* Dias vazios do início do mês */}
                  {[...Array(4)].map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square"></div>
                  ))}
                  {/* Dias do mês */}
                  {[...Array(31)].map((_, i) => {
                    const dia = i + 1;
                    const temAtividade = proximasAtividades.some(
                      ativ => new Date(ativ.data).getDate() === dia
                    );
                    return (
                      <div
                        key={dia}
                        className={`aspect-square flex items-center justify-center rounded-lg text-sm ${
                          temAtividade
                            ? 'bg-[#4A9DB5] text-white font-semibold'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        } transition-colors cursor-pointer`}
                      >
                        {dia}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lista de Atividades */}
              <h3 className="text-xl mb-4 text-gray-900">Todas as Atividades</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {proximasAtividades.map(ativ => {
                  const data = new Date(ativ.data);
                  return (
                    <div key={ativ.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center min-w-[60px]">
                        <div className="text-2xl text-[#4A9DB5]">{data.getDate()}</div>
                        <div className="text-xs text-gray-500">
                          {data.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 mb-1">{ativ.titulo}</h4>
                        <div className="flex gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {ativ.hora}
                          </span>
                          <span className="flex items-center gap-1">
                            📍 {ativ.local}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowCalendario(false)}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-full hover:bg-gray-50 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Login */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full relative">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8">
              <div className="text-center mb-8">
                <img src="../imports/image-1.png" alt="VoluntaMais" className="h-16 mx-auto mb-4" />
                <h2 className="text-3xl mb-2 text-gray-900">Entrar</h2>
                <p className="text-gray-600">Acesse sua conta de voluntário</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm mb-2 text-gray-700">E-mail ou CPF</label>
                  <input
                    type="text"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                    placeholder="seu@email.com ou 000.000.000-00"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Senha</label>
                  <input
                    type="password"
                    required
                    value={loginData.senha}
                    onChange={(e) => setLoginData({...loginData, senha: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                    placeholder="Digite sua senha"
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-[#4A9DB5] border-gray-300 rounded focus:ring-[#4A9DB5]" />
                    <span className="text-gray-600">Lembrar-me</span>
                  </label>
                  <a href="#" className="text-[#4A9DB5] hover:underline">Esqueci minha senha</a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#4A9DB5] hover:bg-[#3D8CA3] text-white py-3 rounded-full transition-colors"
                >
                  Entrar
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Ainda não tem conta?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setShowLogin(false);
                        setShowCadastro(true);
                      }}
                      className="text-[#4A9DB5] hover:underline"
                    >
                      Cadastre-se
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cadastro */}
      {showCadastro && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full my-8 relative">
            <button
              onClick={() => setShowCadastro(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl mb-2 text-gray-900">Cadastre-se como voluntário</h2>
                <p className="text-gray-600">Preencha os dados abaixo para começar sua jornada</p>
              </div>

              <form onSubmit={handleSubmitCadastro} className="space-y-6">
                {/* Nome Completo */}
                <div>
                  <label className="block text-sm mb-2 text-gray-700">Nome completo *</label>
                  <input
                    type="text"
                    required
                    value={formData.nomeCompleto}
                    onChange={(e) => setFormData({...formData, nomeCompleto: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                    placeholder="Digite seu nome completo"
                  />
                </div>

                {/* CPF */}
                <div>
                  <label className="block text-sm mb-2 text-gray-700">CPF *</label>
                  <input
                    type="text"
                    required
                    value={formData.cpf}
                    onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                </div>

                {/* E-mail */}
                <div>
                  <label className="block text-sm mb-2 text-gray-700">E-mail *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>

                {/* Senha */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Senha *</label>
                    <input
                      type="password"
                      required
                      value={formData.senha}
                      onChange={(e) => setFormData({...formData, senha: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                      placeholder="Mínimo 6 caracteres"
                      minLength={6}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Confirmar senha *</label>
                    <input
                      type="password"
                      required
                      value={formData.confirmarSenha}
                      onChange={(e) => setFormData({...formData, confirmarSenha: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                      placeholder="Repita a senha"
                    />
                  </div>
                </div>

                {/* Ocupação */}
                <div>
                  <label className="block text-sm mb-2 text-gray-700">Ocupação *</label>
                  <select
                    required
                    value={formData.ocupacao}
                    onChange={(e) => setFormData({...formData, ocupacao: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                  >
                    <option value="">Selecione sua ocupação</option>
                    <option value="estudante">Estudante</option>
                    <option value="empregado">Empregado(a)</option>
                    <option value="autonomo">Autônomo(a)</option>
                    <option value="empresario">Empresário(a)</option>
                    <option value="aposentado">Aposentado(a)</option>
                    <option value="desempregado">Desempregado(a)</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                {/* Afinidades */}
                <div>
                  <label className="block text-sm mb-2 text-gray-700">Áreas de afinidade *</label>
                  <p className="text-xs text-gray-500 mb-3">Selecione uma ou mais áreas</p>
                  <div className="flex flex-wrap gap-2">
                    {['Educação', 'Assistência Social', 'Cultura', 'Tecnologia', 'Eventos', 'Saúde', 'Meio Ambiente', 'Esportes'].map((afinidade) => (
                      <button
                        key={afinidade}
                        type="button"
                        onClick={() => toggleAfinidade(afinidade)}
                        className={`px-4 py-2 rounded-full text-sm transition-colors ${
                          formData.afinidades.includes(afinidade)
                            ? 'bg-[#4A9DB5] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {afinidade}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dados Étnicos e de Gênero (Opcional) */}
                <div className="border-t pt-6">
                  <p className="text-sm mb-4 text-gray-700">Dados demográficos (opcional)</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2 text-gray-700">Raça/Etnia</label>
                      <select
                        value={formData.raca}
                        onChange={(e) => setFormData({...formData, raca: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                      >
                        <option value="">Prefiro não informar</option>
                        <option value="branca">Branca</option>
                        <option value="preta">Preta</option>
                        <option value="parda">Parda</option>
                        <option value="amarela">Amarela</option>
                        <option value="indigena">Indígena</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-700">Gênero</label>
                      <select
                        value={formData.genero}
                        onChange={(e) => setFormData({...formData, genero: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                      >
                        <option value="">Prefiro não informar</option>
                        <option value="feminino">Feminino</option>
                        <option value="masculino">Masculino</option>
                        <option value="nao-binario">Não-binário</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Aceite de Termos */}
                <div className="border-t pt-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.aceitaTermos}
                      onChange={(e) => setFormData({...formData, aceitaTermos: e.target.checked})}
                      className="mt-1 w-4 h-4 text-[#4A9DB5] border-gray-300 rounded focus:ring-[#4A9DB5]"
                    />
                    <span className="text-sm text-gray-700">
                      Aceito os <a href="#" className="text-[#4A9DB5] hover:underline">termos de uso</a> e a <a href="#" className="text-[#4A9DB5] hover:underline">política de privacidade</a> do VoluntaMais *
                    </span>
                  </label>
                </div>

                {/* Botões */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCadastro(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-[#FFD500] hover:bg-[#FFC700] text-gray-900 rounded-full transition-colors"
                  >
                    Cadastrar
                  </button>
                </div>

                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    Já tem uma conta?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setShowCadastro(false);
                        setShowLogin(true);
                      }}
                      className="text-[#4A9DB5] hover:underline"
                    >
                      Entrar
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

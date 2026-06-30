import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { OportunidadesPage } from './pages/OportunidadesPage';
import { PainelPage } from './pages/PainelPage';
import { PainelOrgPage } from './pages/PainelOrgPage';
import { AdminPage } from './pages/AdminPage';
import { DetalhesPage } from './pages/DetalhesPage';
import { FeedbacksPage } from './pages/FeedbacksPage';

import { LoginModal } from './components/modals/LoginModal';
import { CadastroModal } from './components/modals/CadastroModal';
import { NovoProjetoModal } from './components/modals/NovoProjetoModal';
import { CertificadosModal } from './components/modals/CertificadosModal';
import { CalendarioModal } from './components/modals/CalendarioModal';
import { GenericModal } from './components/modals/GenericModal';
import { AccessibilityWidget } from './components/ui/AccessibilityWidget';
import { VLibrasWidget } from './components/ui/VLibrasWidget';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { cadastrarVoluntario, carregarDashboardVoluntario, VoluntarioDashboardResponse } from './services/voluntarioService';
import { ApiException } from './services/apiClient';
import {
  criarOportunidade,
  criarInscricao,
  fallbackCards,
  listarOportunidades,
  OportunidadeCard
} from './services/oportunidadeService';

function AppContent() {
  const auth = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [showCadastro, setShowCadastro] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showCertificados, setShowCertificados] = useState(false);
  const [showCalendario, setShowCalendario] = useState(false);
  const [showNovoProjeto, setShowNovoProjeto] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [opportunities, setOpportunities] = useState<OportunidadeCard[]>(fallbackCards());

  const [dashboardVoluntario, setDashboardVoluntario] = useState<VoluntarioDashboardResponse | null>(null);

  // Dados derivados do contexto de autenticação
  const userData = {
    nome: auth.user?.nome || '',
    email: auth.user?.email || '',
    horasVoluntarias: dashboardVoluntario?.horasVoluntarias || 0,
    certificados: dashboardVoluntario?.certificados || 0,
    inscricoesAtivas: dashboardVoluntario?.inscricoesAtivas || 0,
    inscricoes: dashboardVoluntario?.inscricoes || []
  };  const orgData = {
    nome: auth.user?.nome || '',
    email: auth.user?.email || '',
    oportunidades: [] as number[]
  };

  const [currentPage, setCurrentPage] = useState<'home' | 'oportunidades' | 'detalhes' | 'painel' | 'painel-org' | 'painel-admin' | 'feedbacks'>('home');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    listarOportunidades()
      .then(setOpportunities)
      .catch((error) => {
        console.error('Erro ao carregar oportunidades da API:', error);
      });
  }, [currentPage]);

  // Redirecionar para painel após login
  useEffect(() => {
    if (auth.isLoggedIn && currentPage === 'home' && !showLogin) {
      // Não redirecionar automaticamente ao carregar — apenas após login explícito
    }

    if (auth.isLoggedIn && auth.user?.tipo === 'Voluntario') {
      carregarDashboardVoluntario()
        .then(setDashboardVoluntario)
        .catch(console.error);
    }
  }, [auth.isLoggedIn, auth.user, currentPage]);
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
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [recoverLoading, setRecoverLoading] = useState(false);

  const [novoProjeto, setNovoProjeto] = useState({
    titulo: '',
    tipo: 'Projeto',
    categoria: '',
    descricao: '',
    cidade: '',
    estado: '',
    horario: '',
    vagasTotal: '',
    requisitos: '',
    beneficios: '',
    contato: '',
    dataInicio: '',
    dataFim: '',
    dataFimInscricoes: '',
    isRemoto: false,
    localDetalhado: '',
    fotos: [] as string[]
  });
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    cpf: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    ocupacao: '',
    afinidades: [] as number[],
    raca: '',
    genero: '',
    aceitaTermos: false
  });
  const [cadastroError, setCadastroError] = useState('');
  const [cadastroLoading, setCadastroLoading] = useState(false);

  // ===== HANDLERS =====

  const handleSubmitCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setCadastroError('');

    if (formData.senha !== formData.confirmarSenha) {
      setCadastroError('As senhas não coincidem.');
      return;
    }

    setCadastroLoading(true);
    try {
      await cadastrarVoluntario({
        nome: formData.nomeCompleto,
        cpf: formData.cpf,
        email: formData.email,
        senha: formData.senha,
        genero: formData.genero || undefined,
        etnia: formData.raca || undefined,
        formacoes: formData.ocupacao ? [{
          nome: formData.ocupacao,
          tipo: 'Ocupacao'
        }] : undefined,
        areasAfinidadeIds: formData.afinidades
      });

      setSuccessMessage('Cadastro realizado com sucesso! Faça login para acessar sua conta.');
      setShowCadastro(false);
      setShowLogin(true);
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
    } catch (err) {
      if (err instanceof ApiException) {
        setCadastroError(err.message);
      } else {
        setCadastroError('Erro ao realizar cadastro. Tente novamente.');
      }
    } finally {
      setCadastroLoading(false);
    }
  };

  const toggleAfinidade = (afinidadeId: number) => {
    setFormData(prev => ({
      ...prev,
      afinidades: prev.afinidades.includes(afinidadeId)
        ? prev.afinidades.filter(a => a !== afinidadeId)
        : [...prev.afinidades, afinidadeId]
    }));
  };

  const handleInscricao = async (e: React.FormEvent) => {
    e.preventDefault();
    const opp = opportunities.find(o => o.id === selectedOportunidade);
    if (!auth.user?.voluntarioId || !selectedOportunidade) {
      alert('Faça login como voluntário para concluir a inscrição.');
      setShowLogin(true);
      return;
    }

    try {
      await criarInscricao(selectedOportunidade, auth.user.voluntarioId, inscricaoData);
      console.log('Inscrição enviada:', { oportunidade: opp?.title, ...inscricaoData });
      setSuccessMessage('Inscrição enviada com sucesso! Entraremos em contato em breve.');
      setInscricaoData({ motivacao: '', disponibilidade: '', experiencia: '' });
      setCurrentPage('home');
      setSelectedOportunidade(null);
    } catch (error) {
      alert(error instanceof ApiException ? error.message : 'Erro ao enviar inscrição.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const loggedUser = await auth.login(loginData.email, loginData.senha);
      setShowLogin(false);
      setLoginData({ email: '', senha: '' });
      if (loggedUser.tipo === 'Admin' || loggedUser.tipo === 'Superadmin') {
        setCurrentPage('painel-admin');
      } else if (loggedUser.tipo === 'Instituicao') {
        setCurrentPage('painel-org');
      } else {
        setCurrentPage('painel');
      }
    } catch (err) {
      if (err instanceof ApiException) {
        setLoginError(err.message);
      } else {
        setLoginError('Erro ao conectar com o servidor. Verifique se a API está rodando.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRecoverAccount = async () => {
    setRecoverLoading(true);
    try {
      await authService.recoverConta(loginData.email, loginData.senha);
      setSuccessMessage('Conta recuperada com sucesso! Conectando...');
      setLoginError('');
      await handleLogin({ preventDefault: () => {} } as React.FormEvent);
    } catch (err) {
      if (err instanceof ApiException) {
        setLoginError(err.message);
      } else {
        setLoginError('Erro ao recuperar conta.');
      }
    } finally {
      setRecoverLoading(false);
    }
  };

  const handleLogout = () => {
    auth.logout();
    setCurrentPage('home');
  };

  const handleCriarProjeto = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth.isAdmin) {
      alert('Apenas administradores podem criar oportunidades.');
      return;
    }

    const categoriaMap: Record<string, number> = {
      educacao: 1,
      assistencia: 4,
      cultura: 5,
      tecnologia: 7
    };
    const tipoMap: Record<string, 0 | 1 | 2> = {
      Campanha: 0,
      Evento: 1,
      Projeto: 2
    };

    try {
      await criarOportunidade({
        instituicaoId: 6,
        categoriaId: categoriaMap[novoProjeto.categoria],
        titulo: novoProjeto.titulo,
        tipo: tipoMap[novoProjeto.tipo] ?? 2,
        descricao: novoProjeto.descricao,
        imagemUrl: novoProjeto.fotos?.[0],
        objetivo: novoProjeto.beneficios || novoProjeto.descricao,
        cidade: novoProjeto.cidade,
        estado: novoProjeto.estado,
        dataInicio: novoProjeto.dataInicio ? new Date(novoProjeto.dataInicio).toISOString() : new Date().toISOString(),
        dataFim: novoProjeto.dataFim ? new Date(novoProjeto.dataFim).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        vagas: Number(novoProjeto.vagasTotal),
        requisitos: novoProjeto.requisitos || undefined,
        turno: novoProjeto.horario || 'Conforme programacao',
        localDetalhado: novoProjeto.localDetalhado || undefined,
        dataFimInscricoes: novoProjeto.dataFimInscricoes ? new Date(novoProjeto.dataFimInscricoes).toISOString() : undefined,
        aceitaSemFormacao: true,
        precisaApoioCriancas: false
      });

      const atualizadas = await listarOportunidades();
      setOpportunities(atualizadas);
      setSuccessMessage('A nova oportunidade foi cadastrada com sucesso no sistema e já está disponível para visualização.');
      setShowNovoProjeto(false);
      setNovoProjeto({
        titulo: '',
        tipo: 'Projeto',
        categoria: '',
        descricao: '',
        cidade: '',
        estado: '',
        horario: '',
        vagasTotal: '',
        requisitos: '',
        beneficios: '',
        contato: '',
        dataInicio: '',
        dataFim: '',
        dataFimInscricoes: '',
        isRemoto: false,
        localDetalhado: '',
        fotos: []
      });
    } catch (err) {
      alert(err instanceof ApiException ? err.message : 'Erro ao cadastrar oportunidade no banco.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === files.length) {
            setNovoProjeto(prev => ({
              ...prev,
              fotos: [...prev.fotos, ...newImages]
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setNovoProjeto(prev => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index)
    }));
  };

  const openOportunidade = (id: number) => {
    setSelectedOportunidade(id);
    setCurrentPage('detalhes');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoggedIn={auth.isLoggedIn}
        isOrganizacao={auth.isOrganizacao}
        isAdmin={auth.isAdmin}
        userData={userData}
        orgData={orgData}
        setShowLogin={setShowLogin}
        setShowCadastro={setShowCadastro}
        handleLogout={handleLogout}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      {currentPage === 'home' && (
        <HomePage
          setShowCadastro={setShowCadastro}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          openOportunidade={openOportunidade}
          setCurrentPage={setCurrentPage}
          opportunities={opportunities}
        />
      )}

      {currentPage === 'oportunidades' && (
        <OportunidadesPage
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          openOportunidade={openOportunidade}
          opportunities={opportunities}
        />
      )}

      {currentPage === 'painel' && (
        <PainelPage
          userData={userData}
          setCurrentPage={setCurrentPage}
          openOportunidade={openOportunidade}
          setShowCertificados={setShowCertificados}
          setShowCalendario={setShowCalendario}
          opportunities={opportunities}
        />
      )}

      {currentPage === 'painel-org' && (
        <PainelOrgPage
          orgData={orgData}
          opportunities={opportunities}
          setCurrentPage={setCurrentPage}
        />
      )}

      {currentPage === 'painel-admin' && (
        <AdminPage
          adminName={auth.user?.nome || 'Administrador'}
          setShowNovoProjeto={setShowNovoProjeto}
          setCurrentPage={setCurrentPage}
        />
      )}

      {currentPage === 'feedbacks' && (
        <FeedbacksPage
          user={auth.user}
          isAdmin={auth.isAdmin}
          isOrganizacao={auth.isOrganizacao}
        />
      )}

      {currentPage === 'detalhes' && selectedOportunidade && (
        <DetalhesPage
          selectedOportunidade={selectedOportunidade}
          setCurrentPage={setCurrentPage}
          setSelectedOportunidade={setSelectedOportunidade}
          handleInscricao={handleInscricao}
          inscricaoData={inscricaoData}
          setInscricaoData={setInscricaoData}
          opportunities={opportunities}
        />
      )}

      {['home', 'oportunidades', 'detalhes'].includes(currentPage) && (
        <Footer
          setIsOrganizacao={() => {}}
          setIsLoggedIn={() => {}}
          setOrgData={() => {}}
          setCurrentPage={setCurrentPage}
          setShowNovoProjeto={setShowNovoProjeto}
        />
      )}

      <NovoProjetoModal
        showNovoProjeto={showNovoProjeto}
        setShowNovoProjeto={setShowNovoProjeto}
        handleCriarProjeto={handleCriarProjeto}
        novoProjeto={novoProjeto}
        setNovoProjeto={setNovoProjeto}
        handleImageUpload={handleImageUpload}
        removeImage={removeImage}
      />

      <CertificadosModal
        showCertificados={showCertificados}
        setShowCertificados={setShowCertificados}
        userData={userData}
      />

      <CalendarioModal
        showCalendario={showCalendario}
        setShowCalendario={setShowCalendario}
      />

      <AccessibilityWidget />
      <VLibrasWidget />

      <GenericModal
        isOpen={!!successMessage}
        onClose={() => setSuccessMessage('')}
        title="Sucesso"
        subtitle={successMessage}
        maxWidth="sm"
        footer={
          <button
            onClick={() => setSuccessMessage('')}
            className="rounded-lg bg-[#4A9DB5] px-6 py-2 text-sm font-medium text-white hover:bg-[#3d8296] transition-colors"
          >
            Entendi
          </button>
        }
      >
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-600">Operação concluída com sucesso!</p>
        </div>
      </GenericModal>

      <LoginModal
        showLogin={showLogin}
        setShowLogin={setShowLogin}
        setShowCadastro={setShowCadastro}
        handleLogin={handleLogin}
        loginData={loginData}
        setLoginData={setLoginData}
        loginError={loginError}
        loginLoading={loginLoading}
        onRecoverAccount={handleRecoverAccount}
        recoverLoading={recoverLoading}
      />

      <CadastroModal
        showCadastro={showCadastro}
        setShowCadastro={setShowCadastro}
        setShowLogin={setShowLogin}
        handleSubmitCadastro={handleSubmitCadastro}
        formData={formData}
        setFormData={setFormData}
        toggleAfinidade={toggleAfinidade}
        cadastroError={cadastroError}
        cadastroLoading={cadastroLoading}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

import { Menu, X } from 'lucide-react';
import logoVoluntaMais from '../../assets/images/logo_primary.svg';
import { ptBR } from '../locales/pt-BR';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: 'home' | 'oportunidades' | 'detalhes' | 'painel' | 'painel-org' | 'painel-admin') => void;
  isLoggedIn: boolean;
  isOrganizacao: boolean;
  isAdmin: boolean;
  userData: { nome: string };
  orgData: { nome: string };
  setShowLogin: (show: boolean) => void;
  setShowCadastro: (show: boolean) => void;
  handleLogout: () => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export function Header({
  currentPage,
  setCurrentPage,
  isLoggedIn,
  isOrganizacao,
  isAdmin,
  userData,
  orgData,
  setShowLogin,
  setShowCadastro,
  handleLogout,
  menuOpen,
  setMenuOpen
}: HeaderProps) {
  const t = ptBR.header;
  const painelPage = isAdmin ? 'painel-admin' : isOrganizacao ? 'painel-org' : 'painel';
  const displayName = isOrganizacao ? orgData.nome : userData.nome;
  
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <img src={logoVoluntaMais} alt="VoluntaMais" className="h-12" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => setCurrentPage('home')}
              className={`text-gray-700 hover:text-[#4A9DB5] transition-colors ${currentPage === 'home' ? 'text-[#4A9DB5] font-medium' : ''}`}
            >
              {t.inicio}
            </button>
            <button
              onClick={() => setCurrentPage('oportunidades')}
              className={`text-gray-700 hover:text-[#4A9DB5] transition-colors ${currentPage === 'oportunidades' ? 'text-[#4A9DB5] font-medium' : ''}`}
            >
              {t.oportunidades}
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
              {t.comoFunciona}
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
              {t.instituto}
            </button>

            {isLoggedIn ? (
              <>
                <button
                  onClick={() => setCurrentPage(painelPage)}
                  className={`text-gray-700 hover:text-[#4A9DB5] transition-colors ${['painel', 'painel-org', 'painel-admin'].includes(currentPage) ? 'text-[#4A9DB5] font-medium' : ''}`}
                >
                  {t.meuPainel}
                </button>
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 text-sm">
                    {t.ola}, {displayName.split(' ')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
                  >
                    {t.sair}
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-gray-700 hover:text-[#4A9DB5] transition-colors"
                >
                  {t.entrar}
                </button>
                <button
                  onClick={() => setShowCadastro(true)}
                  className="bg-[#FFD500] hover:bg-[#FFC700] text-gray-900 px-6 py-2.5 rounded-full transition-colors"
                >
                  {t.queroSerVoluntario}
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
              {t.inicio}
            </button>
            <button
              onClick={() => { setCurrentPage('oportunidades'); setMenuOpen(false); }}
              className="text-gray-700 hover:text-[#4A9DB5] transition-colors text-left"
            >
              {t.oportunidades}
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
              {t.comoFunciona}
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
              {t.instituto}
            </button>

            {isLoggedIn ? (
              <>
                <button
                  onClick={() => { setCurrentPage(painelPage); setMenuOpen(false); }}
                  className="text-gray-700 hover:text-[#4A9DB5] transition-colors text-left"
                >
                  {t.meuPainel}
                </button>
                <div className="text-gray-700 text-sm">
                  {t.ola}, {displayName.split(' ')[0]}
                </div>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="text-gray-500 hover:text-gray-700 transition-colors text-left text-sm"
                >
                  {t.sair}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setShowLogin(true); setMenuOpen(false); }}
                  className="text-gray-700 hover:text-[#4A9DB5] transition-colors text-left"
                >
                  {t.entrar}
                </button>
                <button
                  onClick={() => { setShowCadastro(true); setMenuOpen(false); }}
                  className="bg-[#FFD500] hover:bg-[#FFC700] text-gray-900 px-6 py-2.5 rounded-full transition-colors"
                >
                  {t.queroSerVoluntario}
                </button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

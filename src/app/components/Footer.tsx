import logoVoluntaMais from '../../assets/images/logo_white.svg';
import logoInstituto from '../../assets/images/logoInstituto.png';
import { ptBR } from '../locales/pt-BR';

interface FooterProps {
  setIsOrganizacao: (val: boolean) => void;
  setIsLoggedIn: (val: boolean) => void;
  setOrgData: (data: any) => void;
  setCurrentPage: (page: 'home' | 'oportunidades' | 'detalhes' | 'painel' | 'painel-org' | 'painel-admin') => void;
  setShowNovoProjeto: (val: boolean) => void;
}

export function Footer({
  setIsOrganizacao,
  setIsLoggedIn,
  setOrgData,
  setCurrentPage,
  setShowNovoProjeto
}: FooterProps) {
  const t = ptBR.footer;

  return (
    <footer className="bg-[#1e3a8a] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <img src={logoVoluntaMais} alt="VoluntaMais" className="h-12 mb-4 brightness-0 invert" />
            <p className="text-white/80 text-sm mb-4">
              {t.descricaoInstituto}
            </p>
            <img src={logoInstituto} alt="Instituto Victor Gabriel" className="h-10 brightness-0 invert opacity-70" />
          </div>

          <div>
            <h3 className="mb-4">{t.navegacao}</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="#inicio" className="hover:text-white transition-colors">{t.inicio}</a></li>
              <li><a href="#oportunidades" className="hover:text-white transition-colors">{t.oportunidades}</a></li>
              <li><a href="#como-funciona" className="hover:text-white transition-colors">{t.comoFunciona}</a></li>
              <li><a href="#instituto" className="hover:text-white transition-colors">{t.instituto}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4">{t.paraVoluntarios}</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="#" className="hover:text-white transition-colors">{t.comoFunciona}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t.cadastreSe}</a></li>
              {/* <li><a href="#" className="hover:text-white transition-colors">{t.faq}</a></li> */}
              {/* <li><a href="#" className="hover:text-white transition-colors">{t.blog}</a></li> */}
            </ul>
          </div>

          <div>
            <h3 className="mb-4">{t.paraOrganizacoes}</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <button
                  onClick={() => {
                    setIsOrganizacao(true);
                    setIsLoggedIn(true);
                    setOrgData({
                      nome: 'ONG Educar para Crescer',
                      email: 'contato@educar.org.br',
                      oportunidades: [1, 2, 7]
                    });
                    setCurrentPage('painel-org');
                    window.scrollTo(0, 0);
                  }}
                  className="hover:text-white transition-colors"
                >
                  {t.acessoOrganizacoes}
                </button>
              </li>
              {/* <li>
                <button
                  onClick={() => setShowNovoProjeto(true)}
                  className="hover:text-white transition-colors"
                >
                  {t.cadastrarProjeto}
                </button>
              </li> */}
              <li><a href="#" className="hover:text-white transition-colors">{t.recursos}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4">{t.contato}</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>(13) 3224-3531</li>
              <li>(13) 99128-8000</li>
              <li className="pt-4 flex gap-4">
                <a href="https://www.instagram.com/institutovictorgabriel/" className="hover:text-white transition-colors">Instagram</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-sm text-white/70">
          <p>{t.direitos}</p>
          <p className='mt-4'>Desenvolvido por [PLACEHOLDER]</p>
        </div>
      </div>
    </footer>
  );
}

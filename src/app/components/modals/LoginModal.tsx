import { X, Loader2 } from 'lucide-react';
import logoVoluntaMais from '../../../assets/images/logo_primary.svg';
import { ptBR } from '../../locales/pt-BR';

interface LoginModalProps {
  showLogin: boolean;
  setShowLogin: (show: boolean) => void;
  setShowCadastro: (show: boolean) => void;
  handleLogin: (e: React.FormEvent) => void;
  loginData: any;
  setLoginData: (data: any) => void;
  loginError?: string;
  loginLoading?: boolean;
}

export function LoginModal({
  showLogin,
  setShowLogin,
  setShowCadastro,
  handleLogin,
  loginData,
  setLoginData,
  loginError = '',
  loginLoading = false
}: LoginModalProps) {
  const t = ptBR.modals.login;

  if (!showLogin) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full my-8 relative max-h-[calc(100vh-4rem)] overflow-y-auto">
        <button
          onClick={() => setShowLogin(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <img src={logoVoluntaMais} alt="VoluntaMais" className="h-16 mx-auto mb-4" />
            <h2 className="text-3xl mb-2 text-gray-900">{t.titulo}</h2>
            <p className="text-gray-600">{t.subtitulo}</p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{loginError}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm mb-2 text-gray-700">{t.emailCpf}</label>
              <input
                type="text"
                required
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                placeholder={t.emailCpfPlaceholder}
                disabled={loginLoading}
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">{t.senha}</label>
              <input
                type="password"
                required
                value={loginData.senha}
                onChange={(e) => setLoginData({...loginData, senha: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                placeholder={t.senhaPlaceholder}
                disabled={loginLoading}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-[#4A9DB5] border-gray-300 rounded focus:ring-[#4A9DB5]" />
                <span className="text-gray-600">{t.lembrar}</span>
              </label>
              <a href="#" className="text-[#4A9DB5] hover:underline">{t.esqueciSenha}</a>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-[#4A9DB5] hover:bg-[#3D8CA3] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-full transition-colors flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                t.titulo
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {t.naoTemConta}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setShowLogin(false);
                    setShowCadastro(true);
                  }}
                  className="text-[#4A9DB5] hover:underline"
                >
                  {t.cadastreSe}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

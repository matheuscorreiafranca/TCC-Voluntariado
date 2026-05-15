import { X, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ptBR } from '../../locales/pt-BR';
import { listarCategorias, listarOcupacoes, LookupItem } from '../../services/lookupService';

interface CadastroModalProps {
  showCadastro: boolean;
  setShowCadastro: (show: boolean) => void;
  setShowLogin: (show: boolean) => void;
  handleSubmitCadastro: (e: React.FormEvent) => void;
  formData: any;
  setFormData: (data: any) => void;
  toggleAfinidade: (afinidadeId: number) => void;
  cadastroError?: string;
  cadastroLoading?: boolean;
}

export function CadastroModal({
  showCadastro,
  setShowCadastro,
  setShowLogin,
  handleSubmitCadastro,
  formData,
  setFormData,
  toggleAfinidade,
  cadastroError = '',
  cadastroLoading = false
}: CadastroModalProps) {
  const t = ptBR.modals.cadastro;
  const [categorias, setCategorias] = useState<LookupItem[]>([]);
  const [ocupacoes, setOcupacoes] = useState<LookupItem[]>([]);
  const [loadingLookups, setLoadingLookups] = useState(false);

  useEffect(() => {
    if (showCadastro) {
      const fetchLookups = async () => {
        setLoadingLookups(true);
        try {
          const [cats, ocups] = await Promise.all([listarCategorias(), listarOcupacoes()]);
          setCategorias(cats);
          setOcupacoes(ocups);
        } catch (error) {
          console.error('Erro ao carregar dados do formulário:', error);
        } finally {
          setLoadingLookups(false);
        }
      };
      fetchLookups();
    }
  }, [showCadastro]);

  if (!showCadastro) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8 relative max-h-[calc(100vh-4rem)] overflow-y-auto">
        <button
          onClick={() => setShowCadastro(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl mb-2 text-gray-900">{t.titulo}</h2>
            <p className="text-gray-600">{t.subtitulo}</p>
          </div>

          {cadastroError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{cadastroError}</p>
            </div>
          )}

          <form onSubmit={handleSubmitCadastro} className="space-y-6">
            <div>
              <label className="block text-sm mb-2 text-gray-700">{t.nomeCompleto}</label>
              <input
                type="text"
                required
                value={formData.nomeCompleto}
                onChange={(e) => setFormData({...formData, nomeCompleto: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                placeholder={t.nomePlaceholder}
                disabled={cadastroLoading}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">{t.cpf}</label>
                <input
                  type="text"
                  required
                  value={formData.cpf}
                  onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  disabled={cadastroLoading}
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">{t.email}</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                  placeholder="seu@email.com"
                  disabled={cadastroLoading}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">{t.senha}</label>
                <input
                  type="password"
                  required
                  value={formData.senha}
                  onChange={(e) => setFormData({...formData, senha: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                  placeholder={t.senhaPlaceholder}
                  minLength={6}
                  disabled={cadastroLoading}
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">{t.confirmarSenha}</label>
                <input
                  type="password"
                  required
                  value={formData.confirmarSenha}
                  onChange={(e) => setFormData({...formData, confirmarSenha: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                  placeholder={t.confirmarSenhaPlaceholder}
                  disabled={cadastroLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">{t.ocupacao}</label>
              <select
                required
                value={formData.ocupacao}
                onChange={(e) => setFormData({...formData, ocupacao: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                disabled={cadastroLoading || loadingLookups}
              >
                <option value="">{loadingLookups ? 'Carregando...' : t.selecioneOcupacao}</option>
                {ocupacoes.map(o => (
                  <option key={o.id} value={o.nome}>{o.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">{t.afinidades}</label>
              <p className="text-xs text-gray-500 mb-3">{t.selecioneAfinidades}</p>
              <div className="flex flex-wrap gap-2">
                {loadingLookups ? (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Carregando afinidades...</span>
                  </div>
                ) : (
                  categorias.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleAfinidade(cat.id)}
                      disabled={cadastroLoading}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        formData.afinidades.includes(cat.id)
                          ? 'bg-[#4A9DB5] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat.nome}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="border-t pt-6">
              <p className="text-sm mb-4 text-gray-700">{t.demograficos}</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-700">{t.raca}</label>
                  <select
                    value={formData.raca}
                    onChange={(e) => setFormData({...formData, raca: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                    disabled={cadastroLoading}
                  >
                    <option value="">{t.prefiroNaoInformar}</option>
                    <option value="branca">Branca</option>
                    <option value="preta">Preta</option>
                    <option value="parda">Parda</option>
                    <option value="amarela">Amarela</option>
                    <option value="indigena">Indígena</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">{t.genero}</label>
                  <select
                    value={formData.genero}
                    onChange={(e) => setFormData({...formData, genero: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                    disabled={cadastroLoading}
                  >
                    <option value="">{t.prefiroNaoInformar}</option>
                    <option value="feminino">Feminino</option>
                    <option value="masculino">Masculino</option>
                    <option value="nao-binario">Não-binário</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.aceitaTermos}
                  onChange={(e) => setFormData({...formData, aceitaTermos: e.target.checked})}
                  className="mt-1 w-4 h-4 text-[#4A9DB5] border-gray-300 rounded focus:ring-[#4A9DB5]"
                  disabled={cadastroLoading}
                />
                <span className="text-sm text-gray-700">
                  {t.aceitoTermos} <a href="#" className="text-[#4A9DB5] hover:underline">{t.termosUso}</a> {t.eA} <a href="#" className="text-[#4A9DB5] hover:underline">{t.politicaPrivacidade}</a> {t.doVoluntamais}
                </span>
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setShowCadastro(false)}
                disabled={cadastroLoading}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                {t.cancelar}
              </button>
              <button
                type="submit"
                disabled={cadastroLoading}
                className="flex-1 px-6 py-3 bg-[#FFD500] hover:bg-[#FFC700] disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 rounded-full transition-colors flex items-center justify-center gap-2"
              >
                {cadastroLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  t.cadastrar
                )}
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                {t.jaTemConta}{' '}
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
  );
}

import { X, Upload } from 'lucide-react';
import { ptBR } from '../../locales/pt-BR';

interface NovoProjetoModalProps {
  showNovoProjeto: boolean;
  setShowNovoProjeto: (show: boolean) => void;
  handleCriarProjeto: (e: React.FormEvent) => void;
  novoProjeto: any;
  setNovoProjeto: (data: any) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}

export function NovoProjetoModal({
  showNovoProjeto,
  setShowNovoProjeto,
  handleCriarProjeto,
  novoProjeto,
  setNovoProjeto,
  handleImageUpload,
  removeImage
}: NovoProjetoModalProps) {
  const t = ptBR.modals.novoProjeto;

  if (!showNovoProjeto) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-8 relative max-h-[calc(100vh-4rem)] overflow-y-auto">
        <button
          onClick={() => setShowNovoProjeto(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="mb-8 border-b pb-4">
            <h2 className="text-2xl mb-2 text-gray-900">{t.titulo}</h2>
            <p className="text-gray-600">{t.subtitulo}</p>
          </div>

          <form onSubmit={handleCriarProjeto} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm mb-2 text-gray-700">{t.tituloProjeto}</label>
                <input
                  type="text"
                  required
                  value={novoProjeto.titulo}
                  onChange={(e) => setNovoProjeto({...novoProjeto, titulo: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                  placeholder="Ex: Aulas de Reforço de Matemática"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">{t.categoria}</label>
                <select
                  required
                  value={novoProjeto.categoria}
                  onChange={(e) => setNovoProjeto({...novoProjeto, categoria: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="educacao">Educação</option>
                  <option value="assistencia">Assistência Social</option>
                  <option value="cultura">Cultura</option>
                  <option value="tecnologia">Tecnologia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Tipo</label>
                <select
                  required
                  value={novoProjeto.tipo}
                  onChange={(e) => setNovoProjeto({...novoProjeto, tipo: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                >
                  <option value="Projeto">Projeto</option>
                  <option value="Campanha">Campanha</option>
                  <option value="Evento">Evento</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">{t.vagas}</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={novoProjeto.vagasTotal}
                  onChange={(e) => setNovoProjeto({...novoProjeto, vagasTotal: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm mb-2 text-gray-700">{t.descricao}</label>
                <textarea
                  required
                  value={novoProjeto.descricao}
                  onChange={(e) => setNovoProjeto({...novoProjeto, descricao: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Descreva o objetivo do projeto e as atividades a serem realizadas..."
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">{t.cidade}</label>
                <input
                  type="text"
                  required
                  value={novoProjeto.cidade}
                  onChange={(e) => setNovoProjeto({...novoProjeto, cidade: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">{t.estado}</label>
                <select
                  required
                  value={novoProjeto.estado}
                  onChange={(e) => setNovoProjeto({...novoProjeto, estado: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9DB5] focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm mb-2 text-gray-700">{t.fotos}</label>
                <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#4A9DB5] transition-colors cursor-pointer bg-gray-50 block">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="text-[#4A9DB5] font-medium">{t.cliqueUpload}</span> {t.arraste}
                  </p>
                  <p className="text-xs text-gray-500">{t.tamanhoAviso}</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {novoProjeto.fotos && novoProjeto.fotos.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {novoProjeto.fotos.map((foto: string, index: number) => (
                      <div key={index} className="relative group">
                        <img src={foto} alt={`Foto ${index + 1}`} className="w-20 h-20 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
              <div className="text-blue-500 mt-0.5">ℹ️</div>
              <p className="text-sm text-blue-900">
                <strong>{t.importante}</strong> {t.avisoAnalise}
              </p>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowNovoProjeto(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
              >
                {t.cancelar}
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#4A9DB5] hover:bg-[#3D8CA3] text-white py-3 rounded-full transition-colors font-medium"
              >
                {t.cadastrar}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

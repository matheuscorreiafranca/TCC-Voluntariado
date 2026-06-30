import { X, Clock, MapPin } from 'lucide-react';
import { ptBR } from '../../locales/pt-BR';
import { proximasAtividades } from '../../data/mocks';

interface CalendarioModalProps {
  showCalendario: boolean;
  setShowCalendario: (show: boolean) => void;
}

export function CalendarioModal({ showCalendario, setShowCalendario }: CalendarioModalProps) {
  const t = ptBR.modals.calendario;

  if (!showCalendario) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full relative max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-gray-900">{t.titulo}</h2>
            <p className="text-gray-600 mt-1">{t.subtitulo}</p>
          </div>
          <button
            onClick={() => setShowCalendario(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">{t.todasAtividades}</h3>
          </div>

          <div className="space-y-4">
            {proximasAtividades.map(ativ => {
              const data = new Date(ativ.data);
              const dia = data.getDate();
              const mes = data.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase();
              
              return (
                <div key={ativ.id} className="flex flex-col sm:flex-row gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-[#4A9DB5] hover:shadow-sm transition-all">
                  <div className="flex sm:flex-col items-center justify-center sm:w-20 sm:h-20 bg-gray-50 rounded-lg shrink-0 p-2 sm:p-0 border border-gray-100">
                    <div className="text-2xl sm:text-3xl font-bold text-[#4A9DB5]">{dia}</div>
                    <div className="text-xs sm:text-sm font-medium text-gray-500 ml-2 sm:ml-0">{mes}</div>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">{ativ.titulo}</h4>
                    <div className="flex flex-col sm:flex-row gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {ativ.hora}
                      </div>
                      <div className="hidden sm:block text-gray-300">•</div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {ativ.local}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => setShowCalendario(false)}
            className="w-full sm:w-auto px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
          >
            {t.fechar}
          </button>
        </div>
      </div>
    </div>
  );
}

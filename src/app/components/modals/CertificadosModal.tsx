import { X, Award, Download } from 'lucide-react';
import { ptBR } from '../../locales/pt-BR';
import { certificados } from '../../data/mocks';

interface CertificadosModalProps {
  showCertificados: boolean;
  setShowCertificados: (show: boolean) => void;
  userData: { horasVoluntarias: number };
}

export function CertificadosModal({
  showCertificados,
  setShowCertificados,
  userData
}: CertificadosModalProps) {
  const t = ptBR.modals.certificados;

  if (!showCertificados) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full relative max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-gray-900">{t.titulo}</h2>
            <p className="text-gray-600 mt-1">{t.totalDe} {userData.horasVoluntarias} {t.horasCertificadas}</p>
          </div>
          <button
            onClick={() => setShowCertificados(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {certificados.map(cert => (
            <div key={cert.id} className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:border-[#4A9DB5] transition-colors">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-[#FFD500]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-[#FFD500]" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-medium">{cert.titulo}</h3>
                  <div className="flex gap-4 text-sm text-gray-500 mt-1">
                    <span>{cert.data}</span>
                    <span>{cert.horas}h</span>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors w-full sm:w-auto justify-center">
                <Download className="w-4 h-4" />
                {t.baixarPdf}
              </button>
            </div>
          ))}
        </div>

        <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => setShowCertificados(false)}
            className="w-full sm:w-auto px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
          >
            {t.fechar}
          </button>
        </div>
      </div>
    </div>
  );
}

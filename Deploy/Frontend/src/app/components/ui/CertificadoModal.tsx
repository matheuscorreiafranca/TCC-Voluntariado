import { Printer, X, Award } from 'lucide-react';
import { useRef } from 'react';

interface CertificadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  voluntarioNome: string;
  inscricao: any;
}

export function CertificadoModal({ isOpen, onClose, voluntarioNome, inscricao }: CertificadoModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !inscricao) return null;

  const handlePrint = () => {
    const printContent = contentRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Certificado - ${voluntarioNome}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @media print {
                @page { size: landscape; margin: 0; }
                body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              }
            </style>
          </head>
          <body class="flex items-center justify-center min-h-screen bg-gray-100 p-8">
            ${printContent.outerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();

      // Wait for tailwind to load
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 800);
    }
  };

  const dataFimStr = inscricao.oportunidade.dataFim
    ? new Date(inscricao.oportunidade.dataFim).toLocaleDateString('pt-BR')
    : new Date(inscricao.dataAtualizacao || inscricao.dataInscricao).toLocaleDateString('pt-BR');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/80">
          <h2 className="text-lg font-semibold text-gray-800">Visualização do Certificado</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#123E5C] text-white rounded-lg hover:bg-[#0c2a3e] transition-colors font-medium text-sm"
            >
              <Printer className="w-4 h-4" />
              Imprimir / PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center bg-gray-200/50">
          {/* Certificate Outer Container (for printing) */}
          <div
            ref={contentRef}
            className="relative w-[800px] h-[560px] bg-[#e5e7eb] overflow-hidden flex items-center justify-center"
            style={{
              boxShadow: '0 0 40px rgba(0,0,0,0.1)'
            }}
          >
            {/* Background geometric shapes */}
            <div className="absolute top-0 left-0 w-[25%] h-full bg-[#1e3a8a]"></div>
            <div className="absolute bottom-0 left-0 w-[70%] h-[20%] bg-[#1e3a8a]"></div>

            {/* Inner White Card */}
            <div className="relative w-[720px] h-[480px] bg-white rounded-xl shadow-lg p-12 flex flex-col z-10">

              {/* Yellow Top Bar */}
              <div className="absolute top-0 left-12 w-24 h-2 bg-[#f59e0b] rounded-b-sm"></div>

              {/* Header */}
              <div className="flex justify-between items-start">
                <h1 className="text-[3.5rem] font-serif text-[#374151] tracking-tight font-bold mt-2" style={{ fontFamily: 'Georgia, serif' }}>
                  Certificado
                </h1>

                {/* Logo Badge */}
                <div className="flex flex-col items-center justify-center w-28 h-28 border-[2px] border-[#1e3a8a] text-[#1e3a8a] rounded-full p-2 bg-white -mt-4 shadow-sm relative z-20">
                  <Award className="w-10 h-10 mb-1" />
                  <span className="text-[9px] font-bold tracking-widest uppercase text-center leading-tight">Volunta<br />Mais</span>
                </div>
              </div>

              {/* Body */}
              <div className="mt-12 flex-1">
                <h2 className="text-[2.2rem] text-gray-800 font-medium mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>
                  {voluntarioNome}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed max-w-[90%]" style={{ fontFamily: 'Arial, sans-serif' }}>
                  participou e concluiu com êxito a oportunidade <strong className="font-semibold text-gray-800">{inscricao.oportunidadeTitulo}</strong>,
                  promovida pela instituição <strong className="font-semibold text-gray-800">{inscricao.instituicaoNome}</strong>,
                  com carga horária total de <strong className="font-semibold text-gray-800">{inscricao.horasComprovadas}h</strong>,
                  realizada em {dataFimStr}.
                </p>
              </div>

              {/* Footer / Signature */}
              <div className="mt-8 border-t border-gray-300 pt-4 w-64">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl font-bold italic text-gray-800 opacity-80" style={{ fontFamily: "'Brush Script MT', cursive, serif" }}>
                    Instituto Victor Gabriel
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-800">{inscricao.instituicaoNome}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Instituição Organizadora</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

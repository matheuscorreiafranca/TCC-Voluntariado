import { useState, useEffect } from 'react';
import { Accessibility, Sun, Moon, Type, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(100); // Em porcentagem

  useEffect(() => {
    // Aplicar Alto Contraste
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    // Aplicar Tamanho da Fonte
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  const resetAccessibility = () => {
    setHighContrast(false);
    setFontSize(100);
  };

  return (
    <div className="fixed left-6 bottom-24 z-[60] flex flex-col items-start gap-4">
      {/* Botão Principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#4A9DB5] hover:bg-[#3D8CA3] text-white rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-110 active:scale-95"
        title="Opções de Acessibilidade"
      >
        <Accessibility className="w-8 h-8" />
      </button>

      {/* Menu de Opções */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-200 w-64 animate-in slide-in-from-left-4 fade-in duration-200">
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-[#4A9DB5]" />
              Acessibilidade
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">×</button>
          </div>

          <div className="space-y-4">
            {/* Alto Contraste */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 flex items-center gap-2">
                {highContrast ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                Alto Contraste
              </span>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`w-12 h-6 rounded-full transition-colors relative ${highContrast ? 'bg-[#4A9DB5]' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${highContrast ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            {/* Tamanho da Fonte */}
            <div className="space-y-2">
              <span className="text-sm text-gray-700 flex items-center gap-2">
                <Type className="w-4 h-4" />
                Tamanho do Texto ({fontSize}%)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFontSize(prev => Math.min(prev + 10, 150))}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 p-2 rounded-lg flex items-center justify-center"
                  title="Aumentar Texto"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setFontSize(prev => Math.max(prev - 10, 80))}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 p-2 rounded-lg flex items-center justify-center"
                  title="Diminuir Texto"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Resetar */}
            <button
              onClick={resetAccessibility}
              className="w-full flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-[#4A9DB5] transition-colors pt-2 border-t"
            >
              <RotateCcw className="w-3 h-3" />
              Resetar Acessibilidade
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

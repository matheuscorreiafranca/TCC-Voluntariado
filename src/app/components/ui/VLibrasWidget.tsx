import { useEffect } from 'react';

declare global {
  interface Window {
    VLibras?: {
      Widget?: new (url: string) => unknown;
    };
    __voluntamaisVLibrasLoaded?: boolean;
  }
}

const VLIBRAS_SCRIPT_ID = 'vlibras-plugin-script';
const VLIBRAS_APP_URL = 'https://vlibras.gov.br/app';

export function VLibrasWidget() {
  useEffect(() => {
    const initializeWidget = () => {
      if (!window.VLibras?.Widget || window.__voluntamaisVLibrasLoaded) {
        return;
      }

      new window.VLibras.Widget(VLIBRAS_APP_URL);
      window.__voluntamaisVLibrasLoaded = true;

      if (document.readyState !== 'loading' && typeof window.onload === 'function') {
        window.setTimeout(() => {
          window.onload?.(new Event('load'));
        }, 0);
      }
    };

    const existingScript = document.getElementById(VLIBRAS_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      if (existingScript.dataset.loaded === 'true') {
        initializeWidget();
      } else {
        existingScript.addEventListener('load', initializeWidget, { once: true });
      }
      return;
    }

    const script = document.createElement('script');
    script.id = VLIBRAS_SCRIPT_ID;
    script.src = `${VLIBRAS_APP_URL}/vlibras-plugin.js`;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      initializeWidget();
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div
      {...{ vw: '' }}
      className="enabled vlibras-widget"
      aria-label="Assistente de tradução para Libras"
    >
      <div
        {...{ 'vw-access-button': '' }}
        className="active"
        role="button"
        aria-label="Abrir assistente VLibras"
        title="Abrir assistente VLibras"
      />
      <div {...{ 'vw-plugin-wrapper': '' }} aria-live="polite">
        <div className="vw-plugin-top-wrapper" />
      </div>
    </div>
  );
}

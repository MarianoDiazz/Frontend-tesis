import { useEffect } from 'react';
import type { ReactNode } from 'react';
import './PanelLateral.css';

interface Props {
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
}

export default function PanelLateral({ titulo, onCerrar, children }: Props) {
  // cierro con la tecla Escape
  useEffect(() => {
    function alApretar(e: KeyboardEvent) {
      if (e.key === 'Escape') onCerrar();
    }
    document.addEventListener('keydown', alApretar);
    return () => document.removeEventListener('keydown', alApretar);
  }, [onCerrar]);

  return (
    <div className="panel-fondo">
      <aside className="panel" role="dialog" aria-modal="true" aria-labelledby="panel-titulo">
        <header className="panel-encabezado">
          <h2 id="panel-titulo">{titulo}</h2>
          <button className="panel-cerrar" onClick={onCerrar} aria-label="Cerrar">✕</button>
        </header>
        <div className="panel-cuerpo">{children}</div>
      </aside>
    </div>
  );
}
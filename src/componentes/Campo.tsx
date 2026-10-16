import type { ChangeEvent } from 'react';

interface Props {
  id: string;
  etiqueta: string;
  valor: string;
  error?: string;
  tipo?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

// input con su etiqueta y su mensaje de error abajo
export default function Campo({ id, etiqueta, valor, error, tipo = 'text', onChange }: Props) {
  return (
    <div className="campo">
      <label htmlFor={id}>{etiqueta}</label>
      <input id={id} name={id} type={tipo} value={valor} onChange={onChange} aria-invalid={!!error} />
      {error && <span className="campo-error">{error}</span>}
    </div>
  );
}
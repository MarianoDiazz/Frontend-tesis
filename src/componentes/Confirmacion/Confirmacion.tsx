import './Confirmacion.css';

interface Props {
  titulo: string;
  mensaje: string;
  textoConfirmar: string;
  procesando: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

// pregunta antes de una acción que no se puede deshacer fácil
export default function Confirmacion({ titulo, mensaje, textoConfirmar, procesando, onConfirmar, onCancelar }: Props) {
  return (
    <div className="confirmacion-fondo">
      <div className="confirmacion" role="alertdialog" aria-modal="true" aria-labelledby="confirmacion-titulo">
        <h2 id="confirmacion-titulo">{titulo}</h2>
        <p>{mensaje}</p>
        <div className="confirmacion-acciones">
          <button className="btn btn-secundario" onClick={onCancelar} disabled={procesando} autoFocus>
            Cancelar
          </button>
          <button className="btn btn-peligro" onClick={onConfirmar} disabled={procesando}>
            {procesando ? 'Procesando…' : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
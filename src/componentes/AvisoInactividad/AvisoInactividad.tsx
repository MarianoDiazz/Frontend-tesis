import '../Confirmacion/Confirmacion.css';

interface Props {
  segundos: number;
  onSeguir: () => void;
  onSalir: () => void;
}

// aviso antes de cerrar la sesión por inactividad
export default function AvisoInactividad({ segundos, onSeguir, onSalir }: Props) {
  return (
    <div className="confirmacion-fondo">
      <div className="confirmacion" role="alertdialog" aria-modal="true" aria-labelledby="aviso-titulo">
        <h2 id="aviso-titulo">¿Seguís ahí?</h2>
        <p aria-live="polite">
          Por seguridad, la sesión se va a cerrar en {segundos} {segundos === 1 ? 'segundo' : 'segundos'}.
        </p>
        <div className="confirmacion-acciones">
          <button className="btn btn-secundario" onClick={onSalir}>Cerrar sesión</button>
          <button className="btn btn-primario" onClick={onSeguir} autoFocus>Seguir trabajando</button>
        </div>
      </div>
    </div>
  );
}

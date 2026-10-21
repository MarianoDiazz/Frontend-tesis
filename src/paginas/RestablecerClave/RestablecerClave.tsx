import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { restablecerClave } from '../../api/autenticacion.api';
import { mensajeDeError } from '../../utilidades/errores';
import '../Login/Login.css';

export default function RestablecerClave() {
  // el token viene en la dirección: /restablecer-clave?token=...
  const [parametros] = useSearchParams();
  const token = parametros.get('token') ?? '';

  const [clave, setClave] = useState('');
  const [repetir, setRepetir] = useState('');
  const [error, setError] = useState('');
  const [listo, setListo] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (clave.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (clave !== repetir) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setCargando(true);
    try {
      setListo(await restablecerClave(token, clave));
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo cambiar la contraseña.'));
    } finally {
      setCargando(false);
    }
  }

  // sin token en la dirección no hay nada que hacer
  if (!token) {
    return (
      <div className="login-fondo">
        <div className="login-tarjeta">
          <h1>Enlace incompleto</h1>
          <p className="login-subtitulo">Este enlace no sirve. Pedí uno nuevo desde "¿Olvidaste tu contraseña?".</p>
          <Link to="/recuperar-clave" className="login-enlace">Pedir un enlace nuevo</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="login-fondo">
      <form className="login-tarjeta" onSubmit={manejarEnvio}>
        <h1>Nueva contraseña</h1>

        {listo ? (
          <>
            <p className="login-exito">{listo}</p>
            <Link to="/login" className="login-enlace">Ir a iniciar sesión</Link>
          </>
        ) : (
          <>
            <p className="login-subtitulo">Elegí una contraseña de al menos 6 caracteres.</p>

            <label htmlFor="clave">Contraseña nueva</label>
            <input id="clave" type="password" value={clave}
              onChange={(e) => setClave(e.target.value)} autoComplete="new-password" />

            <label htmlFor="repetir">Repetila</label>
            <input id="repetir" type="password" value={repetir}
              onChange={(e) => setRepetir(e.target.value)} autoComplete="new-password" />

            {error && <p className="login-error">{error}</p>}

            <button type="submit" disabled={cargando}>
              {cargando ? 'Guardando…' : 'Guardar contraseña'}
            </button>

            {/* si el enlace venció, le doy la salida */}
            {error.includes('venció') && (
              <Link to="/recuperar-clave" className="login-enlace">Pedir un enlace nuevo</Link>
            )}
          </>
        )}
      </form>
    </div>
  );
}

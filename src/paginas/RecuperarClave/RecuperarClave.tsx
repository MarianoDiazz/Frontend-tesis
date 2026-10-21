import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { solicitarRecuperacion } from '../../api/autenticacion.api';
import { mensajeDeError } from '../../utilidades/errores';
import '../Login/Login.css';

export default function RecuperarClave() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(''); // mensaje del backend cuando sale bien
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Ingresá tu email.');
      return;
    }
    setCargando(true);
    try {
      setEnviado(await solicitarRecuperacion(email.trim()));
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo procesar el pedido.'));
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="login-fondo">
      <form className="login-tarjeta" onSubmit={manejarEnvio}>
        <h1>Recuperar contraseña</h1>

        {enviado ? (
          // ya lo pidió: muestro la confirmación y nada más
          <p className="login-exito">{enviado}</p>
        ) : (
          <>
            <p className="login-subtitulo">Ingresá el email de tu cuenta y te enviamos un enlace para crear una contraseña nueva.</p>

            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} autoComplete="username" />

            {error && <p className="login-error">{error}</p>}

            <button type="submit" disabled={cargando}>
              {cargando ? 'Enviando…' : 'Enviar enlace'}
            </button>
          </>
        )}

        <Link to="/login" className="login-enlace">Volver al inicio de sesión</Link>
      </form>
    </div>
  );
}

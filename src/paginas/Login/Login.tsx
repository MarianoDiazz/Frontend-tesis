import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export default function Login() {
  const { iniciarSesion } = useAuth();
  const navegar = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault(); // evito que el form recargue la página
    setError('');

    if (!email || !password) {
      setError('Completá email y contraseña.');
      return;
    }

    setCargando(true);
    try {
      await iniciarSesion(email, password);
      navegar('/inicio');
    } catch (err) {
      // si el backend respondió, muestro su mensaje; si no, está apagado
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.mensaje);
      } else {
        setError('No se pudo conectar con el servidor.');
      }
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="login-fondo">
      <form className="login-tarjeta" onSubmit={manejarEnvio}>
        <h1>Consultorio</h1>
        <p className="login-subtitulo">Ingresá con tu cuenta</p>

        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email}
          onChange={(e) => setEmail(e.target.value)} autoComplete="username" />

        <label htmlFor="password">Contraseña</label>
        <input id="password" type="password" value={password}
          onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />

        {error && <p className="login-error">{error}</p>}

        <button type="submit" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
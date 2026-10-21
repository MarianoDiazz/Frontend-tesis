import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import clienteApi from '../api/clienteApi';
import type { Usuario } from '../tipos/usuario';
import { tokenVencido } from '../utilidades/sesion';

export type MotivoCierre = 'inactividad' | null;

interface ContextoAuth {
  usuario: Usuario | null;
  motivoCierre: MotivoCierre; // por qué se cerró la última sesión, para avisar en el login
  iniciarSesion: (email: string, password: string) => Promise<void>;
  cerrarSesion: (motivo?: MotivoCierre) => void;
}

const AuthContext = createContext<ContextoAuth | null>(null);

// al abrir la app recupero la sesión, pero solo si el token sigue vigente
function leerUsuarioGuardado(): Usuario | null {
  const token = localStorage.getItem('token');
  const guardado = localStorage.getItem('usuario');

  if (!token || !guardado || tokenVencido(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    return null;
  }
  return JSON.parse(guardado);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(leerUsuarioGuardado);
  const [motivoCierre, setMotivoCierre] = useState<MotivoCierre>(null);

  async function iniciarSesion(email: string, password: string) {
    const { data } = await clienteApi.post('/autenticacion/iniciar-sesion', { email, password });
    // guardo token y usuario para no perderlos al recargar
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    setMotivoCierre(null);
  }

  function cerrarSesion(motivo: MotivoCierre = null) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setMotivoCierre(motivo);
    setUsuario(null); // al quedar sin usuario, RutaProtegida lleva al login
  }

  return (
    <AuthContext.Provider value={{ usuario, motivoCierre, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

// atajo para leer la sesión desde cualquier pantalla
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth tiene que usarse dentro de AuthProvider');
  return contexto;
}

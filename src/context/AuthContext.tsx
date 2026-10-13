import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import clienteApi from '../api/clienteApi';
import type { Usuario } from '../tipos/usuario';

interface ContextoAuth {
  usuario: Usuario | null;
  iniciarSesion: (email: string, password: string) => Promise<void>;
  cerrarSesion: () => void;
}

const AuthContext = createContext<ContextoAuth | null>(null);

// si recargo la página, recupero el usuario guardado
function leerUsuarioGuardado(): Usuario | null {
  const guardado = localStorage.getItem('usuario');
  return guardado ? JSON.parse(guardado) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(leerUsuarioGuardado);

  async function iniciarSesion(email: string, password: string) {
    const { data } = await clienteApi.post('/autenticacion/iniciar-sesion', { email, password });
    // guardo token y usuario para no perderlos al recargar
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
  }

  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
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
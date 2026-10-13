import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Rol } from '../tipos/usuario';

interface Props {
  roles?: Rol[]; // si no paso roles, alcanza con estar logueado
}

export default function RutaProtegida({ roles }: Props) {
  const { usuario } = useAuth();

  // sin sesión, al login
  if (!usuario) return <Navigate to="/login" replace />;

  // con sesión pero sin permiso, al inicio
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/inicio" replace />;

  return <Outlet />;
}
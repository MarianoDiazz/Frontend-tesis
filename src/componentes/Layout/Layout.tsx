import { useCallback } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { menu } from '../../config/menu';
import { MINUTOS_INACTIVIDAD, SEGUNDOS_AVISO } from '../../config/sesion';
import { useInactividad } from '../../hooks/useInactividad';
import AvisoInactividad from '../AvisoInactividad/AvisoInactividad';
import './Layout.css';

export default function Layout() {
  const { usuario, cerrarSesion } = useAuth();
  const navegar = useNavigate();

  // si pasa el tiempo sin actividad, cierro la sesión indicando el motivo
  const cerrarPorInactividad = useCallback(() => cerrarSesion('inactividad'), [cerrarSesion]);

  const { restantes, seguir } = useInactividad(MINUTOS_INACTIVIDAD, SEGUNDOS_AVISO, cerrarPorInactividad);

  if (!usuario) return null;

  // me quedo solo con las opciones de mi rol
  const opciones = menu.filter((op) => op.roles.includes(usuario.rol));

  function salir() {
    cerrarSesion();
    navegar('/login');
  }

  return (
    <div className="layout">
      <aside className="layout-menu">
        <div className="layout-marca">Consultorio</div>

        <nav className="layout-nav">
          {opciones.map((op) => (
            <NavLink key={op.ruta} to={op.ruta} className="layout-link">
              {op.texto}
            </NavLink>
          ))}
        </nav>

        <div className="layout-usuario">
          <strong>{usuario.nombre} {usuario.apellido}</strong>
          <span>{usuario.rol}</span>
          <button onClick={salir}>Cerrar sesión</button>
        </div>
      </aside>

      {/* acá se dibuja la pantalla actual */}
      <main className="layout-contenido">
        <Outlet />
      </main>

      {restantes !== null && (
        <AvisoInactividad segundos={restantes} onSeguir={seguir} onSalir={salir} />
      )}
    </div>
  );
}

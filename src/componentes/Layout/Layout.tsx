import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { menu } from '../../config/menu';
import './Layout.css';

export default function Layout() {
  const { usuario, cerrarSesion } = useAuth();
  const navegar = useNavigate();

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
    </div>
  );
}
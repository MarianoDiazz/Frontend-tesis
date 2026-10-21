import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './paginas/Login/Login';
import RecuperarClave from './paginas/RecuperarClave/RecuperarClave';
import RestablecerClave from './paginas/RestablecerClave/RestablecerClave';
import Inicio from './paginas/Inicio/Inicio';
import Pacientes from './paginas/Pacientes/Pacientes';
import Agenda from './paginas/Agenda/Agenda';
import RutaProtegida from './componentes/RutaProtegida';
import Layout from './componentes/Layout/Layout';
import EnConstruccion from './componentes/EnConstruccion';

export default function App() {
  return (
    <Routes>
      {/* rutas públicas: no piden estar logueado */}
      <Route path="/login" element={<Login />} />
      <Route path="/recuperar-clave" element={<RecuperarClave />} />
      <Route path="/restablecer-clave" element={<RestablecerClave />} />

      {/* todo lo de adentro pide estar logueado y usa el menú */}
      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/reportes" element={<EnConstruccion titulo="Reportes" />} />

          <Route element={<RutaProtegida roles={['Recepcion', 'Medico']} />}>
            <Route path="/pacientes" element={<Pacientes />} />
          </Route>

          <Route element={<RutaProtegida roles={['Recepcion']} />}>
            <Route path="/turnos" element={<Agenda />} />
          </Route>

          <Route element={<RutaProtegida roles={['Medico']} />}>
            <Route path="/atencion" element={<EnConstruccion titulo="Atención" />} />
          </Route>

          <Route element={<RutaProtegida roles={['Admin']} />}>
            <Route path="/usuarios" element={<EnConstruccion titulo="Usuarios" />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

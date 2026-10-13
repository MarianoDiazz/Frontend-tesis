import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './paginas/Login/Login';
import Inicio from './paginas/Inicio/Inicio';
import RutaProtegida from './componentes/RutaProtegida';
import Layout from './componentes/Layout/Layout';
import EnConstruccion from './componentes/EnConstruccion';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* todo lo de adentro pide estar logueado y usa el menú */}
      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/reportes" element={<EnConstruccion titulo="Reportes" />} />

          <Route element={<RutaProtegida roles={['Recepcion', 'Medico']} />}>
            <Route path="/pacientes" element={<EnConstruccion titulo="Pacientes" />} />
          </Route>

          <Route element={<RutaProtegida roles={['Recepcion']} />}>
            <Route path="/turnos" element={<EnConstruccion titulo="Agenda" />} />
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
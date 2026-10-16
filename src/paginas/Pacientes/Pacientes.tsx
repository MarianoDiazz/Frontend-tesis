import { useEffect, useState } from 'react';
import { listarPacientes, darDeBajaPaciente } from '../../api/pacientes.api';
import { listarObrasSociales } from '../../api/obrasSociales.api';
import type { Paciente } from '../../tipos/paciente';
import type { ObraSocial } from '../../tipos/obraSocial';
import { formatearDni } from '../../utilidades/formato';
import { mensajeDeError } from '../../utilidades/errores';
import { useAuth } from '../../context/AuthContext';
import PanelLateral from '../../componentes/PanelLateral/PanelLateral';
import Confirmacion from '../../componentes/Confirmacion/Confirmacion';
import FormularioPaciente from './FormularioPaciente';
import './Pacientes.css';

const ID_PARTICULAR = 1;

export default function Pacientes() {
  const { usuario } = useAuth();
  const puedeEditar = usuario?.rol === 'Recepcion'; // el médico solo consulta

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [obrasSociales, setObrasSociales] = useState<ObraSocial[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [recarga, setRecarga] = useState(0); // lo aumento para volver a pedir la lista

  const [panelAbierto, setPanelAbierto] = useState(false);
  const [editando, setEditando] = useState<Paciente | null>(null);
  const [aBorrar, setABorrar] = useState<Paciente | null>(null);
  const [borrando, setBorrando] = useState(false);
  const [aviso, setAviso] = useState('');

  // listado: se pide al entrar, al buscar y después de guardar
  useEffect(() => {
    const espera = setTimeout(async () => {
      setCargando(true);
      setError('');
      try {
        setPacientes(await listarPacientes(busqueda));
      } catch {
        setError('No se pudo cargar el listado. Revisá que el servidor esté encendido.');
      } finally {
        setCargando(false);
      }
    }, 300);
    return () => clearTimeout(espera);
  }, [busqueda, recarga]);

  // las obras sociales solo las necesito si puedo editar
  useEffect(() => {
    if (!puedeEditar) return;
    listarObrasSociales()
      .then(setObrasSociales)
      .catch(() => setError('No se pudieron cargar las obras sociales.'));
  }, [puedeEditar]);

  // el aviso se borra solo a los 3 segundos
  useEffect(() => {
    if (!aviso) return;
    const espera = setTimeout(() => setAviso(''), 3000);
    return () => clearTimeout(espera);
  }, [aviso]);

  function abrirNuevo() {
    setEditando(null);
    setPanelAbierto(true);
  }

  function abrirEdicion(p: Paciente) {
    setEditando(p);
    setPanelAbierto(true);
  }

  function alGuardar(mensaje: string) {
    setPanelAbierto(false);
    setAviso(mensaje);
    setRecarga((r) => r + 1);
  }

  async function confirmarBaja() {
    if (!aBorrar) return;
    setBorrando(true);
    try {
      await darDeBajaPaciente(aBorrar.id_paciente);
      setAviso(`${aBorrar.apellido}, ${aBorrar.nombre} fue dado de baja.`);
      setRecarga((r) => r + 1);
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo dar de baja al paciente.'));
    } finally {
      setBorrando(false);
      setABorrar(null);
    }
  }

  const cantidad = pacientes.length === 1 ? '1 paciente activo' : `${pacientes.length} pacientes activos`;

  return (
    <section>
      <header className="pagina-encabezado">
        <div>
          <h1>Pacientes</h1>
          <p className="pagina-detalle">{cargando ? 'Buscando…' : cantidad}</p>
        </div>
        {puedeEditar && (
          <button className="btn btn-primario" onClick={abrirNuevo}>Nuevo paciente</button>
        )}
      </header>

      <div className="campo pacientes-buscador">
        <label htmlFor="buscar">Buscar paciente</label>
        <input id="buscar" type="search" placeholder="Apellido, nombre o DNI"
          value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      </div>

      {error && <p className="mensaje-error">{error}</p>}

      {!error && !cargando && pacientes.length === 0 && (
        <div className="estado-vacio">
          {busqueda
            ? `No hay pacientes que coincidan con "${busqueda}". Probá con el DNI o solo el apellido.`
            : 'Todavía no hay pacientes cargados.'}
        </div>
      )}

      {pacientes.length > 0 && (
        <div className={cargando ? 'tabla-contenedor cargando' : 'tabla-contenedor'}>
          <table className="tabla">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>DNI</th>
                <th>Teléfono</th>
                <th>Cobertura</th>
                {puedeEditar && <th aria-label="Acciones"></th>}
              </tr>
            </thead>
            <tbody>
              {pacientes.map((p) => (
                <tr key={p.id_paciente}>
                  <td>
                    <span className="paciente-nombre">{p.apellido}, {p.nombre}</span>
                    {p.email && <span className="celda-secundaria">{p.email}</span>}
                  </td>
                  <td>{formatearDni(p.dni)}</td>
                  <td>{p.telefono || '—'}</td>
                  <td>
                    <span className={p.id_obra_social === ID_PARTICULAR ? 'etiqueta etiqueta-neutra' : 'etiqueta'}>
                      {p.nombre_obra_social}
                    </span>
                    {p.numero_afiliado && <span className="celda-secundaria">Afiliado {p.numero_afiliado}</span>}
                  </td>
                  {puedeEditar && (
                    <td className="celda-acciones">
                      <button className="btn-texto" onClick={() => abrirEdicion(p)}>Editar</button>
                      <button className="btn-texto peligro" onClick={() => setABorrar(p)}>Dar de baja</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {panelAbierto && (
        <PanelLateral titulo={editando ? 'Editar paciente' : 'Nuevo paciente'} onCerrar={() => setPanelAbierto(false)}>
          <FormularioPaciente
            key={editando?.id_paciente ?? 'nuevo'}
            paciente={editando}
            obrasSociales={obrasSociales}
            onGuardado={alGuardar}
            onCancelar={() => setPanelAbierto(false)}
          />
        </PanelLateral>
      )}

      {aBorrar && (
        <Confirmacion
          titulo="Dar de baja paciente"
          mensaje={`${aBorrar.apellido}, ${aBorrar.nombre} dejará de aparecer en el listado. Sus turnos y consultas anteriores se conservan.`}
          textoConfirmar="Dar de baja"
          procesando={borrando}
          onConfirmar={confirmarBaja}
          onCancelar={() => setABorrar(null)}
        />
      )}

      {aviso && <div className="aviso" role="status">{aviso}</div>}
    </section>
  );
}
import { useEffect, useState } from 'react';
import { listarPacientes } from '../../api/pacientes.api';
import type { Paciente } from '../../tipos/paciente';
import { formatearDni } from '../../utilidades/formato';
import './Pacientes.css';

const ID_PARTICULAR = 1; // el registro fijo "Particular" de obras_sociales

export default function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // espero a que deje de tipear antes de buscar
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

    // si sigue tipeando, cancelo la búsqueda anterior
    return () => clearTimeout(espera);
  }, [busqueda]);

  const cantidad = pacientes.length === 1 ? '1 paciente activo' : `${pacientes.length} pacientes activos`;

  return (
    <section>
      <header className="pagina-encabezado">
        <div>
          <h1>Pacientes</h1>
          <p className="pagina-detalle">{cargando ? 'Buscando…' : cantidad}</p>
        </div>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
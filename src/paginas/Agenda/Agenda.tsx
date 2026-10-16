import { useEffect, useState } from 'react';
import { cancelarTurno, listarMedicos, listarTiposTurno, listarTurnos } from '../../api/turnos.api';
import type { Medico, TipoTurno, Turno } from '../../tipos/turno';
import { mensajeDeError } from '../../utilidades/errores';
import { fechaLarga, hora, hoyISO, pesos, sumarDias } from '../../utilidades/fechas';
import EstadoTurno from '../../componentes/EstadoTurno';
import PanelLateral from '../../componentes/PanelLateral/PanelLateral';
import Confirmacion from '../../componentes/Confirmacion/Confirmacion';
import FormularioTurno from './FormularioTurno';
import FormularioCobro from './FormularioCobro';
import './Agenda.css';

export default function Agenda() {
  const [fecha, setFecha] = useState(hoyISO());
  const [idMedico, setIdMedico] = useState('');
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [tipos, setTipos] = useState<TipoTurno[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [recarga, setRecarga] = useState(0);

  const [nuevoAbierto, setNuevoAbierto] = useState(false);
  const [aCobrar, setACobrar] = useState<Turno | null>(null);
  const [aCancelar, setACancelar] = useState<Turno | null>(null);
  const [cancelando, setCancelando] = useState(false);
  const [aviso, setAviso] = useState('');

  // turnos del día elegido; se vuelven a pedir al cambiar día, médico o al guardar
  useEffect(() => {
    async function cargar() {
      setCargando(true);
      setError('');
      try {
        setTurnos(await listarTurnos({ fecha, id_medico: idMedico }));
      } catch {
        setError('No se pudo cargar la agenda. Revisá que el servidor esté encendido.');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [fecha, idMedico, recarga]);

  // médicos y tipos de turno: los pido una sola vez, a la vez
  useEffect(() => {
    Promise.all([listarMedicos(), listarTiposTurno()])
      .then(([m, t]) => {
        setMedicos(m);
        setTipos(t);
      })
      .catch(() => setError('No se pudieron cargar médicos y tipos de turno.'));
  }, []);

  useEffect(() => {
    if (!aviso) return;
    const espera = setTimeout(() => setAviso(''), 3000);
    return () => clearTimeout(espera);
  }, [aviso]);

  function alGuardar(mensaje: string) {
    setNuevoAbierto(false);
    setACobrar(null);
    setAviso(mensaje);
    setRecarga((r) => r + 1);
  }

  async function confirmarCancelacion() {
    if (!aCancelar) return;
    setCancelando(true);
    try {
      await cancelarTurno(aCancelar.id_turno);
      setAviso('Turno cancelado.');
      setRecarga((r) => r + 1);
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo cancelar el turno.'));
    } finally {
      setCancelando(false);
      setACancelar(null);
    }
  }

  // resumen del día: cuántos turnos activos y cuántos cobrados
  const activos = turnos.filter((t) => t.estado !== 'Cancelado');
  const cobrados = activos.filter((t) => t.estado_pago === 'Cobrado').length;
  const resumen = activos.length === 1 ? '1 turno' : `${activos.length} turnos`;
  const esHoy = fecha === hoyISO();

  return (
    <section>
      <header className="pagina-encabezado">
        <div>
          <h1 className="agenda-titulo">
            {fechaLarga(fecha)}
            {esHoy && <span className="etiqueta agenda-hoy">Hoy</span>}
          </h1>
          <p className="pagina-detalle">
            {cargando ? 'Cargando…' : `${resumen}, ${cobrados} ${cobrados === 1 ? 'cobrado' : 'cobrados'}`}
          </p>
        </div>
        <button className="btn btn-primario" onClick={() => setNuevoAbierto(true)}>Nuevo turno</button>
      </header>

      <div className="agenda-controles">
        <div className="agenda-dia" role="group" aria-label="Elegir día">
          <button className="btn btn-secundario agenda-flecha" onClick={() => setFecha(sumarDias(fecha, -1))}
            aria-label="Día anterior">‹</button>
          <input type="date" value={fecha} onChange={(e) => e.target.value && setFecha(e.target.value)}
            aria-label="Fecha" />
          <button className="btn btn-secundario agenda-flecha" onClick={() => setFecha(sumarDias(fecha, 1))}
            aria-label="Día siguiente">›</button>
          {!esHoy && <button className="btn-texto" onClick={() => setFecha(hoyISO())}>Volver a hoy</button>}
        </div>

        {medicos.length > 1 && (
          <div className="campo agenda-medico">
            <label htmlFor="filtro-medico">Médico</label>
            <select id="filtro-medico" value={idMedico} onChange={(e) => setIdMedico(e.target.value)}>
              <option value="">Todos</option>
              {medicos.map((m) => (
                <option key={m.id_usuario} value={m.id_usuario}>{m.apellido}, {m.nombre}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && <p className="mensaje-error">{error}</p>}

      {!error && !cargando && turnos.length === 0 && (
        <div className="estado-vacio">No hay turnos para este día. Usá "Nuevo turno" para agendar uno.</div>
      )}

      {turnos.length > 0 && (
        <div className={cargando ? 'tabla-contenedor cargando' : 'tabla-contenedor'}>
          <table className="tabla">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Paciente</th>
                <th>Turno</th>
                <th>Estado</th>
                <th>Cobro</th>
                <th aria-label="Acciones"></th>
              </tr>
            </thead>
            <tbody>
              {turnos.map((t) => {
                const cancelado = t.estado === 'Cancelado';
                const sePuedeCancelar = t.estado === 'Pendiente' || t.estado === 'En Espera';
                return (
                  <tr key={t.id_turno} className={cancelado ? 'fila-cancelada' : ''}>
                    <td className="agenda-hora">{hora(t.fecha_hora)}</td>
                    <td>
                      <span className="turno-paciente">{t.apellido_paciente}, {t.nombre_paciente}</span>
                      <span className="celda-secundaria">{t.nombre_obra_social}</span>
                    </td>
                    <td>
                      {t.nombre_tipo_turno}
                      <span className="celda-secundaria">
                        {t.duracion_estimada_min} min{medicos.length > 1 ? `, Dr. ${t.apellido_medico}` : ''}
                      </span>
                      {t.motivo && <span className="celda-secundaria">{t.motivo}</span>}
                    </td>
                    <td><EstadoTurno estado={t.estado} /></td>
                    <td>
                      {t.estado_pago === 'Cobrado' && t.monto_pago ? (
                        <>
                          <span className="cobro-ok">{pesos(Number(t.monto_pago))}</span>
                          <span className="celda-secundaria">{t.metodo_pago}</span>
                        </>
                      ) : (
                        <span className="cobro-pendiente">{cancelado ? '—' : 'Sin cobrar'}</span>
                      )}
                    </td>
                    <td className="celda-acciones">
                      {!cancelado && (
                        <button className="btn-texto" onClick={() => setACobrar(t)}>
                          {t.estado_pago === 'Cobrado' ? 'Editar cobro' : 'Cobrar'}
                        </button>
                      )}
                      {sePuedeCancelar && (
                        <button className="btn-texto peligro" onClick={() => setACancelar(t)}>Cancelar</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {nuevoAbierto && (
        <PanelLateral titulo="Nuevo turno" onCerrar={() => setNuevoAbierto(false)}>
          <FormularioTurno fechaInicial={fecha} medicos={medicos} tipos={tipos}
            onGuardado={alGuardar} onCancelar={() => setNuevoAbierto(false)} />
        </PanelLateral>
      )}

      {aCobrar && (
        <PanelLateral titulo="Registrar cobro" onCerrar={() => setACobrar(null)}>
          <FormularioCobro key={aCobrar.id_turno} turno={aCobrar}
            onGuardado={alGuardar} onCancelar={() => setACobrar(null)} />
        </PanelLateral>
      )}

      {aCancelar && (
        <Confirmacion
          titulo="Cancelar turno"
          mensaje={`El turno de ${aCancelar.apellido_paciente}, ${aCancelar.nombre_paciente} a las ${hora(aCancelar.fecha_hora)} quedará cancelado y el horario vuelve a estar libre.`}
          textoConfirmar="Cancelar turno"
          procesando={cancelando}
          onConfirmar={confirmarCancelacion}
          onCancelar={() => setACancelar(null)}
        />
      )}

      {aviso && <div className="aviso" role="status">{aviso}</div>}
    </section>
  );
}

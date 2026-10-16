import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { crearTurno, listarTurnos } from '../../api/turnos.api';
import type { Medico, TipoTurno } from '../../tipos/turno';
import type { Paciente } from '../../tipos/paciente';
import { mensajeDeError } from '../../utilidades/errores';
import { aMinutos, desdeMinutos, hora, hoyISO } from '../../utilidades/fechas';
import BuscadorPaciente from '../../componentes/BuscadorPaciente/BuscadorPaciente';

interface Props {
  fechaInicial: string;
  medicos: Medico[];
  tipos: TipoTurno[];
  onGuardado: (mensaje: string) => void;
  onCancelar: () => void;
}

export default function FormularioTurno({ fechaInicial, medicos, tipos, onGuardado, onCancelar }: Props) {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [form, setForm] = useState({
    // si hay un solo médico lo dejo elegido
    id_medico: medicos.length === 1 ? String(medicos[0].id_usuario) : '',
    id_tipo_turno: '',
    fecha: fechaInicial < hoyISO() ? hoyISO() : fechaInicial,
    hora: '',
    motivo: '',
  });
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [guardando, setGuardando] = useState(false);

  function cambiar(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validar() {
    const nuevos: Record<string, string> = {};
    if (!paciente) nuevos.paciente = 'Buscá y elegí un paciente.';
    if (!form.id_medico) nuevos.id_medico = 'Elegí un médico.';
    if (!form.id_tipo_turno) nuevos.id_tipo_turno = 'Elegí el tipo de turno.';
    if (!form.fecha) nuevos.fecha = 'Elegí una fecha.';
    if (!form.hora) nuevos.hora = 'Elegí un horario.';
    if (form.fecha && form.hora && new Date(`${form.fecha}T${form.hora}`) < new Date()) {
      nuevos.hora = 'Ese horario ya pasó.';
    }
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  // reviso que el médico no tenga otro turno que se pise con este
  async function buscarChoque(): Promise<string | null> {
    const delDia = await listarTurnos({ fecha: form.fecha, id_medico: form.id_medico });
    const tipo = tipos.find((t) => t.id_tipo_turno === Number(form.id_tipo_turno));
    const inicio = aMinutos(form.hora);
    const fin = inicio + (tipo?.duracion_estimada_min ?? 30);

    const choque = delDia.find((t) => {
      if (t.estado === 'Cancelado') return false;
      const otroInicio = aMinutos(hora(t.fecha_hora));
      const otroFin = otroInicio + t.duracion_estimada_min;
      return inicio < otroFin && otroInicio < fin; // los dos rangos se pisan
    });

    if (!choque) return null;
    const desde = hora(choque.fecha_hora);
    const hasta = desdeMinutos(aMinutos(desde) + choque.duracion_estimada_min);
    return `El médico ya tiene un turno de ${desde} a ${hasta} (${choque.apellido_paciente}, ${choque.nombre_paciente}).`;
  }

  async function guardar(e: FormEvent) {
    e.preventDefault();
    setErrorGeneral('');
    if (!validar() || !paciente) return;

    setGuardando(true);
    try {
      const choque = await buscarChoque();
      if (choque) {
        setErrores({ hora: choque });
        setGuardando(false);
        return;
      }
      await crearTurno({
        id_paciente: paciente.id_paciente,
        id_medico: Number(form.id_medico),
        id_tipo_turno: Number(form.id_tipo_turno),
        fecha_hora: `${form.fecha} ${form.hora}:00`,
        motivo: form.motivo.trim() || null,
      });
      onGuardado(`Turno agendado para ${paciente.apellido}, ${paciente.nombre}.`);
    } catch (err) {
      setErrorGeneral(mensajeDeError(err, 'No se pudo agendar el turno.'));
      setGuardando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={guardar} noValidate>
      <BuscadorPaciente seleccionado={paciente} onSeleccionar={setPaciente} error={errores.paciente} />

      <div className="campo">
        <label htmlFor="id_medico">Médico</label>
        <select id="id_medico" name="id_medico" value={form.id_medico} onChange={cambiar} aria-invalid={!!errores.id_medico}>
          <option value="">Elegí una opción</option>
          {medicos.map((m) => (
            <option key={m.id_usuario} value={m.id_usuario}>{m.apellido}, {m.nombre}</option>
          ))}
        </select>
        {errores.id_medico && <span className="campo-error">{errores.id_medico}</span>}
      </div>

      <div className="campo">
        <label htmlFor="id_tipo_turno">Tipo de turno</label>
        <select id="id_tipo_turno" name="id_tipo_turno" value={form.id_tipo_turno} onChange={cambiar} aria-invalid={!!errores.id_tipo_turno}>
          <option value="">Elegí una opción</option>
          {tipos.map((t) => (
            <option key={t.id_tipo_turno} value={t.id_tipo_turno}>{t.nombre} ({t.duracion_estimada_min} min)</option>
          ))}
        </select>
        {errores.id_tipo_turno && <span className="campo-error">{errores.id_tipo_turno}</span>}
      </div>

      <div className="formulario-fila">
        <div className="campo">
          <label htmlFor="fecha">Fecha</label>
          <input id="fecha" name="fecha" type="date" min={hoyISO()} value={form.fecha} onChange={cambiar} aria-invalid={!!errores.fecha} />
          {errores.fecha && <span className="campo-error">{errores.fecha}</span>}
        </div>
        <div className="campo">
          <label htmlFor="hora">Hora</label>
          <input id="hora" name="hora" type="time" step={900} value={form.hora} onChange={cambiar} aria-invalid={!!errores.hora} />
        </div>
      </div>
      {/* el error de hora va abajo de la fila porque puede ser largo */}
      {errores.hora && <span className="campo-error">{errores.hora}</span>}

      <div className="campo">
        <label htmlFor="motivo">Motivo (opcional)</label>
        <textarea id="motivo" name="motivo" rows={3} value={form.motivo} onChange={cambiar} />
      </div>

      {errorGeneral && <p className="mensaje-error">{errorGeneral}</p>}

      <div className="formulario-acciones">
        <button type="button" className="btn btn-secundario" onClick={onCancelar} disabled={guardando}>Cancelar</button>
        <button type="submit" className="btn btn-primario" disabled={guardando}>
          {guardando ? 'Agendando…' : 'Agendar turno'}
        </button>
      </div>
    </form>
  );
}

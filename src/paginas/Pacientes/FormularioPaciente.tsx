import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { crearPaciente, actualizarPaciente } from '../../api/pacientes.api';
import type { Paciente } from '../../tipos/paciente';
import type { ObraSocial } from '../../tipos/obraSocial';
import { mensajeDeError } from '../../utilidades/errores';
import Campo from '../../componentes/Campo';

const ID_PARTICULAR = 1;

interface Props {
  paciente: Paciente | null; // null = paciente nuevo
  obrasSociales: ObraSocial[];
  onGuardado: (mensaje: string) => void;
  onCancelar: () => void;
}

export default function FormularioPaciente({ paciente, obrasSociales, onGuardado, onCancelar }: Props) {
  // si edito arranco con sus datos, si es nuevo arranco vacío
  const [form, setForm] = useState({
    dni: paciente?.dni ?? '',
    apellido: paciente?.apellido ?? '',
    nombre: paciente?.nombre ?? '',
    telefono: paciente?.telefono ?? '',
    email: paciente?.email ?? '',
    id_obra_social: paciente ? String(paciente.id_obra_social) : '',
    numero_afiliado: paciente?.numero_afiliado ?? '',
  });
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [guardando, setGuardando] = useState(false);

  const esParticular = form.id_obra_social === String(ID_PARTICULAR);

  // un solo manejador para todos los campos, uso el name del input
  function cambiar(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validar() {
    const nuevos: Record<string, string> = {};
    if (!/^\d{7,8}$/.test(form.dni)) nuevos.dni = 'Ingresá 7 u 8 números, sin puntos.';
    if (!form.apellido.trim()) nuevos.apellido = 'El apellido es obligatorio.';
    if (!form.nombre.trim()) nuevos.nombre = 'El nombre es obligatorio.';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) nuevos.email = 'Revisá el formato del email.';
    if (!form.id_obra_social) nuevos.id_obra_social = 'Elegí una cobertura.';
    if (form.id_obra_social && !esParticular && !form.numero_afiliado.trim()) {
      nuevos.numero_afiliado = 'Con obra social, el número de afiliado es obligatorio.';
    }
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  async function guardar(e: FormEvent) {
    e.preventDefault();
    setErrorGeneral('');
    if (!validar()) return;

    // limpio espacios y mando null en lo que quedó vacío
    const datos = {
      dni: form.dni,
      apellido: form.apellido.trim(),
      nombre: form.nombre.trim(),
      telefono: form.telefono.trim() || null,
      email: form.email.trim() || null,
      id_obra_social: Number(form.id_obra_social),
      numero_afiliado: esParticular ? null : form.numero_afiliado.trim(),
    };

    setGuardando(true);
    try {
      if (paciente) {
        await actualizarPaciente(paciente.id_paciente, datos);
        onGuardado('Paciente actualizado.');
      } else {
        await crearPaciente(datos);
        onGuardado('Paciente registrado.');
      }
    } catch (err) {
      setErrorGeneral(mensajeDeError(err, 'No se pudo guardar el paciente.'));
      setGuardando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={guardar} noValidate>
      <Campo id="dni" etiqueta="DNI" valor={form.dni} error={errores.dni} onChange={cambiar} />

      <div className="formulario-fila">
        <Campo id="apellido" etiqueta="Apellido" valor={form.apellido} error={errores.apellido} onChange={cambiar} />
        <Campo id="nombre" etiqueta="Nombre" valor={form.nombre} error={errores.nombre} onChange={cambiar} />
      </div>

      <Campo id="telefono" etiqueta="Teléfono (opcional)" tipo="tel" valor={form.telefono} onChange={cambiar} />
      <Campo id="email" etiqueta="Email (opcional)" tipo="email" valor={form.email} error={errores.email} onChange={cambiar} />

      <div className="campo">
        <label htmlFor="id_obra_social">Cobertura</label>
        <select id="id_obra_social" name="id_obra_social" value={form.id_obra_social}
          onChange={cambiar} aria-invalid={!!errores.id_obra_social}>
          <option value="">Elegí una opción</option>
          {obrasSociales.map((os) => (
            <option key={os.id_obra_social} value={os.id_obra_social}>{os.nombre}</option>
          ))}
        </select>
        {errores.id_obra_social && <span className="campo-error">{errores.id_obra_social}</span>}
      </div>

      {/* el número de afiliado solo aparece si tiene obra social */}
      {form.id_obra_social && !esParticular && (
        <Campo id="numero_afiliado" etiqueta="Número de afiliado" valor={form.numero_afiliado}
          error={errores.numero_afiliado} onChange={cambiar} />
      )}

      {errorGeneral && <p className="mensaje-error">{errorGeneral}</p>}

      <div className="formulario-acciones">
        <button type="button" className="btn btn-secundario" onClick={onCancelar} disabled={guardando}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primario" disabled={guardando}>
          {guardando ? 'Guardando…' : paciente ? 'Guardar cambios' : 'Registrar paciente'}
        </button>
      </div>
    </form>
  );
}
import { useState } from 'react';
import type { FormEvent } from 'react';
import { registrarPago } from '../../api/turnos.api';
import type { MetodoPago, Turno } from '../../tipos/turno';
import { mensajeDeError } from '../../utilidades/errores';
import { diaDe, fechaLarga, hora, pesos } from '../../utilidades/fechas';

const METODOS: MetodoPago[] = ['Efectivo', 'Transferencia', 'Débito'];

interface Props {
  turno: Turno;
  onGuardado: (mensaje: string) => void;
  onCancelar: () => void;
}

export default function FormularioCobro({ turno, onGuardado, onCancelar }: Props) {
  // si ya estaba cobrado, arranco con lo que se había cargado
  const [monto, setMonto] = useState(turno.monto_pago ? String(Number(turno.monto_pago)) : '');
  const [metodo, setMetodo] = useState<MetodoPago>(turno.metodo_pago ?? 'Efectivo');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function guardar(e: FormEvent) {
    e.preventDefault();
    const valor = Number(monto);
    if (!monto || isNaN(valor) || valor <= 0) {
      setError('Ingresá un monto mayor a cero.');
      return;
    }
    setError('');
    setGuardando(true);
    try {
      await registrarPago(turno.id_turno, valor, metodo);
      onGuardado(`Cobro de ${pesos(valor)} registrado.`);
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo registrar el cobro.'));
      setGuardando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={guardar} noValidate>
      <div className="cobro-resumen">
        <strong>{turno.apellido_paciente}, {turno.nombre_paciente}</strong>
        <span className="celda-secundaria">
          {turno.nombre_tipo_turno}, {fechaLarga(diaDe(turno.fecha_hora))} a las {hora(turno.fecha_hora)}
        </span>
        <span className="celda-secundaria">Cobertura: {turno.nombre_obra_social}</span>
      </div>

      <div className="campo">
        <label htmlFor="monto">Monto</label>
        <input id="monto" type="number" min="0" step="0.01" inputMode="decimal"
          value={monto} onChange={(e) => setMonto(e.target.value)} aria-invalid={!!error} />
      </div>

      <fieldset className="opciones">
        <legend>Medio de pago</legend>
        {METODOS.map((m) => (
          <label key={m} className="opcion">
            <input type="radio" name="metodo" value={m} checked={metodo === m} onChange={() => setMetodo(m)} />
            <span>{m}</span>
          </label>
        ))}
      </fieldset>

      {error && <p className="mensaje-error">{error}</p>}

      <div className="formulario-acciones">
        <button type="button" className="btn btn-secundario" onClick={onCancelar} disabled={guardando}>Cancelar</button>
        <button type="submit" className="btn btn-primario" disabled={guardando}>
          {guardando ? 'Registrando…' : 'Registrar cobro'}
        </button>
      </div>
    </form>
  );
}

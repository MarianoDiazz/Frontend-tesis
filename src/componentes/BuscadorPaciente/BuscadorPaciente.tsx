import { useEffect, useState } from 'react';
import { listarPacientes } from '../../api/pacientes.api';
import type { Paciente } from '../../tipos/paciente';
import { formatearDni } from '../../utilidades/formato';
import './BuscadorPaciente.css';

interface Props {
  seleccionado: Paciente | null;
  onSeleccionar: (paciente: Paciente | null) => void;
  error?: string;
}

export default function BuscadorPaciente({ seleccionado, onSeleccionar, error }: Props) {
  const [texto, setTexto] = useState('');
  const [resultados, setResultados] = useState<Paciente[]>([]);
  const [buscando, setBuscando] = useState(false);

  // busco recién con 2 letras y espero a que deje de tipear
  useEffect(() => {
    if (texto.trim().length < 2) {
      setResultados([]);
      return;
    }
    const espera = setTimeout(async () => {
      setBuscando(true);
      try {
        setResultados(await listarPacientes(texto.trim()));
      } catch {
        setResultados([]);
      } finally {
        setBuscando(false);
      }
    }, 300);
    return () => clearTimeout(espera);
  }, [texto]);

  // si ya eligió, muestro el paciente con opción de cambiarlo
  if (seleccionado) {
    return (
      <div className="campo">
        <span className="buscador-etiqueta">Paciente</span>
        <div className="buscador-elegido">
          <div>
            <strong>{seleccionado.apellido}, {seleccionado.nombre}</strong>
            <span className="celda-secundaria">
              DNI {formatearDni(seleccionado.dni)}, {seleccionado.nombre_obra_social}
            </span>
          </div>
          <button type="button" className="btn-texto" onClick={() => onSeleccionar(null)}>Cambiar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="campo">
      <label htmlFor="buscar-paciente">Paciente</label>
      <input id="buscar-paciente" type="search" placeholder="Apellido, nombre o DNI"
        value={texto} onChange={(e) => setTexto(e.target.value)} aria-invalid={!!error} autoComplete="off" />
      {error && <span className="campo-error">{error}</span>}

      {texto.trim().length >= 2 && (
        <ul className="buscador-resultados">
          {buscando && <li className="buscador-vacio">Buscando…</li>}
          {!buscando && resultados.length === 0 && (
            <li className="buscador-vacio">Sin resultados. Si es nuevo, registralo primero en Pacientes.</li>
          )}
          {!buscando && resultados.map((p) => (
            <li key={p.id_paciente}>
              <button type="button" onClick={() => onSeleccionar(p)}>
                <strong>{p.apellido}, {p.nombre}</strong>
                <span className="celda-secundaria">DNI {formatearDni(p.dni)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

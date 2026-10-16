import clienteApi from './clienteApi';
import type { EstadoTurno, Medico, MetodoPago, TipoTurno, Turno, TurnoDatos } from '../tipos/turno';

interface FiltrosTurnos {
  fecha?: string;
  id_medico?: string;
}

// solo mando los filtros que tienen valor
export async function listarTurnos(filtros: FiltrosTurnos): Promise<Turno[]> {
  const params: Record<string, string> = {};
  if (filtros.fecha) params.fecha = filtros.fecha;
  if (filtros.id_medico) params.id_medico = filtros.id_medico;
  const { data } = await clienteApi.get('/turnos', { params });
  return data.datos;
}

export async function crearTurno(datos: TurnoDatos): Promise<void> {
  await clienteApi.post('/turnos', datos);
}

// el backend no borra el turno, le pone estado Cancelado
export async function cancelarTurno(id: number): Promise<void> {
  await clienteApi.delete(`/turnos/${id}`);
}

export async function cambiarEstadoTurno(id: number, estado: EstadoTurno): Promise<void> {
  await clienteApi.patch(`/turnos/${id}/estado`, { estado });
}

export async function registrarPago(id_turno: number, monto: number, metodo_pago: MetodoPago): Promise<void> {
  await clienteApi.post('/pagos', { id_turno, monto, metodo_pago });
}

// catálogos para los selects del formulario
export async function listarMedicos(): Promise<Medico[]> {
  const { data } = await clienteApi.get('/usuarios/medicos');
  return data.datos;
}

export async function listarTiposTurno(): Promise<TipoTurno[]> {
  const { data } = await clienteApi.get('/tipos-turno');
  return data.datos;
}

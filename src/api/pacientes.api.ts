import clienteApi from './clienteApi';
import type { Paciente, PacienteDatos } from '../tipos/paciente';

// si hay búsqueda la mando como ?busqueda=...
export async function listarPacientes(busqueda = ''): Promise<Paciente[]> {
  const { data } = await clienteApi.get('/pacientes', {
    params: busqueda ? { busqueda } : {},
  });
  return data.datos;
}

// devuelvo el mensaje del backend: puede ser alta nueva o reactivación
export async function crearPaciente(datos: PacienteDatos): Promise<string> {
  const { data } = await clienteApi.post('/pacientes', datos);
  return data.mensaje;
}
export async function actualizarPaciente(id: number, datos: PacienteDatos): Promise<void> {
  await clienteApi.put(`/pacientes/${id}`, datos);
}

// baja lógica: el backend pone activo = 0, no borra
export async function darDeBajaPaciente(id: number): Promise<void> {
  await clienteApi.delete(`/pacientes/${id}`);
}
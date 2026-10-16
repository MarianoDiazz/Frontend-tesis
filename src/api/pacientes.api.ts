import clienteApi from './clienteApi';
import type { Paciente, PacienteDatos } from '../tipos/paciente';

// si hay búsqueda la mando como ?busqueda=...
export async function listarPacientes(busqueda = ''): Promise<Paciente[]> {
  const { data } = await clienteApi.get('/pacientes', {
    params: busqueda ? { busqueda } : {},
  });
  return data.datos;
}

export async function crearPaciente(datos: PacienteDatos): Promise<void> {
  await clienteApi.post('/pacientes', datos);
}

export async function actualizarPaciente(id: number, datos: PacienteDatos): Promise<void> {
  await clienteApi.put(`/pacientes/${id}`, datos);
}

// baja lógica: el backend pone activo = 0, no borra
export async function darDeBajaPaciente(id: number): Promise<void> {
  await clienteApi.delete(`/pacientes/${id}`);
}
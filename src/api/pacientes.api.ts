import clienteApi from './clienteApi';
import type { Paciente } from '../tipos/paciente.ts';

// si hay búsqueda la mando como ?busqueda=...
export async function listarPacientes(busqueda = ''): Promise<Paciente[]> {
  const { data } = await clienteApi.get('/pacientes', {
    params: busqueda ? { busqueda } : {},
  });
  return data.datos;
}
import clienteApi from './clienteApi';
import type { ObraSocial } from '../tipos/obraSocial';

export async function listarObrasSociales(): Promise<ObraSocial[]> {
  const { data } = await clienteApi.get('/obras-sociales');
  return data.datos;
}
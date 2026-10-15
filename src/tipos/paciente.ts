// así viene cada paciente desde GET /api/pacientes
export interface Paciente {
  id_paciente: number;
  dni: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  email: string | null;
  numero_afiliado: string | null;
  id_obra_social: number;
  nombre_obra_social: string;
  sigla_obra_social: string | null;
}
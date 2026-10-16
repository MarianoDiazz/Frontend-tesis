export type EstadoTurno = 'Pendiente' | 'En Espera' | 'En Consulta' | 'Atendido' | 'Cancelado';
export type MetodoPago = 'Efectivo' | 'Transferencia' | 'Débito';

// así viene cada turno desde GET /api/turnos
export interface Turno {
  id_turno: number;
  fecha_hora: string;
  motivo: string | null;
  estado: EstadoTurno;
  id_paciente: number;
  dni_paciente: string;
  nombre_paciente: string;
  apellido_paciente: string;
  telefono_paciente: string | null;
  nombre_obra_social: string;
  id_medico: number;
  nombre_medico: string;
  apellido_medico: string;
  id_tipo_turno: number;
  nombre_tipo_turno: string;
  duracion_estimada_min: number;
  id_pago: number | null;
  monto_pago: string | null; // MySQL devuelve los DECIMAL como texto
  metodo_pago: MetodoPago | null;
  estado_pago: 'Cobrado' | 'Pendiente' | null;
}

// lo que mando al agendar
export interface TurnoDatos {
  id_paciente: number;
  id_medico: number;
  id_tipo_turno: number;
  fecha_hora: string; // 'AAAA-MM-DD HH:MM:00'
  motivo: string | null;
}

export interface TipoTurno {
  id_tipo_turno: number;
  nombre: string;
  duracion_estimada_min: number;
}

export interface Medico {
  id_usuario: number;
  nombre: string;
  apellido: string;
}

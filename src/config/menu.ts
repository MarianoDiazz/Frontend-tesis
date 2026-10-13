import type { Rol } from '../tipos/usuario';

export interface OpcionMenu {
  ruta: string;
  texto: string;
  roles: Rol[];
}

// cada opción dice qué roles la pueden ver
export const menu: OpcionMenu[] = [
  { ruta: '/inicio',    texto: 'Sala de espera', roles: ['Recepcion', 'Medico', 'Admin'] },
  { ruta: '/pacientes', texto: 'Pacientes',      roles: ['Recepcion', 'Medico'] },
  { ruta: '/turnos',    texto: 'Agenda',         roles: ['Recepcion'] },
  { ruta: '/atencion',  texto: 'Atención',       roles: ['Medico'] },
  { ruta: '/usuarios',  texto: 'Usuarios',       roles: ['Admin'] },
  { ruta: '/reportes',  texto: 'Reportes',       roles: ['Recepcion', 'Medico', 'Admin'] },
];
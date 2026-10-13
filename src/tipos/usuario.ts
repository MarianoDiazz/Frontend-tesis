// los roles que existen en la tabla roles
export type Rol = 'Admin' | 'Medico' | 'Recepcion';

// lo que me devuelve el backend en el login
export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: Rol;
}
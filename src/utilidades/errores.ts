import axios from 'axios';

// saco el mensaje que mandó el backend; si no hay, uso uno genérico
export function mensajeDeError(error: unknown, porDefecto: string): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'No se pudo conectar con el servidor.';
    return error.response.data?.mensaje ?? porDefecto;
  }
  return porDefecto;
}
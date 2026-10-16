import type { EstadoTurno as Estado } from '../tipos/turno';

// 'En Espera' -> clase 'estado-en-espera'
export default function EstadoTurno({ estado }: { estado: Estado }) {
  const clase = 'estado estado-' + estado.toLowerCase().replace(' ', '-');
  return <span className={clase}>{estado}</span>;
}

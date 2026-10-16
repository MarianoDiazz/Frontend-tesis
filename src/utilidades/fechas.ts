// fecha de hoy en formato AAAA-MM-DD, con la hora de esta PC
export function hoyISO(): string {
  return aISO(new Date());
}

function aISO(fecha: Date): string {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

// armo la fecha a mano para que no se corra un día por la zona horaria
function desdeISO(iso: string): Date {
  const [anio, mes, dia] = iso.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}

export function sumarDias(iso: string, dias: number): string {
  const fecha = desdeISO(iso);
  fecha.setDate(fecha.getDate() + dias);
  return aISO(fecha);
}

// '2026-10-15' -> 'jueves 15 de octubre'
export function fechaLarga(iso: string): string {
  return desdeISO(iso).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
}

// fecha_hora del backend -> '10:30'
export function hora(fechaHora: string): string {
  return new Date(fechaHora).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
}

// fecha_hora del backend -> '2026-10-15' (en la hora de esta PC)
export function diaDe(fechaHora: string): string {
  return aISO(new Date(fechaHora));
}

// '10:30' -> 630, para comparar horarios
export function aMinutos(horaTexto: string): number {
  const [h, m] = horaTexto.split(':').map(Number);
  return h * 60 + m;
}

// 630 -> '10:30'
export function desdeMinutos(minutos: number): string {
  const h = String(Math.floor(minutos / 60)).padStart(2, '0');
  const m = String(minutos % 60).padStart(2, '0');
  return `${h}:${m}`;
}

export function pesos(monto: number): string {
  return monto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}

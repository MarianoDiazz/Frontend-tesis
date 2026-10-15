// 30111222 -> 30.111.222
export function formatearDni(dni: string): string {
  return dni.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
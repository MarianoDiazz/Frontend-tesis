// leo la fecha de vencimiento que viene dentro del token
// (no verifico la firma: eso lo hace el backend en cada pedido)
export function tokenVencido(token: string): boolean {
  try {
    const parteDatos = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const datos = JSON.parse(atob(parteDatos));
    return typeof datos.exp !== 'number' || datos.exp * 1000 < Date.now();
  } catch {
    return true; // si no lo puedo leer, lo trato como vencido
  }
}

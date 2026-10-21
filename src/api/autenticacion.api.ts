import clienteApi from './clienteApi';

// pido el enlace de recuperación; el backend responde lo mismo exista o no el email
export async function solicitarRecuperacion(email: string): Promise<string> {
  const { data } = await clienteApi.post('/autenticacion/recuperar-clave', { email });
  return data.mensaje;
}

// mando el token del enlace junto con la clave nueva
export async function restablecerClave(token: string, nueva_password: string): Promise<string> {
  const { data } = await clienteApi.post('/autenticacion/restablecer-clave', { token, nueva_password });
  return data.mensaje;
}

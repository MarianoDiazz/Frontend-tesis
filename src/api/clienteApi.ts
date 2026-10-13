import axios from 'axios';

// 1. La dirección del backend, escrita en un solo lugar
const clienteApi = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// 2. Antes de que salga cada pedido: le pega el token
clienteApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. Cuando vuelve cada respuesta: si la sesión venció, al login
clienteApi.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const codigo = error.response?.status;
    const esElLogin = error.config?.url?.includes('/autenticacion/iniciar-sesion');

    if (codigo === 401 && !esElLogin) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default clienteApi;
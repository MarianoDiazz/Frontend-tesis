import { useAuth } from '../../context/AuthContext';

// provisoria: después la reemplazo por la sala de espera
export default function Inicio() {
  const { usuario } = useAuth();

  return (
    <div>
      <h1>Bienvenido, {usuario?.nombre}</h1>
      <p style={{ color: '#6b7280', marginTop: 8 }}>Elegí una opción del menú.</p>
    </div>
  );
}
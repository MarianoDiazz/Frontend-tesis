import { useEffect, useRef, useState } from 'react';

const EVENTOS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];

// cuenta el tiempo sin actividad; devuelve los segundos que faltan cuando hay que avisar
export function useInactividad(minutos: number, segundosAviso: number, alVencer: () => void) {
  const ultimaActividad = useRef(Date.now());
  const [restantes, setRestantes] = useState<number | null>(null); // null = sin aviso

  useEffect(() => {
    function registrar() {
      ultimaActividad.current = Date.now();
    }
    EVENTOS.forEach((ev) => window.addEventListener(ev, registrar, { passive: true }));

    // cada segundo reviso cuánto hace que no hay actividad
    const reloj = setInterval(() => {
      const inactivo = (Date.now() - ultimaActividad.current) / 1000;
      const limite = minutos * 60;

      if (inactivo >= limite) {
        alVencer();
      } else if (inactivo >= limite - segundosAviso) {
        setRestantes(Math.ceil(limite - inactivo));
      } else {
        setRestantes(null);
      }
    }, 1000);

    return () => {
      EVENTOS.forEach((ev) => window.removeEventListener(ev, registrar));
      clearInterval(reloj);
    };
  }, [minutos, segundosAviso, alVencer]);

  // el botón "Seguir trabajando" cuenta como actividad
  function seguir() {
    ultimaActividad.current = Date.now();
    setRestantes(null);
  }

  return { restantes, seguir };
}

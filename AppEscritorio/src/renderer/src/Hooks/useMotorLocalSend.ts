import { useState, useEffect } from 'react';

export function useMotorLocalSend() {
  const [identidad, setIdentidad] = useState('...');
  const [enLinea, setEnLinea] = useState(false);
  const [dispositivos, setDispositivos] = useState<any[]>([]);
  const [peticionEntrante, setPeticionEntrante] = useState<any>(null);
  const [progreso, setProgreso] = useState<any>(null);

  useEffect(() => {
    // @ts-ignore
    const api = window.apiLocalSend;
    if (api) {
      api.getIdentidad().then(setIdentidad);
      api.getMotor().then(setEnLinea);
      api.onEstadoMotor(setEnLinea);
      api.onNodos(setDispositivos);
      api.onPeticion(setPeticionEntrante);
      api.onAvance((datos: any) => {
        setProgreso(datos);
        if (parseFloat(datos.porcentaje) >= 100) {
          setTimeout(() => setProgreso(null), 4000);
        }
      });
    }
  }, []);

  const resolverPeticion = (aceptar: boolean) => {
    // @ts-ignore
    window.apiLocalSend?.responder({ aceptar });
    setPeticionEntrante(null);
  };

  const enviarArchivos = (ip: string, archivos: any[]) => {
    // @ts-ignore
    window.apiLocalSend?.enviar(ip, archivos);
  };

  return { identidad, enLinea, dispositivos, peticionEntrante, progreso, resolverPeticion, enviarArchivos };
}
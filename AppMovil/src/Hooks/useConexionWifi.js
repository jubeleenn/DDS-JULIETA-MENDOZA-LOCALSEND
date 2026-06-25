import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useConexionWifi() {
  const [enWiFi, setEnWiFi] = useState(false);
  
  useEffect(() => {
    const cancelarSuscripcion = NetInfo.addEventListener(estado => {
      setEnWiFi(estado.type === 'wifi' && estado.isConnected);
    });
    return () => cancelarSuscripcion();
  }, []);
  
  return enWiFi;
}
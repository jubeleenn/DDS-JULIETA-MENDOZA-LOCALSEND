import { useColorScheme } from 'react-native';

export function useTemaApp() {
  const esquemaColor = useColorScheme();
  const esOscuro = esquemaColor === 'dark';
  
  return {
    fondo: esOscuro ? '#130a0d' : '#f8f9fa',
    caja: esOscuro ? 'rgba(255, 184, 198, 0.05)' : '#ffffff',
    borde: esOscuro ? 'rgba(255, 184, 198, 0.2)' : '#dcdfe3',
    texto: esOscuro ? '#fdeef2' : '#2d3436',
    acento: esOscuro ? '#ffb8c6' : '#00a693'
  };
}
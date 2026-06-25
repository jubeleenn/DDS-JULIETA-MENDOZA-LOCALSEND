import { useState, useEffect } from 'react';
import { Alert, Linking, Vibration } from 'react-native';
import dgram from 'react-native-udp';

const PUERTO_APP = 53317;

export function useRadarDispositivos(enWiFi, aliasMovil) {
  const [dispositivos, setDispositivos] = useState([]);

  useEffect(() => {
    if (!enWiFi) return;

    const socket = dgram.createSocket('udp4');
    socket.bind(PUERTO_APP, () => {
      try { socket.setBroadcast(true); } catch(e){}
    });

    socket.on('message', (msg, rinfo) => {
      try {
        const data = JSON.parse(msg.toString());
        if (data.alias === aliasMovil) return;

        const ahora = Date.now();
        setDispositivos(prev => {
          const listaLimpia = prev.filter(d => ahora - d.ultimaVezVisto < 12000);
          if (listaLimpia.find(d => d.direccionIp === rinfo.address)) {
            return listaLimpia.map(d => d.direccionIp === rinfo.address ? { ...d, ultimaVezVisto: ahora } : d);
          }
          return [...listaLimpia, { ...data, direccionIp: rinfo.address, ultimaVezVisto: ahora }];
        });

        if (data.accion === 'DESCARGA_HTTP_MOVIL') {
          Vibration.vibrate();
          Alert.alert("Transferencia Entrante 🎀", `La PC quiere enviarte un archivo`, [
              { text: "Rechazar", style: "cancel" },
              { text: "Descargar", onPress: () => Linking.openURL(`http://${rinfo.address}:${PUERTO_APP}/descargar/${data.metadatos.token}`) }
          ]);
        }

        if (data.tipo === 'Computadora') {
          const miSaludo = JSON.stringify({ alias: aliasMovil, tipo: 'Celular' });
          socket.send(miSaludo, 0, miSaludo.length, PUERTO_APP, rinfo.address);
        }
      } catch (e) {}
    });

    const intervalo = setInterval(() => {
      const miSaludo = JSON.stringify({ alias: aliasMovil, tipo: 'Celular' });
      socket.send(miSaludo, 0, miSaludo.length, PUERTO_APP, '255.255.255.255', () => {});
      setDispositivos(prev => prev.filter(d => Date.now() - d.ultimaVezVisto < 12000));
    }, 5000);

    return () => { clearInterval(intervalo); socket.close(); };
  }, [aliasMovil, enWiFi]);

  return dispositivos;
}
import { useState } from 'react';
import dgram from 'react-native-udp';
import NetInfo from '@react-native-community/netinfo';
const PUERTO_DESCUBRIMIENTO = 53317; 
const DIRECCION_BROADCAST = '255.255.255.255';

export const useRadarUdp = () => {
    const [esEscaneoActivo, asignarEsEscaneoActivo] = useState(false);

    const enviarLatidoUdp = async () => {
        try {
            const estadoRed = await NetInfo.fetch();
            if (estadoRed.type !== 'wifi') {
                console.warn('Debes estar conectado a una red Wi-Fi para usar LocalSend.');
                return;
            }

            asignarEsEscaneoActivo(true);
            const socketUdp = dgram.createSocket({ type: 'udp4', reusePort: true });

            socketUdp.bind(0, () => {
                socketUdp.setBroadcast(true);

                const latido = JSON.stringify({
                    alias: "Celular React Native", 
                    tipo: "Móvil"
                });

                socketUdp.send(
                    latido, 
                    0, 
                    latido.length, 
                    PUERTO_DESCUBRIMIENTO, 
                    DIRECCION_BROADCAST, 
                    (error) => {
                        if (error) console.error("Error al enviar latido:", error);
                        else console.log("📡 ¡Latido UDP enviado a la red!");
                        
                        asignarEsEscaneoActivo(false);
                        socketUdp.close();
                    }
                );
            });
        } catch (errorDeRed) {
            console.error("Falla en el radar:", errorDeRed);
            asignarEsEscaneoActivo(false);
        }
    };

    return { esEscaneoActivo, enviarLatidoUdp };
};
import { useState } from 'react';
import dgram from 'react-native-udp';
import NetInfo from '@react-native-community/netinfo';

// REGLA CLEAN CODE: Evitamos "números mágicos" asignándolos a constantes.
const PUERTO_DESCUBRIMIENTO = 53317; 
const DIRECCION_BROADCAST = '255.255.255.255';

export const useRadarUdp = () => {
    // REGLA CLEAN CODE: Variables booleanas con prefijo "es" o "tiene"
    const [esEscaneoActivo, asignarEsEscaneoActivo] = useState(false);

    const enviarLatidoUdp = async () => {
        try {
            // REQUISITO: Validar conexión Wi-Fi según especificaciones
            const estadoRed = await NetInfo.fetch();
            if (estadoRed.type !== 'wifi') {
                console.warn('Debes estar conectado a una red Wi-Fi para usar LocalSend.');
                return;
            }

            asignarEsEscaneoActivo(true);
            const socketUdp = dgram.createSocket({ type: 'udp4', reusePort: true });

            socketUdp.bind(0, () => {
                // Encendemos el modo "Grito a toda la red"
                socketUdp.setBroadcast(true);

                // Este es el formato exacto que espera tu PC
                const latido = JSON.stringify({
                    alias: "Celular React Native", 
                    tipo: "Móvil"
                });

                // Enviamos el mensaje al puerto 53317
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
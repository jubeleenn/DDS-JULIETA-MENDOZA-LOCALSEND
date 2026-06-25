import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Vibration } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useConexionWifi } from '../Hooks/useConexionWifi';
import { useTemaApp } from '../Hooks/useTemaApp';
import { useRadarDispositivos } from '../Hooks/useRadarDispositivos';
import { BotonParaSeleccionarArchivo } from '../Contenido/BotonParaSeleccionarArchivo';
import { TarjetaParaArchivo } from '../Contenido/TarjetaParaArchivo';
import { TarjetaParaDispositivo } from '../Contenido/TarjetaParaDispositivo';

const PUERTO_APP = 53317;

export function PantallaPrincipalControlador() {
  const enWiFi = useConexionWifi();
  const tema = useTemaApp();
  const [aliasMovil] = useState(`Celular ${Math.floor(Math.random() * 1000)}`);
  const dispositivos = useRadarDispositivos(enWiFi, aliasMovil);
  const [archivos, setArchivos] = useState([]);

  const seleccionarArchivos = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ multiple: true, copyToCacheDirectory: true });
      if (!result.canceled) setArchivos(prev => [...prev, ...result.assets]);
    } catch (error) { console.error(error); }
  };

  const transferirArchivo = (ip) => {
    if (archivos.length === 0) return Alert.alert("¡Atención!", "Selecciona un archivo primero 🎀");
    
    const [archivo] = archivos; 
    const nombreSeguro = archivo.name || archivo.fileName || `archivo_${Date.now()}.bin`;
    const sizeSeguro = archivo.size || archivo.fileSize || 1024;

    const ws = new WebSocket(`ws://${ip}:${PUERTO_APP}`);
    
    ws.onopen = () => {
      ws.send(JSON.stringify({ accion: 'SOLICITAR_TRANSFERENCIA', metadatos: { nombre: nombreSeguro, size: sizeSeguro } }));
    };
    
    ws.onmessage = (e) => {
      const res = JSON.parse(e.data);
      if (res.accion === 'ACEPTAR_TRANSFERENCIA') {
        const lectorSeguro = new XMLHttpRequest();
        lectorSeguro.open('GET', archivo.uri, true);
        lectorSeguro.responseType = 'blob'; 

        lectorSeguro.onload = function() {
          if (lectorSeguro.status === 200 || lectorSeguro.status === 0) {
            const blob = lectorSeguro.response;
            const TAMAÑO_CHUNK = 64 * 1024; 
            let desplazamiento = 0;

            const enviarSiguienteChunk = () => {
              if (desplazamiento < blob.size) {
                const pedazo = blob.slice(desplazamiento, desplazamiento + TAMAÑO_CHUNK);
                const lector = new FileReader();
                lector.onload = () => {
                  ws.send(lector.result);
                  desplazamiento += TAMAÑO_CHUNK;
                  setTimeout(enviarSiguienteChunk, 5); 
                };
                lector.onerror = () => { Vibration.vibrate(400); Alert.alert("Error", "Fallo un chunk."); };
                lector.readAsArrayBuffer(pedazo);
              } else {
                Vibration.vibrate(); 
                Alert.alert("¡Éxito!", "¡Transferencia completada! ✨");
                setArchivos(prev => prev.filter((_, idx) => idx !== 0)); 
                ws.close(); 
              }
            };
            enviarSiguienteChunk(); 
          } else { Alert.alert("Error", "No se pudo preparar el paquete."); }
        };
        lectorSeguro.onerror = function() { Alert.alert("Error", "Falló la lectura de Android."); };
        lectorSeguro.send();
      } else if (res.accion === 'RECHAZAR_TRANSFERENCIA') {
        Vibration.vibrate(400); Alert.alert("Rechazado", "La PC rechazó el archivo 💔");
      }
    };
    ws.onerror = () => Alert.alert("Error de red", "La conexión falló.");
  };

  return (
    <View style={[styles.container, { backgroundColor: tema.fondo }]}>
      <View style={[styles.header, { backgroundColor: tema.caja, borderColor: tema.borde }]}>
        <Text style={[styles.headerText, { color: tema.acento }]}>LocalSend Móvil ✨</Text>
      </View>
      
      <BotonParaSeleccionarArchivo tema={tema} alHacerClic={seleccionarArchivos} />

      <ScrollView style={styles.archivosContainer}>
        {archivos.map((arch, i) => (
          <TarjetaParaArchivo key={i} archivo={arch} tema={tema} alEliminar={() => setArchivos(prev => prev.filter((_, idx) => idx !== i))} />
        ))}
      </ScrollView>

      <Text style={[styles.radarTitle, { color: tema.acento }]}>Dispositivos Cercanos 📡</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.radarContainer}>
        {!enWiFi ? (
           <Text style={[styles.buscando, { color: tema.acento }]}>⚠️ Conéctate a Wi-Fi para buscar dispositivos</Text>
        ) : dispositivos.length === 0 ? (
           <Text style={styles.buscando}>Buscando dispositivos cercanos...</Text> 
        ) : (
          dispositivos.map((d, i) => (
            <TarjetaParaDispositivo key={i} dispositivo={d} tema={tema} alHacerClic={() => transferirArchivo(d.direccionIp)} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, paddingTop: 60 },
  header: { borderWidth: 1, borderRadius: 30, padding: 15, alignItems: 'center', marginBottom: 30 },
  headerText: { fontSize: 20, fontWeight: 'bold' },
  archivosContainer: { maxHeight: 150, marginBottom: 20 },
  radarTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  radarContainer: { flexGrow: 0, height: 140 },
  buscando: { color: '#8a9994', fontStyle: 'italic', marginTop: 20, paddingHorizontal: 10 }
});
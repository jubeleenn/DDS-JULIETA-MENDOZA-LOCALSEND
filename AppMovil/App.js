import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import dgram from 'react-native-udp';

const PUERTO_APP = 53317;

export default function App() {
  const [dispositivos, setDispositivos] = useState([]);
  const [archivos, setArchivos] = useState([]);
  // ✨ Le damos un nombre único a tu celular
  const [aliasMovil] = useState(`Celular ${Math.floor(Math.random() * 1000)} 📱`);

  // ✨ EL NUEVO RADAR INTELIGENTE
  useEffect(() => {
    const socket = dgram.createSocket('udp4');
    socket.bind(PUERTO_APP, () => {
      try { socket.setBroadcast(true); } catch(e){}
    });

    // ESCUCHAR Y DEVOLVER EL SALUDO
    socket.on('message', (msg, rinfo) => {
      try {
        const data = JSON.parse(msg.toString());
        setDispositivos(prev => {
          if (prev.find(d => d.ip === rinfo.address)) return prev;
          return [...prev, { ...data, ip: rinfo.address }];
        });

        // ✨ AQUÍ ESTÁ EL TRUCO: Le devolvemos el saludo DIRECTAMENTE a la PC
        if (data.tipo === 'Computadora') {
          const miSaludo = JSON.stringify({ alias: aliasMovil, tipo: 'Teléfono' });
          socket.send(miSaludo, 0, miSaludo.length, PUERTO_APP, rinfo.address);
        }
      } catch (e) {}
    });

    return () => socket.close();
  }, [aliasMovil]);

  const seleccionarArchivos = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ multiple: true });
      if (!result.canceled) setArchivos(prev => [...prev, ...result.assets]);
    } catch (error) { console.error(error); }
  };

  const formatearPeso = (bytes) => {
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const transferirArchivo = (ip) => {
    if (archivos.length === 0) return Alert.alert("¡Atención!", "Selecciona un archivo primero 🎀");
    const archivo = archivos; // Enviamos el primero

    const ws = new WebSocket(`ws://${ip}:${PUERTO_APP}`);
    ws.onopen = () => {
      ws.send(JSON.stringify({ tipo: 'PETICION_ENTRANTE', datos: { nombre: archivo.name, size: archivo.size } }));
    };
    
    ws.onmessage = async (e) => {
      const res = JSON.parse(e.data);
      if (res.tipo === 'PETICION_ACEPTADA') {
        const response = await fetch(archivo.uri);
        const blob = await response.blob();
        ws.send(blob);
        Alert.alert("¡Éxito!", "¡Transferencia completada! ✨");
        setArchivos(prev => prev.filter((_, idx) => idx !== 0)); // Quita el enviado
      } else {
        Alert.alert("Rechazado", "El destinatario rechazó el archivo 💔");
      }
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerText}>LocalSend Móvil ✨</Text></View>
      
      <TouchableOpacity style={styles.dropZone} onPress={seleccionarArchivos}>
        <Text style={styles.dropIcon}>📁</Text>
        <Text style={styles.dropText}>Toca para seleccionar archivos</Text>
      </TouchableOpacity>

      <ScrollView style={styles.archivosContainer}>
        {archivos.map((arch, i) => (
          <View key={i} style={styles.archivoBurbuja}>
            <View>
              <Text style={styles.archivoNombre} numberOfLines={1}>{arch.name}</Text>
              <Text style={styles.archivoPeso}>{formatearPeso(arch.size)}</Text>
            </View>
            <TouchableOpacity onPress={() => setArchivos(prev => prev.filter((_, idx) => idx !== i))}><Text>❌</Text></TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* TEXTO CORREGIDO Y NEUTRAL */}
      <Text style={styles.radarTitle}>Dispositivos Cercanos 📡</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.radarContainer}>
        {dispositivos.length === 0 ? <Text style={styles.buscando}>Buscando dispositivos cercanos...</Text> : (
          dispositivos.map((d, i) => (
            <TouchableOpacity key={i} style={styles.nodoBurbuja} onPress={() => transferirArchivo(d.ip)}>
              <Text style={styles.nodoIcon}>{d.tipo === 'Computadora' ? '💻' : '📱'}</Text>
              <Text style={styles.nodoNombre}>{d.alias}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#130a0d', padding: 25, paddingTop: 60 },
  header: { backgroundColor: 'rgba(255, 184, 198, 0.05)', borderColor: 'rgba(255, 184, 198, 0.2)', borderWidth: 1, borderRadius: 30, padding: 15, alignItems: 'center', marginBottom: 30 },
  headerText: { color: '#ffb8c6', fontSize: 20, fontWeight: 'bold' },
  dropZone: { backgroundColor: 'rgba(255, 184, 198, 0.05)', borderColor: 'rgba(255, 184, 198, 0.2)', borderWidth: 2, borderStyle: 'dashed', borderRadius: 30, padding: 40, alignItems: 'center', marginBottom: 20 },
  dropIcon: { fontSize: 40, marginBottom: 10 },
  dropText: { color: '#fdeef2', fontSize: 16 },
  archivosContainer: { maxHeight: 150, marginBottom: 20 },
  archivoBurbuja: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255, 184, 198, 0.05)', borderColor: 'rgba(255, 184, 198, 0.2)', borderWidth: 1, borderRadius: 20, padding: 15, marginBottom: 10 },
  archivoNombre: { color: '#fdeef2', fontWeight: 'bold', width: 200 },
  archivoPeso: { color: '#ffb8c6', fontSize: 12 },
  radarTitle: { color: '#ffb8c6', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  radarContainer: { flexGrow: 0, height: 140 },
  buscando: { color: '#bda3ab', fontStyle: 'italic', marginTop: 20 },
  nodoBurbuja: { backgroundColor: 'rgba(255, 184, 198, 0.05)', borderColor: 'rgba(255, 184, 198, 0.2)', borderWidth: 1, borderRadius: 25, padding: 20, alignItems: 'center', marginRight: 15, width: 140, justifyContent: 'center' },
  nodoIcon: { fontSize: 35, marginBottom: 10 },
  nodoNombre: { color: '#fdeef2', fontWeight: 'bold', textAlign: 'center' },
});
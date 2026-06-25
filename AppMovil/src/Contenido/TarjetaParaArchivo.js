import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

export function TarjetaParaArchivo({ archivo, tema, alEliminar }) {
  const formatearPeso = (bytes) => {
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <View style={[styles.burbuja, { backgroundColor: tema.caja, borderColor: tema.borde }]}>
      {archivo.mimeType && archivo.mimeType.startsWith('image/') ? (
        <Image source={{ uri: archivo.uri }} style={styles.miniatura} />
      ) : (
        <Text style={styles.iconoDoc}>📄</Text>
      )}
      <View style={styles.info}>
        <Text style={[styles.nombre, { color: tema.texto }]} numberOfLines={1}>{archivo.name || 'Archivo'}</Text>
        <Text style={[styles.peso, { color: tema.acento }]}>{formatearPeso(archivo.size || 0)}</Text>
      </View>
      <TouchableOpacity onPress={alEliminar}><Text>❌</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  burbuja: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 20, padding: 15, marginBottom: 10 },
  miniatura: { width: 40, height: 40, borderRadius: 8, marginRight: 15 },
  iconoDoc: { fontSize: 30, marginRight: 15 },
  info: { flex: 1 },
  nombre: { fontWeight: 'bold' },
  peso: { fontSize: 12, marginTop: 2 }
});
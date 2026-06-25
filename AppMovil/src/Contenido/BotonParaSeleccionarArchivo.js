import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export function BotonParaSeleccionarArchivo({ tema, alHacerClic }) {
  return (
    <TouchableOpacity style={[styles.dropZone, { backgroundColor: tema.caja, borderColor: tema.borde }]} onPress={alHacerClic}>
      <Text style={styles.dropIcon}>📁</Text>
      <Text style={[styles.dropText, { color: tema.texto }]}>Toca para seleccionar archivos</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dropZone: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 30, padding: 40, alignItems: 'center', marginBottom: 20 },
  dropIcon: { fontSize: 40, marginBottom: 10 },
  dropText: { fontSize: 16, fontWeight: '500' }
});
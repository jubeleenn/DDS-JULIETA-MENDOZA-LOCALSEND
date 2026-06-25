import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export function TarjetaParaDispositivo({ dispositivo, tema, alHacerClic }) {
  return (
    <TouchableOpacity style={[styles.nodo, { backgroundColor: tema.caja, borderColor: tema.borde }]} onPress={alHacerClic}>
      <Text style={styles.icono}>{dispositivo.tipo === 'Computadora' ? '💻' : '📱'}</Text>
      <Text style={[styles.nombre, { color: tema.texto }]}>{dispositivo.alias}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  nodo: { borderWidth: 1, borderRadius: 25, padding: 20, alignItems: 'center', marginRight: 15, width: 140, justifyContent: 'center' },
  icono: { fontSize: 35, marginBottom: 10 },
  nombre: { fontWeight: 'bold', textAlign: 'center' }
});
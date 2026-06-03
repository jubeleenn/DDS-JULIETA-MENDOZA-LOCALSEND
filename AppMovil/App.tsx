import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
// Importamos nuestro controlador limpio
import { useRadarUdp } from './Controlador/useRadarUdp';

export default function App() {
    const { esEscaneoActivo, enviarLatidoUdp } = useRadarUdp();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#1e2322', justifyContent: 'center', alignItems: 'center' }}>
            
            <View style={{ marginBottom: 40, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}>LocalSend Móvil</Text>
                <Text style={{ color: '#8a9994', fontSize: 16, marginTop: 10 }}>Pulsar para buscar tu PC</Text>
            </View>

            {esEscaneoActivo ? (
                <ActivityIndicator size="large" color="#40C4AA" />
            ) : (
                <TouchableOpacity 
                    onPress={enviarLatidoUdp}
                    style={{
                        backgroundColor: '#40C4AA',
                        paddingVertical: 15,
                        paddingHorizontal: 40,
                        borderRadius: 30,
                        elevation: 5
                    }}
                >
                    <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>
                        📡 Emitir Latido UDP
                    </Text>
                </TouchableOpacity>
            )}

        </SafeAreaView>
    );
}
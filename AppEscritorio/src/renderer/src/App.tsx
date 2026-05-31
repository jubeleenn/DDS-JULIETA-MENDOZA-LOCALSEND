import { useState } from 'react';
import { Download } from 'lucide-react'; 
import { BarraLateral } from './Contenedor/BarraLateral';
import { AreaDeRecepcion } from './Contenedor/AreaDeRecepcion';
import { AreaDeEnvio } from './Contenedor/AreaDeEnvio';
import { AreaDeAjustes } from './Contenedor/AreaDeAjustes';
import { EstilosAnimaciones } from './Contenido/EstilosAnimaciones';
import { useManejadorDeArrastre } from './Hooks/useManejadorDeArrastre';

export default function App() {
    const [pantallaActiva, asignarPantallaActiva] = useState('recibir');
    
    const [archivosGlobales, asignarArchivosGlobales] = useState<File[]>([]);
    const [nombreColorGlobal, asignarNombreColorGlobal] = useState('LocalSend');
    const [temaGlobal, asignarTemaGlobal] = useState('Oscuro');

    const eventosDeArrastre = useManejadorDeArrastre((archivosNuevos) => {
        asignarArchivosGlobales(previos => [...previos, ...archivosNuevos]);
        asignarPantallaActiva('enviar'); // ¡Redirección automática!
    });

    const mapaColores: Record<string, string> = {
        'LocalSend': '#a2f0d9', 'Sistema': '#78a9ff', 'Yaru': '#e95420', 'OLED': '#a9c8ff'
    };
    const colorHex = mapaColores[nombreColorGlobal] || '#a2f0d9';
    const esOscuro = temaGlobal === 'Oscuro';
    const esFondoOled = nombreColorGlobal === 'OLED' && esOscuro;

    const estilosDelTema = {
        '--color-acento': colorHex,
        '--color-fondo': esFondoOled ? '#000000' : (esOscuro ? '#1b2624' : '#e6f0ed'),
        '--color-caja': esFondoOled ? '#0a0a0a' : (esOscuro ? '#16201d' : '#ffffff'),
        '--color-texto': esOscuro ? '#ffffff' : '#333333',
        '--color-fondo-boton': esOscuro ? '#2b3d36' : '#d0e0db',
    } as React.CSSProperties;

    return (
        <main 
            onDragEnter={eventosDeArrastre.manejarEntradaDeArrastre}
            onDragLeave={eventosDeArrastre.manejarSalidaDeArrastre}
            onDragOver={eventosDeArrastre.prevenirComportamientoPorDefecto}
            onDrop={eventosDeArrastre.manejarSoltarArchivo}
            style={{ ...estilosDelTema, display: 'flex', height: '100vh', width: '100vw', fontFamily: '"Segoe UI", sans-serif', userSelect: 'none', margin: 0, backgroundColor: 'var(--color-fondo)', position: 'relative' }}
        >
            <EstilosAnimaciones />
            
            {eventosDeArrastre.esArrastreActivo && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'var(--color-fondo)', zIndex: 9999, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--color-texto)', opacity: 0.95 }}>
                    <Download size={80} color="var(--color-texto)" style={{ marginBottom: '20px' }} />
                    <h2 style={{ fontSize: '28px', fontWeight: '500' }}>Selecciona archivos para compartir</h2>
                </div>
            )}

            <BarraLateral pantallaActiva={pantallaActiva} alCambiarPantalla={asignarPantallaActiva} />

            {pantallaActiva === 'recibir' && <AreaDeRecepcion aliasDelDispositivo="Clever Banana" identificadorDeRed="#132" />}
            
            {pantallaActiva === 'enviar' && (
                <AreaDeEnvio 
                    archivosGlobales={archivosGlobales}
                    alAgregarArchivos={(nuevos) => asignarArchivosGlobales(prev => [...prev, ...nuevos])}
                    alLimpiarArchivos={() => asignarArchivosGlobales([])}
                    alEliminarArchivo={(indice) => asignarArchivosGlobales(prev => prev.filter((_, i) => i !== indice))}
                />
            )}
            
            {pantallaActiva === 'ajustes' && (
                <AreaDeAjustes nombreColorActual={nombreColorGlobal} alCambiarColor={asignarNombreColorGlobal} temaActual={temaGlobal} alCambiarTema={asignarTemaGlobal} />
            )}
        </main>
    );
}
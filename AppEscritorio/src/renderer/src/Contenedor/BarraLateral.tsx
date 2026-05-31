import { Wifi, Send, Settings } from 'lucide-react'; // Traemos los íconos exactos

interface PropiedadesDeLaBarra {
    pantallaActiva: string;
    alCambiarPantalla: (pantalla: string) => void;
}

export function BarraLateral({ pantallaActiva, alCambiarPantalla }: PropiedadesDeLaBarra) {

    const obtenerEstiloDelBoton = (esElBotonActivo: boolean) => ({
        padding: '12px 16px',
        backgroundColor: esElBotonActivo ? '#1e332c' : 'transparent',
        borderRadius: '8px',
        color: esElBotonActivo ? '#a2f0d9' : '#ffffff',
        fontWeight: esElBotonActivo ? 'bold' : 'normal',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        cursor: 'pointer'
    });

    return (
        <aside style={{ width: '220px', backgroundColor: '#141d1a', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0 40px 0', color: '#ffffff' }}>LocalSend</h1>
            
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div onClick={() => alCambiarPantalla('recibir')} style={obtenerEstiloDelBoton(pantallaActiva === 'recibir')}>
                    <Wifi size={20} /> Recibir
                </div>
                
                <div onClick={() => alCambiarPantalla('enviar')} style={obtenerEstiloDelBoton(pantallaActiva === 'enviar')}>
                    <Send size={20} /> Enviar
                </div>
                
                <div onClick={() => alCambiarPantalla('ajustes')} style={obtenerEstiloDelBoton(pantallaActiva === 'ajustes')}>
                    <Settings size={20} /> Ajustes
                </div>
            </nav>
        </aside>
    );
}
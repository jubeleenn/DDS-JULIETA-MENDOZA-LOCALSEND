import { useState, useEffect } from 'react';
import { FileDown } from 'lucide-react';

interface PropsRecepcion { aliasDelDispositivo: string; identificadorDeRed: string; }

export function AreaDeRecepcion({ aliasDelDispositivo, identificadorDeRed }: PropsRecepcion) {
    const [modoGuardado, asignarModoGuardado] = useState('Apagado');
    const [transferenciasActivas, asignarTransferenciasActivas] = useState<Record<string, number>>({});

    useEffect(() => {
        // @ts-ignore
        if (window.apiLocalSend && window.apiLocalSend.escucharProgresoTransferencia) {
            // @ts-ignore
            window.apiLocalSend.escucharProgresoTransferencia((progreso) => {
                asignarTransferenciasActivas((estadoPrevio) => ({
                    ...estadoPrevio,
                    [progreso.nombre]: progreso.porcentaje
                }));

                if (progreso.porcentaje === 100) {
                    setTimeout(() => {
                        asignarTransferenciasActivas((estadoPrevio) => {
                            const nuevoEstado = { ...estadoPrevio };
                            delete nuevoEstado[progreso.nombre];
                            return nuevoEstado;
                        });
                    }, 3000); 
                }
            });
        }
    }, []);

    const listaDeArchivos = Object.keys(transferenciasActivas);

    return (
        <section style={{ flex: 1, backgroundColor: 'var(--color-fondo)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', transition: 'background-color 0.3s ease' }}>
            
            <style>
                {`
                @keyframes girarLento {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                `}
            </style>
            
            <div style={{ marginBottom: '20px', animation: 'girarLento 15s linear infinite' }}>
                <svg width="180" height="180" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Círculo sólido central */}
                    <circle cx="50" cy="50" r="22" fill="var(--color-acento)" />
                    
                    {[1, 2].map((angulo) => (
                        <path 
                            key={angulo} 
                            d="M 50 10 A 40 40 0 0 1 66.5 13.5" 
                            stroke="var(--color-acento)" 
                            strokeWidth="8" 
                            strokeLinecap="round" 
                            transform={`rotate(${angulo} 50 50)`} 
                        />
                    ))}
                </svg>
            </div>

            <h1 style={{ fontSize: '42px', margin: '10px 0', color: 'var(--color-texto)', fontWeight: '400' }}>{aliasDelDispositivo}</h1>
            <p style={{ fontSize: '20px', margin: '0 0 40px 0', color: '#8a9994' }}>{identificadorDeRed}</p>

            {listaDeArchivos.length > 0 && (
                <div style={{ width: '400px', backgroundColor: 'var(--color-caja)', padding: '25px', borderRadius: '16px', marginBottom: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid var(--color-fondo-boton)' }}>
                    <h3 style={{ margin: '0 0 20px 0', color: 'var(--color-texto)', fontSize: '16px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileDown size={22} color="var(--color-acento)" /> Descargas Activas
                    </h3>
                    
                    {listaDeArchivos.map(nombreArchivo => {
                        const porcentaje = transferenciasActivas[nombreArchivo];
                        const esCompletado = porcentaje === 100;
                        
                        return (
                            <div key={nombreArchivo} style={{ marginBottom: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={{ color: 'var(--color-texto)', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '250px' }}>{nombreArchivo}</span>
                                    <span style={{ color: esCompletado ? 'var(--color-acento)' : '#8a9994', fontSize: '14px', fontWeight: 'bold' }}>
                                        {esCompletado ? 'Completado' : `${porcentaje}%`}
                                    </span>
                                </div>
                                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-fondo-boton)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ 
                                        width: `${porcentaje}%`, 
                                        height: '100%', 
                                        backgroundColor: 'var(--color-acento)', 
                                        transition: 'width 0.4s ease-out' 
                                    }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--color-texto)', marginBottom: '15px', fontSize: '15px' }}>Guardado rápido</p>
                <div style={{ display: 'flex', backgroundColor: 'var(--color-caja)', borderRadius: '25px', padding: '5px', border: '1px solid var(--color-fondo-boton)' }}>
                    {['Apagado', 'Favoritos', 'Encendido'].map((modo) => (
                        <button
                            key={modo}
                            onClick={() => asignarModoGuardado(modo)}
                            style={{ padding: '10px 25px', borderRadius: '20px', border: 'none', backgroundColor: modoGuardado === modo ? 'var(--color-fondo-boton)' : 'transparent', color: modoGuardado === modo ? 'var(--color-texto)' : '#8a9994', cursor: 'pointer', fontWeight: modoGuardado === modo ? '500' : 'normal', transition: 'all 0.2s ease', fontSize: '14px' }}
                        >
                            {modo}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
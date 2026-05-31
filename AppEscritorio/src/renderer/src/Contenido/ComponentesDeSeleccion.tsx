import { useState } from 'react';
import { File, Trash2, ArrowLeft } from 'lucide-react';

// 1. UTILIDAD: Formateador de peso (Bytes a KB / MB)
export const formatearPeso = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

// 2. COMPONENTE: Botón con Hover state dinámico
export function BotonConHover({ texto, esPrimario, alHacerClic }: { texto: string, esPrimario?: boolean, alHacerClic: () => void }) {
    const [esHover, asignarEsHover] = useState(false);
    return (
        <button 
            onMouseEnter={() => asignarEsHover(true)} 
            onMouseLeave={() => asignarEsHover(false)} 
            onClick={alHacerClic}
            style={{
                color: esPrimario ? 'var(--color-caja)' : 'var(--color-texto)',
                border: 'none', borderRadius: '20px', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px',
               
                filter: esHover && esPrimario ? 'brightness(1.1)' : 'none',
                
                backgroundColor: esHover && !esPrimario ? 'rgba(255, 255, 255, 0.1)' : (esPrimario ? 'var(--color-acento)' : 'transparent'),
                transition: 'all 0.2s ease'
            }}
        >
            {texto}
        </button>
    );
}

// 3. PANTALLA COMPLETA: Modo Edición (Calcado de seleccion editar.PNG)
export function PantallaEditarSeleccion({ archivos, alCerrar, alEliminarArchivo, alEliminarTodo }: { archivos: File[], alCerrar: () => void, alEliminarArchivo: (i: number) => void, alEliminarTodo: () => void }) {
    const pesoTotal = archivos.reduce((acc, a) => acc + a.size, 0);

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'var(--color-fondo)', zIndex: 40, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 40px', backgroundColor: 'var(--color-caja)', borderBottom: '1px solid var(--color-fondo-boton)' }}>
                <ArrowLeft size={24} cursor="pointer" color="var(--color-texto)" onClick={alCerrar} />
                <h2 style={{ margin: 0, color: 'var(--color-texto)', fontSize: '20px', fontWeight: '400' }}>Selección</h2>
            </div>
            <div style={{ padding: '30px 60px', flex: 1, overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <p style={{ margin: 0, color: 'var(--color-texto)' }}>Archivos: {archivos.length}</p>
                        <p style={{ margin: '5px 0 0 0', color: '#8a9994', fontSize: '14px' }}>Tamaño: {formatearPeso(pesoTotal)}</p>
                    </div>
                    <BotonConHover texto="Eliminar todo" alHacerClic={alEliminarTodo} />
                </div>
               
                {archivos.map((archivo, index) => (
                    <div key={index} style={{ backgroundColor: 'var(--color-caja)', borderRadius: '12px', padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
                        <div style={{ backgroundColor: 'var(--color-fondo-boton)', padding: '10px', borderRadius: '8px' }}>
                            <File size={24} color="var(--color-texto)" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, color: 'var(--color-texto)', fontWeight: '500' }}>{archivo.name}</p>
                            <p style={{ margin: '5px 0 0 0', color: '#8a9994', fontSize: '14px' }}>{formatearPeso(archivo.size)}</p>
                        </div>
                        <Trash2 size={20} color="var(--color-texto)" cursor="pointer" onClick={() => alEliminarArchivo(index)} />
                    </div>
                ))}
            </div>
        </div>
    );
}
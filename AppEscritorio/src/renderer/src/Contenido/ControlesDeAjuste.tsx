import { ReactNode, useState } from 'react';

// 1. FILA CONTENEDORA
export function FilaDeAjuste({ titulo, children }: { titulo: string, children: ReactNode }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
            <span style={{ fontSize: '15px', color: 'var(--color-texto, #ffffff)' }}>{titulo}</span>
            {children}
        </div>
    );
}

// 2. MENÚ DESPLEGABLE (Dropdown)
export function DesplegableVisual({ opciones, valorActual, alCambiar }: { opciones: string[], valorActual: string, alCambiar: (v: string) => void }) {
    const [esAbierto, asignarEsAbierto] = useState(false);
    return (
        <div style={{ position: 'relative' }}>
            <div onClick={() => asignarEsAbierto(!esAbierto)} style={{ backgroundColor: 'var(--color-fondo-boton, #2b3d36)', padding: '10px 15px', borderRadius: '10px', color: 'var(--color-texto, #ffffff)', cursor: 'pointer', display: 'flex', gap: '30px', justifyContent: 'space-between', alignItems: 'center', minWidth: '130px' }}>
                <span>{valorActual}</span> <span style={{ fontSize: '12px' }}>▼</span>
            </div>
            {esAbierto && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'var(--color-caja, #16201d)', borderRadius: '10px', marginTop: '5px', zIndex: 10, overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.5)', border: '1px solid var(--color-fondo-boton, #2b3d36)' }}>
                    {opciones.map(opcion => (
                        <div key={opcion} onClick={() => { alCambiar(opcion); asignarEsAbierto(false); }} style={{ padding: '10px 15px', color: 'var(--color-texto, #ffffff)', cursor: 'pointer', backgroundColor: valorActual === opcion ? 'var(--color-fondo-boton, #2b3d36)' : 'transparent' }}>
                            {opcion}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// 3. INTERRUPTOR (Toggle Switch)
export function InterruptorVisual({ esActivo, alAlternar }: { esActivo: boolean, alAlternar: () => void }) {
    return (
        <div onClick={alAlternar} style={{ width: '54px', height: '30px', backgroundColor: esActivo ? 'var(--color-acento, #a2f0d9)' : 'var(--color-fondo-boton, #2b3d36)', borderRadius: '15px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s ease' }}>
            <div style={{ width: '22px', height: '22px', backgroundColor: esActivo ? 'var(--color-caja, #16201d)' : 'var(--color-texto, #ffffff)', borderRadius: '50%', position: 'absolute', top: '4px', left: esActivo ? '28px' : '4px', transition: 'all 0.3s ease', border: esActivo ? 'none' : '2px solid #8a9994', boxSizing: 'border-box' }} />
        </div>
    );
}

// 4. BOTÓN ESTÁNDAR DE AJUSTES (Ej: "(Descargas)", "Abrir")
export function BotonAjuste({ texto, alHacerClic, icono }: { texto?: string, alHacerClic: () => void, icono?: ReactNode }) {
    return (
        <button onClick={alHacerClic} style={{ backgroundColor: 'var(--color-fondo-boton, #2b3d36)', color: 'var(--color-texto, #ffffff)', border: 'none', borderRadius: '10px', padding: '10px 20px', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '500' }}>
            {icono} {texto}
        </button>
    );
}

// 5. CASILLA DE VERIFICACIÓN (Checkbox avanzado)
export function CheckboxAjuste({ esActivo, alAlternar, texto }: { esActivo: boolean, alAlternar: () => void, texto: string }) {
    return (
        <div onClick={alAlternar} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'var(--color-texto, #ffffff)', fontSize: '14px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <span>{texto}</span>
            <div style={{ width: '20px', height: '20px', border: '2px solid var(--color-texto, #ffffff)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: esActivo ? 'var(--color-texto, #ffffff)' : 'transparent' }}>
                {esActivo && <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--color-fondo, #1b2624)' }} />}
            </div>
        </div>
    );
}
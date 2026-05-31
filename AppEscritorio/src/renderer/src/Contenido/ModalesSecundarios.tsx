import { ReactNode } from 'react';
import { CheckCircle2, HelpCircle } from 'lucide-react';

// 1. COMPONENTE BASE: Envoltorio con la animación de deslizar arriba
function ModalDeslizante({ alCerrar, children }: { alCerrar: () => void, children: ReactNode }) {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
            <div style={{ backgroundColor: '#16201d', padding: '30px', borderRadius: '24px', width: '380px', animation: 'deslizarArriba 0.3s ease-out' }}>
                {children}
            </div>
        </div>
    );
}

// 2. MODAL: Favoritos Vacío 
export function ModalFavoritosVacio({ alCancelar, alAgregar }: { alCancelar: () => void, alAgregar: () => void }) {
    return (
        <ModalDeslizante alCerrar={alCancelar}>
            <h3 style={{ margin: '0 0 20px 0', color: '#ffffff', fontSize: '20px', fontWeight: '500' }}>Favoritos</h3>
            <p style={{ color: '#8a9994', marginBottom: '30px' }}>Aún no hay dispositivos favoritos.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <button onClick={alCancelar} style={{ backgroundColor: 'transparent', color: '#a2f0d9', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>Cancelar</button>
                <button onClick={alAgregar} style={{ backgroundColor: '#a2f0d9', color: '#16201d', border: 'none', borderRadius: '20px', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>Agregar</button>
            </div>
        </ModalDeslizante>
    );
}

// 3. MODAL: Agregar a Favoritos
export function ModalAgregarFavorito({ alCancelar }: { alCancelar: () => void }) {
    const estiloInput = { backgroundColor: '#2b3d36', border: 'none', borderRadius: '8px', padding: '15px', color: '#ffffff', width: '100%', boxSizing: 'border-box' as const, marginBottom: '20px', outline: 'none' };
    
    return (
        <ModalDeslizante alCerrar={alCancelar}>
            <h3 style={{ margin: '0 0 20px 0', color: '#ffffff', fontSize: '20px', fontWeight: '500' }}>Agregar a favoritos</h3>
            <label style={{ color: '#ffffff', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Alias</label>
            <input type="text" placeholder="(auto)" style={estiloInput} />
            
            <label style={{ color: '#ffffff', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Dirección IP</label>
            <input type="text" style={estiloInput} />

            <label style={{ color: '#ffffff', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Puerto</label>
            <input type="text" defaultValue="53317" style={estiloInput} />

            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <button onClick={alCancelar} style={{ backgroundColor: 'transparent', color: '#a2f0d9', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>Cancelar</button>
                <button onClick={alCancelar} style={{ backgroundColor: '#a2f0d9', color: '#16201d', border: 'none', borderRadius: '20px', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>Confirmar</button>
            </div>
        </ModalDeslizante>
    );
}

// 4. MODAL: Explicación de Modos 
export function ModalExplicacionModos({ alCerrar }: { alCerrar: () => void }) {
    return (
        <ModalDeslizante alCerrar={alCerrar}>
            <h3 style={{ margin: '0 0 20px 0', color: '#ffffff', fontSize: '24px', fontWeight: '400' }}>Modos de envío</h3>
            
            <h4 style={{ color: '#ffffff', margin: '0 0 5px 0' }}>Solo un destino</h4>
            <p style={{ color: '#ffffff', fontSize: '14px', margin: '0 0 20px 0' }}>Enviar archivos a un solo destino. La selección se borrará una vez finalizada la transferencia.</p>
            
            <h4 style={{ color: '#ffffff', margin: '0 0 5px 0' }}>Múltiples destinos</h4>
            <p style={{ color: '#ffffff', fontSize: '14px', margin: '0 0 20px 0' }}>Enviar archivos a múltiples destinos. La selección no se borrará.</p>
            
            <h4 style={{ color: '#ffffff', margin: '0 0 5px 0' }}>Compartir enlace</h4>
            <p style={{ color: '#ffffff', fontSize: '14px', margin: '0 0 30px 0' }}>Los destinatarios que no tengan LocalSend instalado pueden descargar los archivos seleccionados abriendo el enlace en su navegador.</p>
            
            <div style={{ textAlign: 'right' }}>
                <button onClick={alCerrar} style={{ backgroundColor: 'transparent', color: '#a2f0d9', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>Cerrar</button>
            </div>
        </ModalDeslizante>
    );
}

// 5. MENÚ DESPLEGABLE FUNCIONAL: Modos de Envío
export function MenuModosDeEnvio({ modoActual, alSeleccionarModo, alCerrar, alAbrirExplicacion }: { modoActual: string, alSeleccionarModo: (m: string) => void, alCerrar: () => void, alAbrirExplicacion: () => void }) {
    const estiloOpcion = { padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '15px', color: '#ffffff', cursor: 'pointer' };
    const manejarSeleccion = (modo: string) => { alSeleccionarModo(modo); alCerrar(); };

    return (
        <div style={{ position: 'absolute', top: '160px', left: '200px', backgroundColor: 'var(--color-caja, #16201d)', borderRadius: '12px', padding: '10px 0', width: '250px', zIndex: 50, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <div style={estiloOpcion} onClick={() => manejarSeleccion('unico')}>
                {modoActual === 'unico' ? <CheckCircle2 size={20} color="var(--color-acento, #a2f0d9)" /> : <span style={{ width: 20 }}></span>}
                <span style={{ fontWeight: modoActual === 'unico' ? 'bold' : 'normal' }}>Solo un destino</span>
            </div>
            <div style={estiloOpcion} onClick={() => manejarSeleccion('multiple')}>
                {modoActual === 'multiple' ? <CheckCircle2 size={20} color="var(--color-acento, #a2f0d9)" /> : <span style={{ width: 20 }}></span>}
                <span style={{ fontWeight: modoActual === 'multiple' ? 'bold' : 'normal' }}>Múltiples destinos</span>
            </div>
            <div style={estiloOpcion} onClick={() => manejarSeleccion('enlace')}>
                {modoActual === 'enlace' ? <CheckCircle2 size={20} color="var(--color-acento, #a2f0d9)" /> : <span style={{ width: 20 }}></span>}
                <span style={{ fontWeight: modoActual === 'enlace' ? 'bold' : 'normal' }}>Compartir enlace</span>
            </div>
            <hr style={{ borderColor: '#2b3d36', margin: '10px 0' }} />
            <div style={estiloOpcion} onClick={alAbrirExplicacion}><HelpCircle size={20} /> Explicación</div>
        </div>
    );
}
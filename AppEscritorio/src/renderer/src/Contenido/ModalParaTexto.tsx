import { useState } from 'react';

interface PropiedadesDelModal {
    alCancelar: () => void;
    alConfirmar: (texto: string) => void;
}

export function ModalParaTexto({ alCancelar, alConfirmar }: PropiedadesDelModal) {
    const [textoIngresado, asignarTextoIngresado] = useState('');

    return (
        // Fondo oscuro semitransparente
        <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 100
        }}>
            {/* Caja del modal */}
            <div style={{
                backgroundColor: '#16201d', padding: '30px', borderRadius: '24px',
                width: '350px', display: 'flex', flexDirection: 'column', gap: '20px'
            }}>
                <h3 style={{ margin: 0, color: '#ffffff', fontSize: '20px', fontWeight: '500' }}>
                    Escribe un mensaje
                </h3>
                
                <textarea 
                    value={textoIngresado}
                    onChange={(e) => asignarTextoIngresado(e.target.value)}
                    autoFocus
                    style={{
                        backgroundColor: '#2b3d36', border: 'none', borderRadius: '12px',
                        padding: '15px', color: '#ffffff', height: '80px',
                        resize: 'none', outline: 'none', fontFamily: 'inherit'
                    }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '10px' }}>
                    <button onClick={alCancelar} style={{
                        backgroundColor: 'transparent', color: '#a2f0d9', border: 'none',
                        fontWeight: 'bold', cursor: 'pointer', fontSize: '15px'
                    }}>
                        Cancelar
                    </button>
                    <button onClick={() => alConfirmar(textoIngresado)} style={{
                        backgroundColor: '#a2f0d9', color: '#16201d', border: 'none',
                        borderRadius: '20px', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px'
                    }}>
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}
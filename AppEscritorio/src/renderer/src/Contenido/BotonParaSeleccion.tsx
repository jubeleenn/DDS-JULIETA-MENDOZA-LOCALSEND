import { ReactNode } from 'react';
interface PropiedadesDelBoton {
    icono: ReactNode;
    texto: string;
    alHacerClic?: () => void;
}

export function BotonParaSeleccion({ icono, texto, alHacerClic }: PropiedadesDelBoton) {
    return (
        <button 
            onClick={alHacerClic} 
            style={{
                backgroundColor: '#2b3d36', 
                color: '#ffffff',
                border: 'none',
                borderRadius: '16px',
                padding: '20px 15px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                width: '110px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
            }}
        >
            {icono}
            <span style={{ fontSize: '15px', fontWeight: '500' }}>{texto}</span>
        </button>
    );
}
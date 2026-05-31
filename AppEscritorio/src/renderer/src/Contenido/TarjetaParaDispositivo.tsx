interface PropiedadesDeLaTarjeta {
    aliasDelDispositivo: string;
    tipoDeDispositivo: string;
    esDispositivoConocido: boolean; 
}

export function TarjetaParaDispositivo({ 
    aliasDelDispositivo, 
    tipoDeDispositivo, 
    esDispositivoConocido 
}: PropiedadesDeLaTarjeta) {
    return (
        <article style={{ 
            border: '1px solid #ccc', 
            padding: '16px', 
            borderRadius: '8px',
            margin: '8px',
            backgroundColor: esDispositivoConocido ? '#e6ffe6' : '#fff'
        }}>
            <h3>{aliasDelDispositivo}</h3>
            <p>Tipo: {tipoDeDispositivo}</p>
        </article>
    );
}
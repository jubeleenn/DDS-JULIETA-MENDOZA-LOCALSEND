interface PropiedadesDeLaGrilla {
    children: React.ReactNode;
}

export function GrillaParaDispositivosEncontrados({ children }: PropiedadesDeLaGrilla) {
    return (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px' }}>
            <h2>Dispositivos en tu red</h2>
            {children} 
        </section>
    );
}
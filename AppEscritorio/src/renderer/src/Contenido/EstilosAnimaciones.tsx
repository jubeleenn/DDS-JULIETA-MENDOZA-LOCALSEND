
export function EstilosAnimaciones() {
    return (
        <style>{`
            @keyframes deslizarArriba {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes girar {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `}</style>
    );
}
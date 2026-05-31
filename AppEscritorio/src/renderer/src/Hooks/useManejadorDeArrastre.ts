import { useState, DragEvent } from 'react';

export function useManejadorDeArrastre(alSoltarArchivos: (archivos: File[]) => void) {
    const [esArrastreActivo, asignarEsArrastreActivo] = useState(false);

    const prevenirComportamientoPorDefecto = (evento: DragEvent<HTMLElement>) => {
        evento.preventDefault();
        evento.stopPropagation();
    };

    const manejarEntradaDeArrastre = (evento: DragEvent<HTMLElement>) => {
        prevenirComportamientoPorDefecto(evento);
        if (evento.dataTransfer.types.includes('Files')) {
            asignarEsArrastreActivo(true);
        }
    };

    const manejarSalidaDeArrastre = (evento: DragEvent<HTMLElement>) => {
        prevenirComportamientoPorDefecto(evento);
        if (evento.clientX === 0 || evento.clientY === 0) {
            asignarEsArrastreActivo(false);
        }
    };

    const manejarSoltarArchivo = (evento: DragEvent<HTMLElement>) => {
        prevenirComportamientoPorDefecto(evento);
        asignarEsArrastreActivo(false);

        const archivosSoltados = Array.from(evento.dataTransfer.files);
        if (archivosSoltados.length > 0) {
            alSoltarArchivos(archivosSoltados); 
        }
    };

    return {
        esArrastreActivo,
        prevenirComportamientoPorDefecto,
        manejarEntradaDeArrastre,
        manejarSalidaDeArrastre,
        manejarSoltarArchivo
    };
}
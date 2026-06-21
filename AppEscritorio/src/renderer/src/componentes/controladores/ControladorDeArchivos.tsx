import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { TarjetaDeArchivoSeleccionado } from '../contenidos/TarjetaDeArchivoSeleccionado';

export function ControladorDeArchivos({ archivos, alCambiarArchivos }: any) {
  const [esArrastrando, setEsArrastrando] = useState(false);

  const manejarDrop = (e: any) => {
    e.preventDefault(); setEsArrastrando(false);
    const nuevosArchivos = Array.from(e.dataTransfer.files).map((f: any) => ({
      name: f.name, size: f.size, type: f.type || 'Archivo',
      // @ts-ignore
      path: window.apiExterna.obtenerRutaReal(f)
    }));
    alCambiarArchivos([...archivos, ...nuevosArchivos]);
  };

  return (
    <>
      <div className={`drop-zone ${esArrastrando ? 'activo' : ''}`} onDragOver={(e) => { e.preventDefault(); setEsArrastrando(true) }} onDragLeave={() => setEsArrastrando(false)} onDrop={manejarDrop}>
        <UploadCloud size={50} className="icono-svg" style={{ marginBottom: '10px' }} />
        <h3>{esArrastrando ? '¡Suéltalos aquí, linda! 🎀' : 'Arrastra tus archivos aquí'}</h3>
      </div>
      {archivos.map((archivo: any) => (
        <TarjetaDeArchivoSeleccionado key={archivo.name} nombre={archivo.name} tamaño={archivo.size} tipo={archivo.type} alEliminar={() => alCambiarArchivos(archivos.filter((a: any) => a.name !== archivo.name))} />
      ))}
    </>
  );
}

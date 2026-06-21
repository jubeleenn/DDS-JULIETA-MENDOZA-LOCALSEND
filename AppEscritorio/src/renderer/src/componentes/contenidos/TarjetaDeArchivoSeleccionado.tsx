import { FileText, X } from 'lucide-react';
export function TarjetaDeArchivoSeleccionado({ nombre, tamaño, tipo, alEliminar }: any) {
  const formatear = (b: number) => b < 1048576 ? (b/1024).toFixed(1)+' KB' : (b/1048576).toFixed(1)+' MB';
  return (
    <article className="tarjeta-archivo" style={{ marginTop: '10px' }}>
      <FileText size={24} className="icono-svg" />
      <div className="info-archivo">
        <span className="nombre">{nombre}</span>
        <div className="metadatos">{formatear(tamaño)} • {tipo}</div>
      </div>
      <button onClick={alEliminar} className="boton-secundario" style={{ border: 'none', padding: '5px' }}><X size={18}/></button>
    </article>
  )
}

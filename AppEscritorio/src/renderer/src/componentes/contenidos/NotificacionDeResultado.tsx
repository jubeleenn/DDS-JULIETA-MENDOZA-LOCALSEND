import { CheckCircle2, X } from 'lucide-react';
export function NotificacionDeResultado({ esVisible, nombreArchivo, esRecepcion, alCerrar }: any) {
  if (!esVisible) return null;
  return (
    <div className="notificacion-emergente">
      <CheckCircle2 color="var(--color-acento)" />
      <div><b>{esRecepcion ? 'Recibido' : 'Enviado'}</b><br/><small>{nombreArchivo}</small></div>
      <button onClick={alCerrar} className="boton-secundario" style={{ marginLeft: 'auto', border: 'none' }}><X size={18}/></button>
    </div>
  )
}
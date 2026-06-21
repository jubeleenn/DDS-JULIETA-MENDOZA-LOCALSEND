import { MonitorSmartphone } from 'lucide-react';
export function TarjetaDeDispositivo({ alias, direccionIp, alHacerClick }: any) {
  return (
    <article className="tarjeta-dispositivo" onClick={() => alHacerClick(direccionIp)}>
      <MonitorSmartphone size={28} className="icono-svg" />
      <div><h4 style={{ margin: 0, color: 'var(--color-texto)' }}>{alias}</h4>
      <small style={{ color: 'var(--color-texto-muted)' }}>{direccionIp}</small></div>
    </article>
  )
}
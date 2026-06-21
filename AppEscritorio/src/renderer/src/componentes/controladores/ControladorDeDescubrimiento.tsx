import { useState, useEffect } from 'react'
import { TarjetaDeDispositivo } from '../contenidos/TarjetaDeDispositivo'

export function ControladorDeDescubrimiento({ archivosParaEnviar }: any) {
  const [dispositivos, setDispositivos] = useState<any[]>([])
  useEffect(() => {
    // @ts-ignore
    window.apiExterna?.alActualizarListaDispositivos(setDispositivos)
  }, [])

  const manejarEnvio = (ip: string) => {
    if (archivosParaEnviar.length > 0) {
      // @ts-ignore
      window.apiExterna.enviarArchivosADispositivo(ip, archivosParaEnviar)
    } else {
      alert("🎀 ¡Selecciona un archivo primero!");
    }
  }

  return (
    <>
      {dispositivos.length === 0 ? <p style={{ color: 'var(--color-texto-muted)', textAlign: 'center' }}>Buscando...</p> : null}
      {dispositivos.map((disp: any) => (
        <TarjetaDeDispositivo key={disp.direccionIp} alias={disp.alias} direccionIp={disp.direccionIp} tipo={disp.tipo} alHacerClick={manejarEnvio} />
      ))}
    </>
  )
}

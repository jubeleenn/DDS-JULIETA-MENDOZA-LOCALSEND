import { useState, useEffect } from 'react'
export function ControladorDeConectividad() {
  const [esServidorActivo, setEsServidorActivo] = useState(false)
  useEffect(() => {
    // @ts-ignore
    if (window.apiExterna) {
      // @ts-ignore
      window.apiExterna.solicitarEstadoDelServidor().then(setEsServidorActivo);
      // @ts-ignore
      window.apiExterna.alRecibirCambioDeEstado(setEsServidorActivo);
    }
  }, [])
  return (
    <div className="indicador-conectividad">
      <div className={`led ${esServidorActivo ? 'led-verde' : 'led-rojo'}`}></div>
      <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{esServidorActivo ? 'EN LÍNEA' : 'DESCONECTADO'}</span>
    </div>
  )
}

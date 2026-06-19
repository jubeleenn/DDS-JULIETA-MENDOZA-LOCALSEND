import { contextBridge, ipcRenderer, webUtils } from 'electron' // ✨ Agregamos webUtils aquí
import { electronAPI } from '@electron-toolkit/preload'

const api = {}

const apiLocalSend = {
  escucharDispositivosEnRed: (alEncontrarDispositivo: (dispositivo: any) => void) => {
    ipcRenderer.on('nuevo-dispositivo-udp', (_evento, dispositivo) => {
      alEncontrarDispositivo(dispositivo);
    });
  },
  escucharProgresoTransferencia: (alActualizar: (progreso: any) => void) => {
    ipcRenderer.on('progreso-transferencia', (_evento, progreso) => {
      alActualizar(progreso);
    });
  },
  enviarArchivos: (ipDestino: string, archivos: any[]) => {
    ipcRenderer.send('enviar-archivos', ipDestino, archivos);
  },
  // ✨ LO NUEVO: La llave maestra para extraer la ruta oculta
  obtenerRuta: (archivo: File) => {
    return webUtils.getPathForFile(archivo);
  },
  escucharEnvioCompletado: (alCompletar: (nombre: string) => void) => {
    ipcRenderer.on('envio-completado', (_evento, nombre) => {
      alCompletar(nombre);
    });
  }
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('apiLocalSend', apiLocalSend)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore
  window.apiLocalSend = apiLocalSend
}
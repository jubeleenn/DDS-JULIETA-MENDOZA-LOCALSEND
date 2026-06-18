import { contextBridge, ipcRenderer } from 'electron'
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
  
  seleccionarCarpeta: () => ipcRenderer.invoke('seleccionar-carpeta')
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
import { contextBridge, ipcRenderer, webUtils } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

const apiLocalSend = {
  // Escuchamos el radar y el progreso
  escucharDispositivosEnRed: (cb: any) => ipcRenderer.on('nuevo-dispositivo-udp', (_e, d) => cb(d)),
  escucharProgresoTransferencia: (cb: any) => ipcRenderer.on('progreso-transferencia', (_e, d) => cb(d)),
  
  // ✨ LA MAGIA: Robamos la ruta física real del archivo para que no explote
  obtenerRutaReal: (archivo: File) => webUtils.getPathForFile(archivo),
  
  // Enviamos los archivos al motor
  enviarArchivos: (ip: string, archivos: any[]) => ipcRenderer.send('iniciar-envio', { ip, archivos })
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('apiLocalSend', apiLocalSend);
  } catch (error) { console.error(error); }
} else {
  // @ts-ignore
  window.electron = electronAPI;
  // @ts-ignore
  window.apiLocalSend = apiLocalSend;
}
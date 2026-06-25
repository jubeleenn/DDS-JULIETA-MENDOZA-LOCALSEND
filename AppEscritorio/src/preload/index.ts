import { contextBridge, ipcRenderer, webUtils } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

const apiExterna = {
  obtenerAliasLocal: () => ipcRenderer.invoke('obtener-alias-local'),
  solicitarEstadoDelServidor: () => ipcRenderer.invoke('obtener-estado-servidor'),
  obtenerRutaReal: (archivo: File) => webUtils.getPathForFile(archivo),
  enviarArchivosADispositivo: (direccionIp: string, archivos: any[]) => ipcRenderer.send('iniciar-envio-archivos', { direccionIp, archivos }),
  responderSolicitud: (respuesta: any) => ipcRenderer.send('responder-solicitud', respuesta),
  alRecibirSolicitud: (callback: any) => ipcRenderer.on('nueva-solicitud-entrada', (_e, d) => callback(d)),
  alCambiarEstadoNegociacion: (callback: any) => ipcRenderer.on('estado-negociacion-emisor', (_e, d) => callback(d)),
  alRecibirCambioDeEstado: (callback: any) => ipcRenderer.on('notificar-estado-servidor', (_e, s) => callback(s)),
  alActualizarListaDispositivos: (callback: any) => ipcRenderer.on('actualizar-lista-dispositivos', (_e, l) => callback(l)),
  alRecibirProgreso: (callback: any) => ipcRenderer.on('progreso-transferencia', (_e, d) => callback(d)),
  
  abrirCarpeta: (ruta: string) => ipcRenderer.send('abrir-carpeta', ruta)
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('apiExterna', apiExterna);
  } catch (error) { console.error(error); }
} else {
  // @ts-ignore
  window.electron = electronAPI;
  // @ts-ignore
  window.apiExterna = apiExterna;
}
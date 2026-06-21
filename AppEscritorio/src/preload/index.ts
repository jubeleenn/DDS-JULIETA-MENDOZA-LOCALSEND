import { contextBridge, ipcRenderer, webUtils } from 'electron'

const apiLocalSend = {
  getIdentidad: () => ipcRenderer.invoke('get-identidad'),
  getMotor: () => ipcRenderer.invoke('get-motor'),
  getRuta: (archivo: File) => webUtils.getPathForFile(archivo),
  responder: (respuesta: any) => ipcRenderer.send('respuesta-usuario', respuesta),
  onPeticion: (cb: any) => ipcRenderer.on('alerta-peticion', (_e, d) => cb(d)),
  onNodos: (cb: any) => ipcRenderer.on('nodos-detectados', (_e, d) => cb(d)),
  onAvance: (cb: any) => ipcRenderer.on('avance-transferencia', (_e, d) => cb(d)),
  onEstadoMotor: (cb: any) => ipcRenderer.on('estado-motor', (_e, d) => cb(d)),
  enviar: (ipTarget: string, archivos: any[]) => ipcRenderer.send('disparar-archivos', { ipTarget, archivos })
};

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('apiLocalSend', apiLocalSend);
} else {
  // @ts-ignore
  window.apiLocalSend = apiLocalSend;
}
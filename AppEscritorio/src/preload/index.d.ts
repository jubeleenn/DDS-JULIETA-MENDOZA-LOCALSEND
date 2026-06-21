import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    apiExterna: any // ✨ ESTO ES LO QUE FALTABA
  }
}
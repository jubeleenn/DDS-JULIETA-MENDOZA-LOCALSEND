import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    // ✨ LO NUEVO: Le decimos a Vite que 'ws' es externo y no debe empaquetarlo
    build: {
      rollupOptions: {
        external: ['ws']
      }
    }
  },
  preload: {},
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react({})]
  }
})
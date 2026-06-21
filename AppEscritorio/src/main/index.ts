import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import dgram from 'dgram';
import http from 'http';
import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import fs from 'fs';
import os from 'os';

const PUERTO_APP = 53317;
const IP_BROADCAST = '255.255.255.255';

let ventanaApp: BrowserWindow | null = null;
let identidadCoquette = '';
let motorEncendido = false;
const radarUdp = dgram.createSocket('udp4');
const nodosEnRed = new Map();
const appExpress = express();
const serverHttp = http.createServer(appExpress);
const serverWs = new WebSocketServer({ server: serverHttp });

function generarIdentidad() {
  const ruta = join(app.getPath('userData'), 'identidad_coquette.json');
  try { if (fs.existsSync(ruta)) return JSON.parse(fs.readFileSync(ruta, 'utf-8')).alias; } catch (e) {}
  const adjetivos = ['Linda', 'Dulce', 'Mágica', 'Brillante', 'Tierna', 'Preciosa'];
  const sustantivos = ['Fresa ', 'Estrella ', 'Luna ', 'Cereza ', 'Hada '];
  const nueva = `${adjetivos[Math.floor(Math.random() * adjetivos.length)]} ${sustantivos[Math.floor(Math.random() * sustantivos.length)]}`;
  try { fs.writeFileSync(ruta, JSON.stringify({ alias: nueva })); } catch (e) {}
  return nueva;
}

function levantarMotorWebSockets() {
  serverWs.on('connection', (socket) => {
    let streamDeGuardado: fs.WriteStream | null = null;
    let infoArchivo: any = null;
    let recibidos = 0;
    let momentoInicio = 0;

    socket.on('message', (datos: Buffer, esBinario: boolean) => {
      if (!esBinario) {
        const peticion = JSON.parse(datos.toString());
        if (peticion.tipo === 'PETICION_ENTRANTE') {
          infoArchivo = peticion.datos;
          ventanaApp?.webContents.send('alerta-peticion', infoArchivo);
          
          ipcMain.once('respuesta-usuario', (_e, { aceptar }) => {
            if (aceptar) {
              momentoInicio = Date.now();
              const destino = join(app.getPath('downloads'), infoArchivo.nombre);
              streamDeGuardado = fs.createWriteStream(destino);
              socket.send(JSON.stringify({ tipo: 'PETICION_ACEPTADA' }));
            } else {
              socket.send(JSON.stringify({ tipo: 'PETICION_DENEGADA' }));
              socket.close();
            }
          });
        }
      } else if (streamDeGuardado) {
        streamDeGuardado.write(datos);
        recibidos += datos.length;
        const segundos = (Date.now() - momentoInicio) / 1000;
        const vel = (recibidos / (1024 * 1024) / (segundos || 1)).toFixed(2);
        const porc = ((recibidos / infoArchivo.size) * 100).toFixed(2);
        ventanaApp?.webContents.send('avance-transferencia', { nombre: infoArchivo.nombre, porcentaje: porc, velocidad: vel, recibiendo: true });
      }
    });

    socket.on('close', () => {
      if (streamDeGuardado) {
        streamDeGuardado.end();
        ventanaApp?.webContents.send('avance-transferencia', { nombre: infoArchivo?.nombre, porcentaje: "100.00", velocidad: "0.00", recibiendo: true });
      }
    });
  });

  serverHttp.listen(PUERTO_APP, '0.0.0.0', () => {
    motorEncendido = true;
    ventanaApp?.webContents.send('estado-motor', true);
  });
}

ipcMain.on('disparar-archivos', (_e, { ipTarget, archivos }) => {
  archivos.forEach((file: any) => {
    if (!file.path) return;
    const socket = new WebSocket(`ws://${ipTarget}:${PUERTO_APP}`);
    
    socket.on('open', () => {
      socket.send(JSON.stringify({ tipo: 'PETICION_ENTRANTE', datos: { nombre: file.name, size: file.size } }));
    });

    socket.on('message', (datos: Buffer) => {
      const res = JSON.parse(datos.toString());
      if (res.tipo === 'PETICION_ACEPTADA') {
        const momentoInicio = Date.now();
        const streamLectura = fs.createReadStream(file.path);
        let enviados = 0;
        streamLectura.on('data', (chunk) => {
          enviados += chunk.length;
          socket.send(chunk);
          const segundos = (Date.now() - momentoInicio) / 1000;
          ventanaApp?.webContents.send('avance-transferencia', { nombre: file.name, porcentaje: ((enviados / file.size) * 100).toFixed(2), velocidad: (enviados / (1024 * 1024) / (segundos || 1)).toFixed(2), recibiendo: false });
        });
        streamLectura.on('end', () => socket.close());
      }
    });
  });
});

function activarRadarUdp() {
  radarUdp.on('message', (msg, info) => {
    try {
      const paquete = JSON.parse(msg.toString());
      const misIps = Object.values(os.networkInterfaces()).flat().filter(it => it?.family === 'IPv4' && !it.internal).map(it => it?.address);
      if (!misIps.includes(info.address)) {
        nodosEnRed.set(info.address, { datos: { ...paquete, ip: info.address }, visto: Date.now() });
        ventanaApp?.webContents.send('nodos-detectados', Array.from(nodosEnRed.values()).map(n => n.datos));
      }
    } catch (e) {}
  });

  radarUdp.bind(PUERTO_APP, '0.0.0.0', () => {
    radarUdp.setBroadcast(true);
    setInterval(() => {
      if (motorEncendido) radarUdp.send(JSON.stringify({ alias: identidadCoquette, tipo: 'Computadora' }), PUERTO_APP, IP_BROADCAST);
    }, 5000);
  });
}

app.whenReady().then(() => {
  identidadCoquette = generarIdentidad();
  ventanaApp = new BrowserWindow({
    width: 900, height: 670, autoHideMenuBar: true,
    webPreferences: { preload: join(__dirname, '../preload/index.js'), sandbox: false, contextIsolation: true }
  });
  if (process.env.ELECTRON_RENDERER_URL) ventanaApp.loadURL(process.env.ELECTRON_RENDERER_URL);
  else ventanaApp.loadFile(join(__dirname, '../renderer/index.html'));

  levantarMotorWebSockets();
  activarRadarUdp();
});

// ✨ ESTOS SON LOS DOS HANDLERS QUE FALTABAN O NO ESTABAN GUARDADOS
ipcMain.handle('get-motor', () => motorEncendido);
ipcMain.handle('get-identidad', () => identidadCoquette);
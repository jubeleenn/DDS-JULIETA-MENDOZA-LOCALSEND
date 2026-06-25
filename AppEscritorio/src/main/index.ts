import { app, BrowserWindow, ipcMain, shell } from 'electron'; // ✨ AGREGAMOS 'shell'
import { join } from 'path';
import dgram from 'dgram';
import http from 'http';
import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import fs from 'fs';
import os from 'os';

const PUERTO_OFICIAL = 53317;
const DIRECCION_BROADCAST = '255.255.255.255';
const ACCION_SOLICITAR = 'SOLICITAR_TRANSFERENCIA';
const ACCION_ACEPTAR = 'ACEPTAR_TRANSFERENCIA';
const ACCION_RECHAZAR = 'RECHAZAR_TRANSFERENCIA';

let ventanaPrincipal: BrowserWindow | null = null;
let aliasLocal = '';
let esServidorActivo = false;
const servidorUdp = dgram.createSocket('udp4');
const dispositivosDetectados = new Map();

const appExpress = express();
const servidorHttp = http.createServer(appExpress);
const servidorWs = new WebSocketServer({ server: servidorHttp });
const transferenciasHttp = new Map(); 

function obtenerAliasUnico() {
  const rutaAjustes = join(app.getPath('userData'), 'ajustes.json');
  try { if (fs.existsSync(rutaAjustes)) return JSON.parse(fs.readFileSync(rutaAjustes, 'utf-8')).alias; } catch (e) {}
  const adjetivos = ['Veloz', 'Alegre', 'Valiente', 'Dulce', 'Brillante', 'Tierna'];
  const nombres = ['Fresa', 'Hada', 'Estrella', 'Luna', 'Cereza'];
  const nuevoAlias = `${adjetivos[Math.floor(Math.random() * adjetivos.length)]} ${nombres[Math.floor(Math.random() * nombres.length)]}`;
  try { fs.writeFileSync(rutaAjustes, JSON.stringify({ alias: nuevoAlias })); } catch (e) {}
  return nuevoAlias;
}

appExpress.get('/descargar/:token', (req, res) => {
  const rutaFisica = transferenciasHttp.get(req.params.token);
  if (rutaFisica && fs.existsSync(rutaFisica)) {
    res.download(rutaFisica);
  } else {
    res.status(404).send('<h1>El archivo ya no está disponible 🎀</h1>');
  }
});

function iniciarServidorDeNegociacion() {
  servidorWs.on('connection', (socket) => {
    let flujoEscritura: fs.WriteStream | null = null;
    let metadatos: any = null;
    let bytesRecibidos = 0;
    let tiempoInicio = 0;

    socket.on('message', (datos: Buffer) => {
      if (flujoEscritura) {
        flujoEscritura.write(datos);
        bytesRecibidos += datos.length;
        const duracion = (Date.now() - tiempoInicio) / 1000;
        const velocidad = (bytesRecibidos / (1024 * 1024) / (duracion || 1)).toFixed(2);
        const porcentaje = ((bytesRecibidos / (metadatos?.size || 1)) * 100).toFixed(2);
        ventanaPrincipal?.webContents.send('progreso-transferencia', {
          nombre: metadatos?.nombre || 'Archivo', porcentaje, velocidad, esRecepcion: true
        });
        return;
      }

      try {
        const mensaje = JSON.parse(datos.toString());
        if (mensaje.accion === ACCION_SOLICITAR) {
          metadatos = mensaje.metadatos;
          ventanaPrincipal?.webContents.send('nueva-solicitud-entrada', metadatos);

          ipcMain.removeAllListeners('responder-solicitud');
          ipcMain.once('responder-solicitud', (_e, { aceptada }) => {
            if (aceptada) {
              tiempoInicio = Date.now();
              const nombreSeguro = metadatos?.nombre || `archivo_recibido_${Date.now()}.bin`;
              const rutaDestino = join(app.getPath('downloads'), nombreSeguro);
              flujoEscritura = fs.createWriteStream(rutaDestino);
              socket.send(JSON.stringify({ accion: ACCION_ACEPTAR }));
            } else {
              socket.send(JSON.stringify({ accion: ACCION_RECHAZAR }));
              socket.close();
            }
          });
        }
      } catch (e) { console.error("Error al procesar el mensaje", e); }
    });

    socket.on('close', () => {
      if (flujoEscritura) {
        const rutaFinal = flujoEscritura.path; // ✨ CAPTURAMOS LA RUTA FÍSICA
        flujoEscritura.end();
        ventanaPrincipal?.webContents.send('progreso-transferencia', {
          nombre: metadatos?.nombre || 'Archivo', 
          porcentaje: "100.00", 
          velocidad: "0.00", 
          esRecepcion: true,
          ruta: rutaFinal // ✨ SE LA ENVIAMOS AL FRONTEND
        });
      }
    });
  });

  servidorHttp.listen(PUERTO_OFICIAL, '0.0.0.0', () => {
    esServidorActivo = true;
    ventanaPrincipal?.webContents.send('notificar-estado-servidor', true);
  });
}

ipcMain.on('iniciar-envio-archivos', (_e, { direccionIp, archivos }) => {
  archivos.forEach((archivo: any) => {
    if (!archivo.path) return;

    const dispo = dispositivosDetectados.get(direccionIp);
    const esCelular = dispo?.datos?.tipo === 'Celular' || dispo?.datos?.tipo === 'Teléfono' || dispo?.datos?.tipo === 'Móvil';

    if (esCelular) {
        const token = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
        transferenciasHttp.set(token, archivo.path); 
        const aviso = JSON.stringify({ accion: 'DESCARGA_HTTP_MOVIL', metadatos: { nombre: archivo.name, size: archivo.size, token } });
        servidorUdp.send(aviso, PUERTO_OFICIAL, direccionIp);

        ventanaPrincipal?.webContents.send('estado-negociacion-emisor', { nombre: archivo.name, estado: 'aceptada' });
        ventanaPrincipal?.webContents.send('progreso-transferencia', { nombre: archivo.name, porcentaje: "100.00", velocidad: "Enviado link al celular", esRecepcion: false });
        return; 
    }

    const socket = new WebSocket(`ws://${direccionIp}:${PUERTO_OFICIAL}`);
    socket.on('error', () => ventanaPrincipal?.webContents.send('estado-negociacion-emisor', { nombre: archivo.name, estado: 'negada' }));
    
    socket.on('open', () => {
      socket.send(JSON.stringify({ accion: ACCION_SOLICITAR, metadatos: { nombre: archivo.name, size: archivo.size } }));
      ventanaPrincipal?.webContents.send('estado-negociacion-emisor', { nombre: archivo.name, estado: 'esperando' });
    });
    
    socket.on('message', (datos: Buffer) => {
      const respuesta = JSON.parse(datos.toString());
      if (respuesta.accion === ACCION_ACEPTAR) {
        ventanaPrincipal?.webContents.send('estado-negociacion-emisor', { nombre: archivo.name, estado: 'aceptada' });
        const tiempoInicio = Date.now();
        const flujoLectura = fs.createReadStream(archivo.path);
        let bytesEnviados = 0;
        
        flujoLectura.on('data', (chunk) => {
          bytesEnviados += chunk.length;
          socket.send(chunk);
          const duracion = (Date.now() - tiempoInicio) / 1000;
          ventanaPrincipal?.webContents.send('progreso-transferencia', {
            nombre: archivo.name, porcentaje: ((bytesEnviados / archivo.size) * 100).toFixed(2), velocidad: (bytesEnviados / (1024 * 1024) / (duracion || 1)).toFixed(2), esRecepcion: false
          });
        });
        flujoLectura.on('end', () => socket.close());
      } else {
        ventanaPrincipal?.webContents.send('estado-negociacion-emisor', { nombre: archivo.name, estado: 'negada' });
      }
    });
  });
});

function iniciarDescubrimientoUdp() {
  servidorUdp.on('message', (msg, info) => {
    try {
      const datos = JSON.parse(msg.toString());
      if (datos.alias === aliasLocal) return;

      const misIps = Object.values(os.networkInterfaces()).flat().filter(it => it?.family === 'IPv4' && !it.internal).map(it => it?.address);
      if (!misIps.includes(info.address)) {
        dispositivosDetectados.set(info.address, { datos: { ...datos, direccionIp: info.address }, ultimaVezVisto: Date.now() });
        ventanaPrincipal?.webContents.send('actualizar-lista-dispositivos', Array.from(dispositivosDetectados.values()).map(d => d.datos));
      }
    } catch (e) {}
  });

  servidorUdp.bind(PUERTO_OFICIAL, '0.0.0.0', () => {
    servidorUdp.setBroadcast(true);
    setInterval(() => {
      if (esServidorActivo) {
        const beacon = JSON.stringify({ alias: aliasLocal, tipo: 'Computadora', puerto: PUERTO_OFICIAL });
        servidorUdp.send(beacon, PUERTO_OFICIAL, DIRECCION_BROADCAST);
      }
      const ahora = Date.now();
      let limpiar = false;
      for (const [ip, dispo] of dispositivosDetectados.entries()) {
        if (ahora - dispo.ultimaVezVisto > 12000) { dispositivosDetectados.delete(ip); limpiar = true; }
      }
      if (limpiar) ventanaPrincipal?.webContents.send('actualizar-lista-dispositivos', Array.from(dispositivosDetectados.values()).map(d => d.datos));
    }, 5000);
  });
}

app.whenReady().then(() => {
  aliasLocal = obtenerAliasUnico();
  ventanaPrincipal = new BrowserWindow({
    width: 900, height: 670, show: false, autoHideMenuBar: true,
    webPreferences: { preload: join(__dirname, '../preload/index.js'), sandbox: false, contextIsolation: true }
  });
  ventanaPrincipal.on('ready-to-show', () => {
    ventanaPrincipal?.show();
    ventanaPrincipal?.webContents.send('configurar-alias-local', aliasLocal);
  });
  if (process.env.ELECTRON_RENDERER_URL) ventanaPrincipal.loadURL(process.env.ELECTRON_RENDERER_URL);
  else ventanaPrincipal.loadFile(join(__dirname, '../renderer/index.html'));
  iniciarServidorDeNegociacion();
  iniciarDescubrimientoUdp();
});

ipcMain.handle('obtener-estado-servidor', () => esServidorActivo);
ipcMain.handle('obtener-alias-local', () => aliasLocal);

// ✨ NUEVO: Escuchador para abrir la carpeta directamente
ipcMain.on('abrir-carpeta', (_e, ruta) => {
  shell.showItemInFolder(ruta);
});

app.on('window-all-closed', () => app.quit());
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { join } from 'path';
import dgram, { RemoteInfo } from 'dgram'; 
import { createServer, Socket } from 'net'; 
import { createWriteStream } from 'fs';     
const PUERTO_DESCUBRIMIENTO = 53317;
const PUERTO_TRANSFERENCIA = 53318; 
const ANCHO_VENTANA = 900;
const ALTO_VENTANA = 670;

let ventanaPrincipal: BrowserWindow | null = null;

// ==========================================
// SERVIDOR 1: RADAR UDP (Descubrimiento)
// ==========================================
function iniciarServidorDeDescubrimientoUdp(): void {
    try {
        const servidorUdp = dgram.createSocket({ type: 'udp4', reuseAddr: true });

        servidorUdp.on('error', (errorDeRed) => {
            console.error(`❌ ERROR CRÍTICO DE RED: El puerto UDP ${PUERTO_DESCUBRIMIENTO} está ocupado.`);
            servidorUdp.close();
        });

        servidorUdp.on('message', (mensajeRecibido: Buffer, informacionDelEmisor: RemoteInfo) => {
            const dispositivoDetectado = {
                id: informacionDelEmisor.address,
                alias: `Dispositivo en ${informacionDelEmisor.address}`, 
                tipo: 'Móvil', 
                esConocido: false
            };
            if (ventanaPrincipal) {
                ventanaPrincipal.webContents.send('nuevo-dispositivo-udp', dispositivoDetectado);
            }
        });

        servidorUdp.bind(PUERTO_DESCUBRIMIENTO, () => {
            console.log(`✅ Servidor UDP (Radar) escuchando en el puerto ${PUERTO_DESCUBRIMIENTO}...`);
        });
    } catch (error) {
        console.error("No se pudo crear el socket UDP:", error);
    }
}

// ==========================================
// SERVIDOR 2: TRANSFERENCIA TCP (Archivos)
// ==========================================
function iniciarServidorDeTransferenciaTcp(): void {
    try {
        const servidorTcp = createServer((conexion: Socket) => {
            let archivoStreamNoBloqueante: ReturnType<typeof createWriteStream> | null = null;
            let metadatosDelArchivo: any = null;
            let bytesRecibidos = 0;

            conexion.on('data', (fragmentoDatos: Buffer) => {
                if (!metadatosDelArchivo) {
                    try {
                        metadatosDelArchivo = JSON.parse(fragmentoDatos.toString());
                        
                        const rutaDescargas = app.getPath('downloads');
                        const rutaFinalDelArchivo = join(rutaDescargas, metadatosDelArchivo.nombre);
                        
                        archivoStreamNoBloqueante = createWriteStream(rutaFinalDelArchivo);
                        console.log(`📥 Iniciando descarga de: ${metadatosDelArchivo.nombre}`);
                    } catch (errorDeParseo) {
                        console.error("Esperando metadatos válidos...");
                    }
                } else {
            
                    if (archivoStreamNoBloqueante) {
                        archivoStreamNoBloqueante.write(fragmentoDatos);
                        bytesRecibidos += fragmentoDatos.length;

                        
                        const porcentaje = Math.round((bytesRecibidos / metadatosDelArchivo.peso) * 100);
                        if (ventanaPrincipal) {
                            ventanaPrincipal.webContents.send('progreso-transferencia', { 
                                nombre: metadatosDelArchivo.nombre, 
                                porcentaje: porcentaje 
                            });
                        }
                    }
                }
            });

            conexion.on('end', () => {
                if (archivoStreamNoBloqueante) {
                    archivoStreamNoBloqueante.end();
                    console.log(`🎉 Transferencia finalizada. Archivo guardado en Descargas.`);
                }
            });
            
            conexion.on('error', (errorDeConexion) => {
                console.error("❌ Error en la transferencia TCP:", errorDeConexion);
            });
        });

        servidorTcp.listen(PUERTO_TRANSFERENCIA, () => {
            console.log(`✅ Servidor TCP (Archivos) escuchando en el puerto ${PUERTO_TRANSFERENCIA}...`);
        });
    } catch (errorDeServidor) {
        console.error("No se pudo iniciar el servidor TCP:", errorDeServidor);
    }
}

// ==========================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ==========================================
function crearVentanaPrincipal(): void {
    try {
        ventanaPrincipal = new BrowserWindow({
            width: ANCHO_VENTANA,
            height: ALTO_VENTANA,
            autoHideMenuBar: true,
            webPreferences: {
                preload: join(__dirname, '../preload/index.js'),
                sandbox: false
            }
        });

        if (process.env['ELECTRON_RENDERER_URL']) {
            ventanaPrincipal.loadURL(process.env['ELECTRON_RENDERER_URL']);
        } else {
            ventanaPrincipal.loadFile(join(__dirname, '../renderer/index.html'));
        }
    } catch (errorDeVentana) {
        console.error("Error al crear la ventana principal:", errorDeVentana);
    }
}

app.whenReady().then(() => {
  crearVentanaPrincipal();
  
  iniciarServidorDeDescubrimientoUdp();
  iniciarServidorDeTransferenciaTcp();

  ipcMain.handle('seleccionar-carpeta', async () => {
    const resultado = await dialog.showOpenDialog(ventanaPrincipal!, {
      properties: ['openDirectory'] 
    });
    return resultado.canceled ? null : resultado.filePaths;
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) crearVentanaPrincipal();
  });
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
import React, { useState, useEffect, useRef } from 'react';
import { Heart, UploadCloud, Smartphone, Monitor, Trash2, Sparkles } from 'lucide-react';
import './App.css';

export default function App() {
  const [identidad, setIdentidad] = useState('...');
  const [enLinea, setEnLinea] = useState(false);
  const [dispositivos, setDispositivos] = useState<any[]>([]);
  const [peticionEntrante, setPeticionEntrante] = useState<any>(null);
  const [progreso, setProgreso] = useState<any>(null);

  const [archivosGlobales, setArchivosGlobales] = useState<any[]>([]);
  const [esArrastrando, setEsArrastrando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // @ts-ignore
    const api = window.apiExterna;
    if (api) {
      api.obtenerAliasLocal().then(setIdentidad);
      api.solicitarEstadoDelServidor().then(setEnLinea);
      api.alRecibirCambioDeEstado(setEnLinea);
      api.alActualizarListaDispositivos(setDispositivos);
      api.alRecibirSolicitud(setPeticionEntrante);
      
      api.alRecibirProgreso((datos: any) => {
        setProgreso(datos);
        // ✨ Le quitamos el setTimeout aquí. ¡Ahora la barra no desaparecerá sola!
      });
    }
  }, []);

  const resolverPeticion = (aceptar: boolean) => {
    // @ts-ignore
    window.apiExterna?.responderSolicitud({ aceptada: aceptar });
    setPeticionEntrante(null);
  };

  const iniciarTransferencia = (ip: string) => {
    if (archivosGlobales.length === 0) return alert('🎀 Por favor, selecciona un archivo primero.');
    // @ts-ignore
    window.apiExterna?.enviarArchivosADispositivo(ip, archivosGlobales);
  };

  const manejarDrop = (e: React.DragEvent) => {
    e.preventDefault(); setEsArrastrando(false);
    const nuevos = Array.from(e.dataTransfer.files).map((f: any) => ({
      name: f.name, size: f.size, type: f.type || 'Archivo',
      // @ts-ignore
      path: window.apiExterna?.obtenerRutaReal ? window.apiExterna.obtenerRutaReal(f) : f.path 
    }));
    setArchivosGlobales(prev => [...prev, ...nuevos]);
  };

  const formatearPeso = (bytes: number) => {
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <main className="app-flotante">
      <header className="header-pastilla">
        <div className="logo-contenedor">
          <Heart size={26} fill="var(--color-acento)" className="brillo-icono" />
          <h1 className="texto-glow">LocalSend</h1>
        </div>
        <div className="status-badge">
           <div className={`led ${enLinea ? 'led-on' : 'led-off'}`} />
           <span className="texto-brillante">{identidad === '...' ? 'Conectando...' : identidad}</span>
        </div>
      </header>

      <section className="contenedor-central">
        <div 
          className={`drop-glass ${esArrastrando ? 'drop-activo' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setEsArrastrando(true); }}
          onDragLeave={() => setEsArrastrando(false)}
          onDrop={manejarDrop}
          onClick={() => inputRef.current?.click()}
        >
          <UploadCloud size={60} color="var(--color-acento)" className="brillo-icono" style={{ marginBottom: '15px' }} />
          <h2>{esArrastrando ? 'Suelta los archivos aquí ✨' : 'Arrastra archivos o toca aquí'}</h2>
          <p>Preparando archivos para enviar</p>
          
          <input type="file" multiple ref={inputRef} style={{display: 'none'}} onChange={(e) => {
            if (e.target.files) {
              const arr = Array.from(e.target.files).map((f: any) => ({ 
                  name: f.name, size: f.size, 
                  // @ts-ignore
                  path: window.apiExterna?.obtenerRutaReal ? window.apiExterna.obtenerRutaReal(f) : f.path 
              }));
              setArchivosGlobales(prev => [...prev, ...arr]);
            }
          }} />
        </div>

        <div className="listado-burbujas">
          {archivosGlobales.map((arch: any, i: number) => (
            <div key={i} className="burbuja-archivo">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span className="recorte-texto">{arch.name}</span>
                <span style={{ fontSize: '12px', color: 'var(--color-acento)' }}>
                  {formatearPeso(arch.size)}
                </span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setArchivosGlobales(prev => prev.filter((_, idx) => idx !== i)); }}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {progreso && (
          <div className="burbuja-progreso" style={{ height: 'auto', paddingBottom: '15px' }}>
            <div className="progreso-info">
              <span className="recorte-texto">{progreso.nombre}</span>
              <strong className="texto-glow">{progreso.porcentaje}%</strong>
            </div>
            <div className="barra-fondo">
              <div className="barra-llena" style={{ width: `${progreso.porcentaje}%` }} />
            </div>

            {/* ✨ NUEVO: Interfaz de Archivo Completado */}
            {parseFloat(progreso.porcentaje) >= 100 && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px', justifyContent: 'center' }}>
                {progreso.ruta && (
                  <button 
                    className="btn-primario" 
                    onClick={() => {
                        // @ts-ignore
                        window.apiExterna?.abrirCarpeta(progreso.ruta);
                        setProgreso(null);
                    }}
                    style={{ fontSize: '13px', padding: '8px 15px' }}
                  >
                    Abrir archivo
                  </button>
                )}
                <button 
                  className="btn-secundario" 
                  onClick={() => setProgreso(null)}
                  style={{ fontSize: '13px', padding: '8px 15px' }}
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      <footer className="dock-inferior">
        <div className="titulo-dock">
          <Sparkles size={18} color="var(--color-acento)" className="brillo-icono" />
          <span className="texto-glow">Dispositivos Cercanos</span>
        </div>
        
        <div className="carrusel-dispositivos">
          {dispositivos.length === 0 ? <p className="mute-text">Buscando dispositivos...</p> : (
            dispositivos.map((d: any, i: number) => (
              <div key={i} className="burbuja-nodo" onClick={() => iniciarTransferencia(d.direccionIp)}>
                <div className="nodo-icono">
                  {d.tipo === 'Computadora' ? <Monitor size={28} /> : <Smartphone size={28} />}
                </div>
                <strong>{d.alias}</strong>
              </div>
            ))
          )}
        </div>
      </footer>

      {peticionEntrante && (
        <div className="overlay-glass">
          <div className="modal-coquette">
            <Heart size={55} color="var(--color-acento)" fill="var(--color-fondo-boton)" className="latido brillo-icono" />
            <h2 className="texto-glow">Transferencia Entrante</h2>
            <p>¿Deseas recibir <b>{peticionEntrante.nombre}</b>?</p>
            <div className="botones">
              <button className="btn-secundario" onClick={() => resolverPeticion(false)}>Rechazar</button>
              <button className="btn-primario" onClick={() => resolverPeticion(true)}>Aceptar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
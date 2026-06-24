import React, { useState, useRef } from 'react';
import { useMotorLocalSend } from './Hooks/useMotorLocalSend';
import { Heart, UploadCloud, Smartphone, Monitor, Trash2, Sparkles } from 'lucide-react';
import './App.css';

export default function App() {
  const { identidad, enLinea, dispositivos, peticionEntrante, progreso, resolverPeticion, enviarArchivos } = useMotorLocalSend();
  const [archivosGlobales, setArchivosGlobales] = useState<any[]>([]);
  const [esArrastrando, setEsArrastrando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ✨ AQUÍ EXTRAEMOS LAS RUTAS FÍSICAS AL ARRASTRAR
  const manejarDrop = (e: React.DragEvent) => {
    e.preventDefault(); setEsArrastrando(false);
    const nuevos = Array.from(e.dataTransfer.files).map((f: any) => ({
      name: f.name, size: f.size, type: f.type || 'Archivo',
      path: f.path 
    }));
    setArchivosGlobales(prev => [...prev, ...nuevos]);
  };

  const iniciarTransferencia = (ip: string) => {
    if (archivosGlobales.length > 0) enviarArchivos(ip, archivosGlobales);
    else alert('🎀 Por favor, selecciona un archivo primero.');
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
          
          {/* ✨ AQUÍ TAMBIÉN ROBAMOS EL PATH AL SELECCIONAR CON CLIC */}
          <input type="file" multiple ref={inputRef} style={{display: 'none'}} onChange={(e) => {
            if (e.target.files) {
              const arr = Array.from(e.target.files).map((f: any) => ({ 
                  name: f.name, size: f.size, 
                  path: f.path 
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
          <div className="burbuja-progreso">
            <div className="progreso-info">
              <span className="recorte-texto">{progreso.nombre}</span>
              <strong className="texto-glow">{progreso.porcentaje}%</strong>
            </div>
            <div className="barra-fondo">
              <div className="barra-llena" style={{ width: `${progreso.porcentaje}%` }} />
            </div>
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
              <div key={i} className="burbuja-nodo" onClick={() => iniciarTransferencia(d.ip)}>
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
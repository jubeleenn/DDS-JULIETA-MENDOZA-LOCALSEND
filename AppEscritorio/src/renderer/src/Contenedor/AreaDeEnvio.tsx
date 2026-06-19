import React, { useState, useRef, useEffect } from 'react';
import { FileText, Folder, RefreshCcw, Radar, Heart, Settings, TerminalSquare, Server, Smartphone, Monitor, Globe } from 'lucide-react';
import { BotonParaSeleccion } from '../Contenido/BotonParaSeleccion';
import { ModalFavoritosVacio, ModalAgregarFavorito, ModalExplicacionModos, MenuModosDeEnvio } from '../Contenido/ModalesSecundarios';
import { formatearPeso, BotonConHover, PantallaEditarSeleccion } from '../Contenido/ComponentesDeSeleccion';

interface PropsEnvio {
  archivosGlobales: File[];
  alAgregarArchivos: (archivos: File[]) => void;
  alLimpiarArchivos: () => void;
  alEliminarArchivo: (i: number) => void;
}

export function AreaDeEnvio({ archivosGlobales, alAgregarArchivos, alLimpiarArchivos, alEliminarArchivo }: PropsEnvio) {
  // ESTADOS DE UI
  const [esMenuModoEnvioActivo, asignarEsMenuModoEnvioActivo] = useState(false);
  const [esModalFavoritosActivo, asignarEsModalFavoritosActivo] = useState(false);
  const [esModalAgregarFavoritoActivo, asignarEsModalAgregarFavoritoActivo] = useState(false);
  const [esModalExplicacionActivo, asignarEsModalExplicacionActivo] = useState(false);
  const [esModalEnvioManualActivo, asignarEsModalEnvioManualActivo] = useState(false);
  const [esModoEdicion, asignarEsModoEdicion] = useState(false);
  const [modoDeEnvioSeleccionado, asignarModoDeEnvioSeleccionado] = useState('unico');

  // ESTADOS DE ANIMACIÓN Y RED
  const [dispositivosEnRed, asignarDispositivosEnRed] = useState<any[]>([]);
  const [indiceIconoAnimado, asignarIndiceIconoAnimado] = useState(0);
  const [esBuscando, asignarEsBuscando] = useState(false);

  const referenciaInputArchivo = useRef<HTMLInputElement>(null);
  const referenciaInputCarpeta = useRef<HTMLInputElement>(null);

  const pesoTotal = archivosGlobales.reduce((acc, arch) => acc + arch.size, 0);
  const tieneArchivos = archivosGlobales.length > 0;
  const iconosAnimados = [TerminalSquare, Server, Smartphone, Monitor, Globe];

  useEffect(() => {
    const intervalo = setInterval(() => {
      asignarIndiceIconoAnimado((prev) => (prev + 1) % iconosAnimados.length);
    }, 2000);
    return () => clearInterval(intervalo);
  }, [iconosAnimados.length]);

  // RECEPTOR UDP CON TTL
  useEffect(() => {
    // @ts-ignore
    if (window.apiLocalSend) {
      // @ts-ignore
      window.apiLocalSend.escucharDispositivosEnRed((nuevoDispositivo) => {
        asignarDispositivosEnRed((listaActual) => {
          const horaActual = Date.now();
          const listaActualizada = listaActual.filter(d => d.id !== nuevoDispositivo.id);
          return [...listaActualizada, { ...nuevoDispositivo, ultimaVezVisto: horaActual }];
        });
      });
    }
  }, []);

  useEffect(() => {
    // @ts-ignore
    if (window.apiLocalSend && window.apiLocalSend.escucharEnvioCompletado) {
      // @ts-ignore
      window.apiLocalSend.escucharEnvioCompletado((nombre) => {
        alert(`✅ ¡El archivo "${nombre}" fue enviado exitosamente!`);
      });
    }
  }, []);

  useEffect(() => {
    const limpiadorTtl = setInterval(() => {
      const horaActual = Date.now();
      asignarDispositivosEnRed((listaActual) => 
        listaActual.filter(d => (horaActual - d.ultimaVezVisto) < 6000)
      );
    }, 2000);

    return () => clearInterval(limpiadorTtl);
  }, []);

  const manejarSeleccionNativa = (evento: React.ChangeEvent<HTMLInputElement>) => {
    if (evento.target.files && evento.target.files.length > 0) {
      alAgregarArchivos(Array.from(evento.target.files));
    }
  };

  const manejarGiroBusqueda = () => {
    asignarEsBuscando(true);
    setTimeout(() => asignarEsBuscando(false), 1000);
  };

  // ✨ FILTRO DE SEGURIDAD ACTUALIZADO CON WEBUTILS
  const manejarEnvio = (ipDestino: string) => {
    if (archivosGlobales.length === 0) {
      alert("⚠️ Por favor, selecciona al menos un archivo primero.");
      return;
    }

    // Extraemos la ruta real usando la herramienta que pusimos en el preload
    const archivosAEnviar = archivosGlobales
      .map(archivo => {
        // @ts-ignore
        const rutaFisica = window.apiLocalSend.obtenerRuta(archivo);
        return {
          name: archivo.name,
          size: archivo.size,
          path: rutaFisica
        };
      })
      .filter(archivo => archivo.path !== "" && archivo.path !== undefined);

    if (archivosAEnviar.length === 0) {
      alert("❌ Error: No se pudo extraer la ruta física por seguridad de Electron.");
      return;
    }

    // @ts-ignore
    if (window.apiLocalSend) {
      // @ts-ignore
      window.apiLocalSend.enviarArchivos(ipDestino, archivosAEnviar);
      alLimpiarArchivos(); 
    }
  };

  return (
    <section style={{ flex: 1, backgroundColor: 'var(--color-fondo)', padding: '40px 50px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* MODALES SEGUROS RESTAURADOS (Borramos el Modal de Texto) */}
      {esModalFavoritosActivo && <ModalFavoritosVacio alCancelar={() => asignarEsModalFavoritosActivo(false)} alAgregar={() => { asignarEsModalFavoritosActivo(false); asignarEsModalAgregarFavoritoActivo(true); }} />}
      {esModalAgregarFavoritoActivo && <ModalAgregarFavorito alCancelar={() => asignarEsModalAgregarFavoritoActivo(false)} />}
      {esModalEnvioManualActivo && <ModalAgregarFavorito alCancelar={() => asignarEsModalEnvioManualActivo(false)} />}
      {esMenuModoEnvioActivo && <MenuModosDeEnvio modoActual={modoDeEnvioSeleccionado} alSeleccionarModo={asignarModoDeEnvioSeleccionado} alCerrar={() => asignarEsMenuModoEnvioActivo(false)} alAbrirExplicacion={() => { asignarEsMenuModoEnvioActivo(false); asignarEsModalExplicacionActivo(true); }} />}
      {esModalExplicacionActivo && <ModalExplicacionModos alCerrar={() => asignarEsModalExplicacionActivo(false)} />}
      
      {esModoEdicion && (
        <PantallaEditarSeleccion
          archivos={archivosGlobales}
          alCerrar={() => asignarEsModoEdicion(false)}
          alEliminarArchivo={alEliminarArchivo}
          alEliminarTodo={() => {
            alLimpiarArchivos();
            asignarEsModoEdicion(false);
          }}
        />
      )}

      <input type="file" multiple ref={referenciaInputArchivo} onChange={manejarSeleccionNativa} style={{ display: 'none' }} />
      {/* @ts-ignore */}
      <input type="file" ref={referenciaInputCarpeta} webkitdirectory="true" style={{ display: 'none' }} />

      {/* SECCIÓN 1: SELECCIÓN */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px', color: 'var(--color-texto)' }}>Selección</h3>
        
        {tieneArchivos ? (
          <div style={{ backgroundColor: 'var(--color-caja)', padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ backgroundColor: 'var(--color-fondo-boton)', padding: '15px', borderRadius: '12px' }}>
                 <FileText size={32} color="var(--color-texto)" />
              </div>
              <div>
                <p style={{ margin: 0, color: 'var(--color-texto)', fontSize: '18px' }}>Archivos: {archivosGlobales.length}</p>
                <p style={{ margin: '5px 0 0 0', color: '#8a9994', fontSize: '14px' }}>Tamaño: {formatearPeso(pesoTotal)}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <BotonConHover texto="Editar" alHacerClic={() => asignarEsModoEdicion(true)} />
              <BotonConHover texto="+ Añadir" esPrimario alHacerClic={() => referenciaInputArchivo.current?.click()} />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '15px' }}>
            <BotonParaSeleccion icono={<FileText size={28} />} texto="Archivo" alHacerClic={() => referenciaInputArchivo.current?.click()} />
            <BotonParaSeleccion icono={<Folder size={28} />} texto="Carpeta" alHacerClic={() => referenciaInputCarpeta.current?.click()} />
            {/* ✨ Eliminamos los botones de Texto y Pegar para proteger la demo */}
          </div>
        )}
      </div>

      {/* SECCIÓN 2: DISPOSITIVOS CERCANOS */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '500', margin: 0, color: 'var(--color-texto)' }}>Dispositivos Cercanos</h3>
          
          <div title="Buscar dispositivos" onClick={manejarGiroBusqueda} style={{ cursor: 'pointer', animation: esBuscando ? 'girar 1s ease-in-out' : 'none', color: 'var(--color-texto)' }}>
            <RefreshCcw size={18} />
          </div>
          <div title="Envío manual" onClick={() => asignarEsModalEnvioManualActivo(true)} style={{ cursor: 'pointer', color: 'var(--color-texto)' }}>
            <Radar size={18} />
          </div>
          <div title="Favoritos" onClick={() => asignarEsModalFavoritosActivo(true)} style={{ cursor: 'pointer', color: 'var(--color-texto)' }}>
            <Heart size={18} />
          </div>
          <div title="Modo de envío" onClick={() => asignarEsMenuModoEnvioActivo(!esMenuModoEnvioActivo)} style={{ cursor: 'pointer', color: 'var(--color-texto)' }}>
            <Settings size={18} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          {dispositivosEnRed.length === 0 ? (
            <div style={{ backgroundColor: 'var(--color-caja)', borderRadius: '16px', padding: '25px', display: 'flex', alignItems: 'center', gap: '20px', minWidth: '300px' }}>
              <div style={{ position: 'relative', width: 48, height: 48 }}>
                {iconosAnimados.map((Icono, indice) => (
                  <div key={indice} style={{ position: 'absolute', top: 0, left: 0, opacity: indice === indiceIconoAnimado ? 1 : 0, transition: 'opacity 1s ease-in-out' }}>
                    <Icono size={48} color="#2b3d36" />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ width: '60px', height: '15px', backgroundColor: 'var(--color-fondo-boton)', borderRadius: '8px' }}></div>
                <div style={{ width: '80px', height: '15px', backgroundColor: 'var(--color-fondo-boton)', borderRadius: '8px' }}></div>
              </div>
            </div>
          ) : (
            dispositivosEnRed.map((dispositivo) => (
              <div 
                key={dispositivo.id} 
                onClick={() => manejarEnvio(dispositivo.id)}
                style={{ 
                  backgroundColor: 'var(--color-caja)', 
                  borderRadius: '16px', 
                  padding: '25px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '20px', 
                  minWidth: '250px',
                  cursor: 'pointer'
                }}
              >
                <Smartphone size={48} color="var(--color-texto)" />
                <div>
                  <p style={{ margin: 0, color: 'var(--color-texto)', fontWeight: '500' }}>{dispositivo.alias}</p>
                  <p style={{ margin: '5px 0 0 0', color: '#8a9994', fontSize: '14px' }}>IP: {dispositivo.id}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 'auto', paddingBottom: '20px' }}>
        <p style={{ color: 'var(--color-acento)', cursor: 'pointer', fontWeight: 'bold', marginBottom: '25px' }}>Solucionar problemas</p>
        <p style={{ color: '#8a9994', fontSize: '14px' }}>Por favor asegúrese que el destino elegido esté en la misma red Wi-Fi.</p>
      </div>
    </section>
  );
}
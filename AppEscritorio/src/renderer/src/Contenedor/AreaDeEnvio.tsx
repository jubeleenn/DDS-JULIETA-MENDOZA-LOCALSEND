import { useState, useRef, useEffect } from 'react';
import { FileText, Folder, AlignLeft, ClipboardList, RefreshCcw, Radar, Heart, Settings, TerminalSquare, Server, Smartphone, Monitor, Globe, File } from 'lucide-react';
import { BotonParaSeleccion } from '../Contenido/BotonParaSeleccion';
import { ModalParaTexto } from '../Contenido/ModalParaTexto';
import { EstilosAnimaciones } from '../Contenido/EstilosAnimaciones';
import { ModalFavoritosVacio, ModalAgregarFavorito, ModalExplicacionModos, MenuModosDeEnvio } from '../Contenido/ModalesSecundarios';
import { formatearPeso, BotonConHover, PantallaEditarSeleccion } from '../Contenido/ComponentesDeSeleccion';

interface PropsEnvio { 
    archivosGlobales: File[]; 
    alAgregarArchivos: (archivos: File[]) => void;
    alLimpiarArchivos: () => void;
    alEliminarArchivo: (i: number) => void;
}

export function AreaDeEnvio({ archivosGlobales, alAgregarArchivos, alLimpiarArchivos, alEliminarArchivo }: PropsEnvio) {
    // ESTADOS DE UI RESTAURADOS
    const [esModalTextoActivo, asignarEsModalTextoActivo] = useState(false);
    const [esMenuModoEnvioActivo, asignarEsMenuModoEnvioActivo] = useState(false);
    const [esModalFavoritosActivo, asignarEsModalFavoritosActivo] = useState(false);
    const [esModalAgregarFavoritoActivo, asignarEsModalAgregarFavoritoActivo] = useState(false);
    const [esModalExplicacionActivo, asignarEsModalExplicacionActivo] = useState(false);
    const [esModalEnvioManualActivo, asignarEsModalEnvioManualActivo] = useState(false);
    const [esModoEdicion, asignarEsModoEdicion] = useState(false);
    const [modoDeEnvioSeleccionado, asignarModoDeEnvioSeleccionado] = useState('unico');

    // ESTADOS DE ANIMACIÓN Y RED RESTAURADOS
    const [dispositivosEnRed, asignarDispositivosEnRed] = useState<any[]>([]);
    const [indiceIconoAnimado, asignarIndiceIconoAnimado] = useState(0);
    const [esBuscando, asignarEsBuscando] = useState(false);

    const referenciaInputArchivo = useRef<HTMLInputElement>(null);
    const referenciaInputCarpeta = useRef<HTMLInputElement>(null);

    const pesoTotal = archivosGlobales.reduce((acc, arch) => acc + arch.size, 0);
    const tieneArchivos = archivosGlobales.length > 0;

    const iconosAnimados = [TerminalSquare, Server, Smartphone, Monitor, Globe];

    // ANIMACIÓN DE CROSSFADE RESTAURADA
    useEffect(() => {
        const intervalo = setInterval(() => {
            asignarIndiceIconoAnimado((prev) => (prev + 1) % iconosAnimados.length);
        }, 2000);
        return () => clearInterval(intervalo);
    }, []);

    // CONEXIÓN CON EL BACKEND UDP
    useEffect(() => {
        // @ts-ignore
        if (window.apiLocalSend) {
            // @ts-ignore
            window.apiLocalSend.escucharDispositivosEnRed((nuevoDispositivo) => {
                asignarDispositivosEnRed((listaActual) => {
                    const yaExiste = listaActual.some(d => d.id === nuevoDispositivo.id);
                    if (yaExiste) return listaActual;
                    return [...listaActual, nuevoDispositivo];
                });
            });
        }
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

    return (
        <section style={{ flex: 1, backgroundColor: 'var(--color-fondo)', padding: '40px 50px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <EstilosAnimaciones />
            
            {/* TODOS LOS MODALES RESTAURADOS */}
            {esModalTextoActivo && <ModalParaTexto alCancelar={() => asignarEsModalTextoActivo(false)} alConfirmar={() => asignarEsModalTextoActivo(false)} />}
            {esModalFavoritosActivo && <ModalFavoritosVacio alCancelar={() => asignarEsModalFavoritosActivo(false)} alAgregar={() => { asignarEsModalFavoritosActivo(false); asignarEsModalAgregarFavoritoActivo(true); }} />}
            {esModalAgregarFavoritoActivo && <ModalAgregarFavorito alCancelar={() => asignarEsModalAgregarFavoritoActivo(false)} />}
            {esModalEnvioManualActivo && <ModalAgregarFavorito alCancelar={() => asignarEsModalEnvioManualActivo(false)} />}
            {esMenuModoEnvioActivo && <MenuModosDeEnvio modoActual={modoDeEnvioSeleccionado} alSeleccionarModo={asignarModoDeEnvioSeleccionado} alCerrar={() => asignarEsMenuModoEnvioActivo(false)} alAbrirExplicacion={() => { asignarEsMenuModoEnvioActivo(false); asignarEsModalExplicacionActivo(true); }} />}
            {esModalExplicacionActivo && <ModalExplicacionModos alCerrar={() => asignarEsModalExplicacionActivo(false)} />}

            {esModoEdicion && (
                <PantallaEditarSeleccion 
                    archivos={archivosGlobales} alCerrar={() => asignarEsModoEdicion(false)}
                    alEliminarArchivo={alEliminarArchivo} alEliminarTodo={() => { alLimpiarArchivos(); asignarEsModoEdicion(false); }}
                />
            )}

            <input type="file" multiple ref={referenciaInputArchivo} onChange={manejarSeleccionNativa} style={{ display: 'none' }} />
            {/* @ts-ignore */}
            <input type="file" ref={referenciaInputCarpeta} webkitdirectory="true" style={{ display: 'none' }} />

            {/* SECCIÓN 1: SELECCIÓN ) */}
            <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px', color: 'var(--color-texto)' }}>Selección</h3>
                {tieneArchivos ? (
                    <div style={{ backgroundColor: 'var(--color-caja)', padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <div style={{ backgroundColor: 'var(--color-fondo-boton)', padding: '15px', borderRadius: '12px' }}>
                                <File size={32} color="var(--color-texto)" />
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
                        <BotonParaSeleccion icono={<FileText size={32} />} texto="Archivo" alHacerClic={() => referenciaInputArchivo.current?.click()} />
                        <BotonParaSeleccion icono={<Folder size={32} />} texto="Carpeta" alHacerClic={() => referenciaInputCarpeta.current?.click()} />
                        <BotonParaSeleccion icono={<AlignLeft size={32} />} texto="Texto" alHacerClic={() => asignarEsModalTextoActivo(true)} />
                        <BotonParaSeleccion icono={<ClipboardList size={32} />} texto="Pegar" alHacerClic={() => console.log('Pegar portapapeles')} />
                    </div>
                )}
            </div>

            {/* SECCIÓN 2: DISPOSITIVOS CERCANOS */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '500', margin: 0, color: 'var(--color-texto)' }}>Dispositivos Cercanos</h3>
                    
                    {/* LOS 4 ÍCONOS DE ABAJO RESTAURADOS CON SUS MODALES */}
                    <div title="Buscar dispositivos" onClick={manejarGiroBusqueda} style={{ cursor: 'pointer', animation: esBuscando ? 'girar 1s ease-in-out' : 'none', color: 'var(--color-texto)' }}><RefreshCcw size={20} /></div>
                    <div title="Envío manual" onClick={() => asignarEsModalEnvioManualActivo(true)}><Radar size={20} cursor="pointer" color="var(--color-texto)" /></div>
                    <div title="Favoritos" onClick={() => asignarEsModalFavoritosActivo(true)}><Heart size={20} cursor="pointer" color="var(--color-texto)" /></div>
                    <div title="Modo de envío" onClick={() => asignarEsMenuModoEnvioActivo(!esMenuModoEnvioActivo)}><Settings size={20} cursor="pointer" color="var(--color-texto)" /></div>
                </div>
                
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    {/* SI NO HAY DISPOSITIVOS -> MUESTRA LA CAJA ANIMADA RESTAURADA */}
                    {dispositivosEnRed.length === 0 ? (
                        <div style={{ backgroundColor: 'var(--color-caja)', borderRadius: '16px', padding: '25px', display: 'flex', alignItems: 'center', gap: '20px', minWidth: '300px' }}>
                            <div style={{ position: 'relative', width: 48, height: 48 }}>
                                {iconosAnimados.map((Icono, indice) => (
                                    <div key={indice} style={{ position: 'absolute', top: 0, left: 0, opacity: indice === indiceIconoAnimado ? 1 : 0, transition: 'opacity 1s ease-in-out' }}>
                                        <Icono size={48} color="#455a53" />
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ width: '60px', height: '15px', backgroundColor: 'var(--color-fondo-boton)', borderRadius: '8px' }}></div>
                                <div style={{ width: '80px', height: '15px', backgroundColor: 'var(--color-fondo-boton)', borderRadius: '8px' }}></div>
                            </div>
                        </div>
                    ) : (
                        /* SI HAY DISPOSITIVOS -> MUESTRA LAS TARJETAS */
                        dispositivosEnRed.map((dispositivo) => (
                            <div key={dispositivo.id} style={{ backgroundColor: 'var(--color-caja)', borderRadius: '16px', padding: '25px', display: 'flex', alignItems: 'center', gap: '20px', minWidth: '250px' }}>
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
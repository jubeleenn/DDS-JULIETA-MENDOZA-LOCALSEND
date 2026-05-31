import { useState } from 'react';
import { RefreshCcw, Square } from 'lucide-react';
import { FilaDeAjuste, DesplegableVisual, InterruptorVisual, BotonAjuste, CheckboxAjuste } from '../Contenido/ControlesDeAjuste';

interface PropsAjustes { nombreColorActual: string; alCambiarColor: (c: string) => void; temaActual: string; alCambiarTema: (t: string) => void; }

export function AreaDeAjustes({ nombreColorActual, alCambiarColor, temaActual, alCambiarTema }: PropsAjustes) {
    const [idioma, asignarIdioma] = useState('Sistema');
    const [esMinimizarActivo, asignarEsMinimizarActivo] = useState(false);
    const [esInicioActivo, asignarEsInicioActivo] = useState(false);
    const [esAnimacionesActivo, asignarEsAnimacionesActivo] = useState(true);
    
    const [esGuardadoRapido, asignarEsGuardadoRapido] = useState(false);
    const [esGuardadoFavoritos, asignarEsGuardadoFavoritos] = useState(false);
    const [esPinActivo, asignarEsPinActivo] = useState(false);
    const [esAutoFinalizar, asignarEsAutoFinalizar] = useState(false);
    const [esGuardarHistorial, asignarEsGuardarHistorial] = useState(true);

    const [esConfiguracionAvanzada, asignarEsConfiguracionAvanzada] = useState(false);

    const opcionesDeColor = ['LocalSend', 'OLED', 'Yaru', 'Sistema'];

    return (
        <section style={{ flex: 1, backgroundColor: 'var(--color-fondo, #1b2624)', padding: '40px 60px', overflowY: 'auto', paddingBottom: '80px', transition: 'background-color 0.3s ease' }}>
            <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: '500', color: 'var(--color-texto, #ffffff)', marginBottom: '40px' }}>Ajustes</h2>

            {/* SECCIÓN 1: GENERAL (Captura 1) */}
            <div style={{ backgroundColor: 'var(--color-caja, #16201d)', borderRadius: '16px', padding: '30px', marginBottom: '30px', transition: 'background-color 0.3s ease' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '500', color: 'var(--color-texto, #ffffff)', margin: '0 0 25px 0' }}>General</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <FilaDeAjuste titulo="Luminosidad">
                        <DesplegableVisual opciones={['Oscuro', 'Claro']} valorActual={temaActual} alCambiar={alCambiarTema} />
                    </FilaDeAjuste>
                    <FilaDeAjuste titulo="Color">
                        <DesplegableVisual opciones={opcionesDeColor} valorActual={nombreColorActual} alCambiar={alCambiarColor} />
                    </FilaDeAjuste>
                    <FilaDeAjuste titulo="Idioma">
                        <DesplegableVisual opciones={['Sistema', 'Español', 'English']} valorActual={idioma} alCambiar={asignarIdioma} />
                    </FilaDeAjuste>
                    <FilaDeAjuste titulo="Cerrar: Minimizar ventana">
                        <InterruptorVisual esActivo={esMinimizarActivo} alAlternar={() => asignarEsMinimizarActivo(!esMinimizarActivo)} />
                    </FilaDeAjuste>
                    <FilaDeAjuste titulo="Inicio automático">
                        <InterruptorVisual esActivo={esInicioActivo} alAlternar={() => asignarEsInicioActivo(!esInicioActivo)} />
                    </FilaDeAjuste>
                    <FilaDeAjuste titulo="Animaciones">
                        <InterruptorVisual esActivo={esAnimacionesActivo} alAlternar={() => asignarEsAnimacionesActivo(!esAnimacionesActivo)} />
                    </FilaDeAjuste>
                </div>
            </div>

            {/* SECCIÓN 2: RECIBIR (Captura 2) */}
            <div style={{ backgroundColor: 'var(--color-caja, #16201d)', borderRadius: '16px', padding: '30px', marginBottom: '30px', transition: 'background-color 0.3s ease' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '500', color: 'var(--color-texto, #ffffff)', margin: '0 0 25px 0' }}>Recibir</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <FilaDeAjuste titulo="Guardado rápido">
                        <InterruptorVisual esActivo={esGuardadoRapido} alAlternar={() => asignarEsGuardadoRapido(!esGuardadoRapido)} />
                    </FilaDeAjuste>
                    <FilaDeAjuste titulo="Guardado rápido en &quot;Favoritos&quot;">
                        <InterruptorVisual esActivo={esGuardadoFavoritos} alAlternar={() => asignarEsGuardadoFavoritos(!esGuardadoFavoritos)} />
                    </FilaDeAjuste>
                    <FilaDeAjuste titulo="Requerir PIN">
                        <InterruptorVisual esActivo={esPinActivo} alAlternar={() => asignarEsPinActivo(!esPinActivo)} />
                    </FilaDeAjuste>
                    <FilaDeAjuste titulo="Guardar en carpeta">
                        <BotonAjuste texto="(Descargas)" alHacerClic={() => console.log('Abrir selector de carpeta')} />
                    </FilaDeAjuste>
                    <FilaDeAjuste titulo="Auto finalizar">
                        <InterruptorVisual esActivo={esAutoFinalizar} alAlternar={() => asignarEsAutoFinalizar(!esAutoFinalizar)} />
                    </FilaDeAjuste>
                    <FilaDeAjuste titulo="Guardar en el historial">
                        <InterruptorVisual esActivo={esGuardarHistorial} alAlternar={() => asignarEsGuardarHistorial(!esGuardarHistorial)} />
                    </FilaDeAjuste>
                </div>
            </div>

            {/* SECCIÓN 3: RED (Captura 3) */}
            <div style={{ backgroundColor: 'var(--color-caja, #16201d)', borderRadius: '16px', padding: '30px', marginBottom: '30px', transition: 'background-color 0.3s ease' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '500', color: 'var(--color-texto, #ffffff)', margin: '0 0 25px 0' }}>Red</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <FilaDeAjuste titulo="Servidor">
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <BotonAjuste icono={<RefreshCcw size={16} />} alHacerClic={() => console.log('Reiniciar')} />
                            <BotonAjuste icono={<Square size={16} fill="currentColor" />} alHacerClic={() => console.log('Detener')} />
                        </div>
                    </FilaDeAjuste>
                    <FilaDeAjuste titulo="Alias">
                        <BotonAjuste texto="Clever Banana" alHacerClic={() => console.log('Cambiar alias')} />
                    </FilaDeAjuste>
                </div>
            </div>

            {/* SECCIÓN 4: OTROS (Captura 3) */}
            <div style={{ backgroundColor: 'var(--color-caja, #16201d)', borderRadius: '16px', padding: '30px', transition: 'background-color 0.3s ease' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '500', color: 'var(--color-texto, #ffffff)', margin: '0 0 25px 0' }}>Otros</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <FilaDeAjuste titulo="Sobre LocalSend">
                        <BotonAjuste texto="Abrir" alHacerClic={() => console.log('Abrir Info')} />
                    </FilaDeAjuste>
                    <FilaDeAjuste titulo="Apoya a LocalSend">
                        <BotonAjuste texto="Donar" alHacerClic={() => console.log('Abrir Donar')} />
                    </FilaDeAjuste>
                    <FilaDeAjuste titulo="Política de privacidad">
                        <BotonAjuste texto="Abrir" alHacerClic={() => console.log('Abrir Política')} />
                    </FilaDeAjuste>
                </div>
            </div>

            <CheckboxAjuste 
                texto="Configuración avanzada" 
                esActivo={esConfiguracionAvanzada} 
                alAlternar={() => asignarEsConfiguracionAvanzada(!esConfiguracionAvanzada)} 
            />
        </section>
    );
}
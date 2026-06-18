import { FilaDeAjuste, InterruptorVisual, BotonAjuste } from '../Contenido/ControlesDeAjuste';

interface PropsAjustes {
  temaActual: string;
  alCambiarTema: (t: string) => void;
  aliasActual: string;
  alCambiarAlias: (a: string) => void;
  carpetaActual: string;
  alCambiarCarpeta: (c: string) => void;
}

export function AreaDeAjustes({ temaActual, alCambiarTema, aliasActual, alCambiarAlias, carpetaActual, alCambiarCarpeta }: PropsAjustes) {
  return (
    <section style={{ flex: 1, backgroundColor: 'var(--color-fondo, #1b2624)', padding: '40px 60px', overflowY: 'auto', paddingBottom: '80px', transition: 'background-color 0.3s ease' }}>
      <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: '500', color: 'var(--color-texto, #ffffff)', marginBottom: '40px' }}>Ajustes</h2>

      <div style={{ backgroundColor: 'var(--color-caja, #16201d)', borderRadius: '16px', padding: '30px', transition: 'background-color 0.3s ease' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

          <FilaDeAjuste titulo="Luminosidad (Modo Oscuro)">
            <InterruptorVisual 
              esActivo={temaActual === 'Oscuro'} 
              alAlternar={() => alCambiarTema(temaActual === 'Oscuro' ? 'Claro' : 'Oscuro')} 
            />
          </FilaDeAjuste>

          <FilaDeAjuste titulo="Alias del dispositivo">
            <input 
              type="text" 
              value={aliasActual} 
              onChange={(evento) => alCambiarAlias(evento.target.value)}
              style={{ 
                backgroundColor: 'var(--color-fondo-boton)', 
                color: 'var(--color-texto)', 
                border: 'none', 
                padding: '8px 15px', 
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none',
                textAlign: 'right',
                fontFamily: 'inherit',
                width: '180px'
              }} 
            />
          </FilaDeAjuste>

          <FilaDeAjuste titulo="Guardar en carpeta">
            <BotonAjuste 
              texto={`(${carpetaActual})`} 
              alHacerClic={async () => {
                // @ts-ignore
                if (window.apiLocalSend && window.apiLocalSend.seleccionarCarpeta) {
                  // @ts-ignore
                  const rutaSeleccionada = await window.apiLocalSend.seleccionarCarpeta();
                  
                  
                  if (rutaSeleccionada) {
                    alCambiarCarpeta(rutaSeleccionada);
                  }
                }
              }} 
            />
          </FilaDeAjuste>

        </div>
      </div>
    </section>
  );
}

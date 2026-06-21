export function MonitorDeTransferencia({ nombre, porcentaje, velocidad }: any) {
  return (
    <article style={{ padding: '15px', background: 'var(--bg-principal)', borderRadius: '16px', border: '1px solid var(--color-acento)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
        <b>{nombre}</b> <span style={{ color: 'var(--color-acento)' }}>{porcentaje}%</span>
      </div>
      <div style={{ width: '100%', background: 'var(--bg-secundario)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
        <div style={{ width: `${porcentaje}%`, background: 'var(--color-acento)', height: '100%', transition: 'width 0.3s' }} />
      </div>
      <div style={{ fontSize: '12px', color: 'var(--color-texto-muted)', textAlign: 'right' }}>{velocidad} MB/s</div>
    </article>
  )
}
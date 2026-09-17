import { RECURSOS_LIBRERIA } from '@/lib/types'

export default function LibreriaPage() {
  return (
    <main style={{ padding: '18px 22px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 25, fontWeight: 500, letterSpacing: '-0.02em' }}>Librería</h1>
          <p style={{ fontSize: 12, color: 'var(--color-neutral-500)', marginTop: 2 }}>
            Ciencia sobre TDAH, curada una a una
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {RECURSOS_LIBRERIA.map((r) => (
          <a
            key={r.url}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="min-touch"
            style={{
              display: 'block',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-neutral-800)',
              borderRadius: 16,
              padding: 15,
              textDecoration: 'none',
              color: 'var(--color-text)',
            }}
          >
            <div style={{ fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-accent-400)' }}>
              {r.fuente}
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, marginTop: 5 }}>{r.titulo}</div>
            <div style={{ fontSize: 12.5, color: 'var(--color-neutral-500)', marginTop: 6, lineHeight: 1.5 }}>
              {r.resumen}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--color-accent-300)', marginTop: 8 }}>Ver fuente ↗</div>
          </a>
        ))}
      </div>

      <p style={{ fontSize: 11.5, color: 'var(--color-neutral-600)', lineHeight: 1.5 }}>
        Recursos de organizaciones e instituciones de referencia en TDAH. NeuroDay no los aloja ni los modifica —
        enlaza directo a la fuente. Los foros y recursos adicionales llegan en una próxima etapa.
      </p>
    </main>
  )
}

import Link from 'next/link'
import { getRacha } from '@/lib/data'

export default async function DonePage() {
  const racha = await getRacha()
  return (
    <main
      style={{
        minHeight: 'calc(100dvh - 60px)',
        padding: '24px 22px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 46 }}>✓</div>
      <h1 style={{ fontSize: 24 }}>Día guardado</h1>
      <p style={{ fontSize: 14, color: 'var(--color-neutral-400)' }}>
        Llevás <strong style={{ color: 'var(--color-accent-300)' }}>{racha}</strong> {racha === 1 ? 'día' : 'días'} seguidos.
      </p>
      <Link
        href="/hoy"
        className="min-touch"
        style={{
          borderRadius: 14,
          background: 'var(--color-accent)',
          color: '#fff',
          fontWeight: 600,
          fontSize: 15,
          display: 'flex',
          alignItems: 'center',
          padding: '0 26px',
          textDecoration: 'none',
        }}
      >
        Volver a Hoy
      </Link>
    </main>
  )
}

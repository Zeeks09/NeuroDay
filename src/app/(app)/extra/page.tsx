import Link from 'next/link'
import { getMedicaciones } from '@/lib/data'
import ExtraForm from './ExtraForm'

export default async function ExtraPage() {
  const medicaciones = await getMedicaciones()
  return (
    <main style={{ padding: '18px 22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <Link href="/hoy" style={{ fontSize: 13, color: 'var(--color-neutral-500)', textDecoration: 'none' }}>
          ← Hoy
        </Link>
        <h1 style={{ fontSize: 25, marginTop: 8 }}>Dosis fuera de horario</h1>
      </div>
      <ExtraForm medicaciones={medicaciones} />
    </main>
  )
}

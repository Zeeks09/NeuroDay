import Link from 'next/link'
import { getRegistroHoy } from '@/lib/data'
import LogForm from './LogForm'

export default async function LogPage() {
  const registro = await getRegistroHoy()
  return (
    <main style={{ padding: '18px 22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <Link href="/hoy" style={{ fontSize: 13, color: 'var(--color-neutral-500)', textDecoration: 'none' }}>
          ← Hoy
        </Link>
        <h1 style={{ fontSize: 25, marginTop: 8 }}>Registro del día</h1>
      </div>
      <LogForm registro={registro} />
    </main>
  )
}

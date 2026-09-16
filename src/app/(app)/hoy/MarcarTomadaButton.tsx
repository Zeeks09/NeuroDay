'use client'

import { useTransition } from 'react'
import { marcarMedicacionTomada } from '@/lib/data'

export default function MarcarTomadaButton({ medicacionId }: { medicacionId: string }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => marcarMedicacionTomada(medicacionId))}
      className="min-touch"
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--color-accent-300)',
        border: '1px solid var(--color-accent-700)',
        borderRadius: 20,
        padding: '0 14px',
        background: 'transparent',
        cursor: 'pointer',
        opacity: pending ? 0.5 : 1,
      }}
    >
      Registrar
    </button>
  )
}

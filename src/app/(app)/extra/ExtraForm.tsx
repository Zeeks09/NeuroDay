'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { agregarDosisExtra } from '@/lib/data'
import type { Medicacion } from '@/lib/types'

export default function ExtraForm({ medicaciones }: { medicaciones: Medicacion[] }) {
  const router = useRouter()
  const [nombre, setNombre] = useState(medicaciones[0]?.nombre ?? '')
  const [dosis, setDosis] = useState('')
  const [nota, setNota] = useState('')
  const [guardado, setGuardado] = useState(false)
  const [pending, startTransition] = useTransition()

  function guardar() {
    startTransition(async () => {
      await agregarDosisExtra({
        nombre,
        dosis,
        hora: new Date().toISOString(),
        nota: nota || undefined,
      })
      setGuardado(true)
    })
  }

  if (guardado) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', textAlign: 'center', paddingTop: 30 }}>
        <div style={{ fontSize: 40 }}>✓</div>
        <p style={{ fontSize: 16, lineHeight: 1.5, maxWidth: 320 }}>
          Quedó anotado. Vas a poder mostrárselo a tu médico en la próxima consulta.
        </p>
        <button
          type="button"
          onClick={() => router.push('/hoy')}
          className="min-touch"
          style={{ borderRadius: 12, border: 'none', background: 'var(--color-accent)', color: '#fff', fontWeight: 600, padding: '0 22px' }}
        >
          Volver a Hoy
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 13.5, color: 'var(--color-neutral-400)', lineHeight: 1.55, margin: 0 }}>
        Anotá lo que tomaste fuera de tu horario habitual. Esto queda en tu registro para que lo puedas repasar con tu médico — no cambia nada más.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {medicaciones.length > 0 ? (
          <select
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="min-touch"
            style={fieldStyle}
          >
            {medicaciones.map((m) => (
              <option key={m.id} value={m.nombre}>
                {m.nombre}
              </option>
            ))}
            <option value="">Otra…</option>
          </select>
        ) : null}
        {(medicaciones.length === 0 || nombre === '') && (
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre"
            className="min-touch"
            style={fieldStyle}
          />
        )}
        <input
          value={dosis}
          onChange={(e) => setDosis(e.target.value)}
          placeholder="Cantidad (ej. media pastilla, 10 mg)"
          className="min-touch"
          style={fieldStyle}
        />
        <textarea
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          placeholder="Nota (opcional)"
          rows={2}
          style={{ ...fieldStyle, height: 'auto', padding: 12, resize: 'vertical' }}
        />
      </div>

      <button
        type="button"
        disabled={pending || !dosis}
        onClick={guardar}
        className="min-touch"
        style={{
          borderRadius: 14,
          border: 'none',
          background: 'var(--color-accent)',
          color: '#fff',
          fontWeight: 600,
          fontSize: 15,
          opacity: pending || !dosis ? 0.5 : 1,
          cursor: 'pointer',
        }}
      >
        {pending ? 'Guardando…' : 'Registrar'}
      </button>
    </div>
  )
}

const fieldStyle: React.CSSProperties = {
  borderRadius: 10,
  border: '1px solid var(--color-neutral-800)',
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
  padding: '0 14px',
  fontSize: 15,
}

'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import ScaleButtons from '@/components/ScaleButtons'
import { guardarYCompletar } from '@/lib/data'
import { EFECTOS_OPCIONES } from '@/lib/types'
import type { RegistroDia } from '@/lib/types'

export default function LogForm({ registro }: { registro: RegistroDia }) {
  const router = useRouter()
  const [foco, setFoco] = useState<number | null>(registro.foco)
  const [animo, setAnimo] = useState<number | null>(registro.animo)
  const [sueno, setSueno] = useState<string>(registro.sueno_horas?.toString() ?? '')
  const [efectos, setEfectos] = useState<string[]>(registro.efectos ?? [])
  const [nota, setNota] = useState(registro.nota ?? '')
  const [pending, startTransition] = useTransition()

  function toggleEfecto(e: string) {
    setEfectos((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]))
  }

  function guardar() {
    startTransition(async () => {
      await guardarYCompletar({
        foco,
        animo,
        sueno_horas: sueno ? Number(sueno) : null,
        efectos,
        nota: nota || null,
      })
      router.push('/done')
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card titulo="Foco" subtitulo="¿Pudiste sostener la atención hoy?">
        <ScaleButtons name="foco" value={foco} onChange={setFoco} />
      </Card>

      <Card titulo="Ánimo" subtitulo="¿Cómo estuvo tu ánimo en general?">
        <ScaleButtons name="animo" value={animo} onChange={setAnimo} />
      </Card>

      <Card titulo="Sueño" subtitulo="¿Cuántas horas dormiste anoche?">
        <input
          type="number"
          step="0.5"
          min="0"
          max="16"
          value={sueno}
          onChange={(e) => setSueno(e.target.value)}
          placeholder="ej. 6.5"
          className="min-touch"
          style={{
            borderRadius: 10,
            border: '1px solid var(--color-neutral-800)',
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
            padding: '0 14px',
            fontSize: 15,
            width: '100%',
          }}
        />
      </Card>

      <Card titulo="Efectos secundarios" subtitulo={null}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {EFECTOS_OPCIONES.map((op) => {
            const active = efectos.includes(op)
            return (
              <button
                key={op}
                type="button"
                onClick={() => toggleEfecto(op)}
                className="min-touch"
                style={{
                  fontSize: 12.5,
                  padding: '0 14px',
                  borderRadius: 20,
                  border: 'none',
                  background: active ? 'var(--color-accent-900)' : 'var(--color-neutral-900)',
                  color: active ? 'var(--color-accent-200)' : 'var(--color-neutral-400)',
                  fontWeight: active ? 600 : 400,
                  cursor: 'pointer',
                }}
              >
                {op}
              </button>
            )
          })}
        </div>
      </Card>

      <Card titulo="Nota" subtitulo={null}>
        <textarea
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          placeholder="Algo que quieras recordar de hoy (opcional)"
          rows={3}
          style={{
            borderRadius: 10,
            border: '1px solid var(--color-neutral-800)',
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
            padding: 12,
            fontSize: 14,
            fontFamily: 'inherit',
            resize: 'vertical',
            width: '100%',
          }}
        />
      </Card>

      <button
        type="button"
        disabled={pending}
        onClick={guardar}
        className="min-touch"
        style={{
          borderRadius: 14,
          border: 'none',
          background: 'var(--color-accent)',
          color: '#fff',
          fontWeight: 600,
          fontSize: 15,
          opacity: pending ? 0.6 : 1,
          cursor: 'pointer',
        }}
      >
        {pending ? 'Guardando…' : 'Guardar registro'}
      </button>
    </div>
  )
}

function Card({ titulo, subtitulo, children }: { titulo: string; subtitulo: string | null; children: React.ReactNode }) {
  return (
    <section
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-neutral-800)',
        borderRadius: 16,
        padding: '14px 15px',
      }}
    >
      <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: subtitulo ? 3 : 12 }}>{titulo}</div>
      {subtitulo && <div style={{ fontSize: 11.5, color: 'var(--color-neutral-500)', marginBottom: 12 }}>{subtitulo}</div>}
      {children}
    </section>
  )
}

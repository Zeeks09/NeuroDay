'use client'

import { useState } from 'react'
import { guardarDiagnostico } from '@/lib/data'
import type { Diagnostico } from '@/lib/types'

const fieldStyle: React.CSSProperties = {
  borderRadius: 10,
  border: '1px solid var(--color-neutral-800)',
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
  padding: '0 12px',
  fontSize: 14,
}

export default function DiagnosticoForm({ diagnostico }: { diagnostico: Diagnostico | null }) {
  const [editando, setEditando] = useState(!diagnostico)

  if (!editando && diagnostico) {
    return (
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-neutral-800)',
          borderRadius: 16,
          padding: 15,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>
            {ETIQUETAS[diagnostico.tipo ?? ''] ?? 'Sin especificar'}
          </div>
          <button
            type="button"
            onClick={() => setEditando(true)}
            style={{ background: 'transparent', border: 'none', color: 'var(--color-accent-300)', fontSize: 12.5 }}
          >
            Editar
          </button>
        </div>
        {diagnostico.fecha && (
          <div style={{ fontSize: 12, color: 'var(--color-neutral-500)' }}>Diagnosticado: {diagnostico.fecha}</div>
        )}
        {diagnostico.notas && (
          <div style={{ fontSize: 12.5, color: 'var(--color-neutral-400)', lineHeight: 1.5 }}>{diagnostico.notas}</div>
        )}
      </div>
    )
  }

  return (
    <form
      action={async (fd) => {
        await guardarDiagnostico({
          tipo: (fd.get('tipo') as Diagnostico['tipo']) || null,
          fecha: (fd.get('fecha') as string) || null,
          notas: (fd.get('notas') as string) || null,
        })
        setEditando(false)
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-neutral-800)',
        borderRadius: 16,
        padding: 15,
      }}
    >
      <label style={{ fontSize: 12, color: 'var(--color-neutral-500)' }}>Tipo</label>
      <select name="tipo" defaultValue={diagnostico?.tipo ?? ''} className="min-touch" style={fieldStyle}>
        <option value="">Sin especificar</option>
        <option value="inatento">Inatento</option>
        <option value="hiperactivo">Hiperactivo/impulsivo</option>
        <option value="combinado">Combinado</option>
      </select>
      <label style={{ fontSize: 12, color: 'var(--color-neutral-500)' }}>Fecha del diagnóstico</label>
      <input name="fecha" type="date" defaultValue={diagnostico?.fecha ?? ''} className="min-touch" style={fieldStyle} />
      <label style={{ fontSize: 12, color: 'var(--color-neutral-500)' }}>Notas (quién lo diagnosticó, etc.)</label>
      <textarea name="notas" defaultValue={diagnostico?.notas ?? ''} rows={2} style={{ ...fieldStyle, padding: 10, resize: 'vertical' }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="min-touch" style={{ flex: 1, borderRadius: 10, border: 'none', background: 'var(--color-accent)', color: '#fff', fontWeight: 600 }}>
          Guardar
        </button>
        {diagnostico && (
          <button type="button" onClick={() => setEditando(false)} className="min-touch" style={{ flex: 1, borderRadius: 10, border: '1px solid var(--color-neutral-800)', background: 'transparent', color: 'var(--color-neutral-400)' }}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

const ETIQUETAS: Record<string, string> = {
  inatento: 'Inatento',
  hiperactivo: 'Hiperactivo/impulsivo',
  combinado: 'Combinado',
}

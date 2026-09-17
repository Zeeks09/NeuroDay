'use client'

import { useState } from 'react'
import { addProfesional, eliminarProfesional } from '@/lib/data'
import type { Profesional } from '@/lib/types'

const fieldStyle: React.CSSProperties = {
  borderRadius: 10,
  border: '1px solid var(--color-neutral-800)',
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
  padding: '0 12px',
  fontSize: 14,
}

export default function ProfesionalesList({ profesionales }: { profesionales: Profesional[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {profesionales.map((p) => (
        <div
          key={p.id}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-neutral-800)',
            borderRadius: 14,
            padding: 13,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{p.nombre}</div>
            {p.especialidad && <div style={{ fontSize: 12, color: 'var(--color-neutral-500)', marginTop: 2 }}>{p.especialidad}</div>}
            {p.telefono && <div style={{ fontSize: 12, color: 'var(--color-neutral-500)', marginTop: 2 }}>{p.telefono}</div>}
            {p.notas && <div style={{ fontSize: 12, color: 'var(--color-neutral-400)', marginTop: 4 }}>{p.notas}</div>}
          </div>
          <button
            type="button"
            onClick={() => eliminarProfesional(p.id)}
            style={{ background: 'transparent', border: 'none', color: 'var(--color-neutral-600)', fontSize: 12 }}
          >
            Quitar
          </button>
        </div>
      ))}

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="min-touch"
          style={{
            borderRadius: 12,
            border: '1px dashed var(--color-neutral-700)',
            background: 'transparent',
            color: 'var(--color-accent-300)',
            fontSize: 13.5,
            fontWeight: 500,
          }}
        >
          + Agregar profesional
        </button>
      )}

      {open && (
        <form
          action={async (fd) => {
            await addProfesional({
              nombre: String(fd.get('nombre') || ''),
              especialidad: (fd.get('especialidad') as string) || null,
              telefono: (fd.get('telefono') as string) || null,
              notas: (fd.get('notas') as string) || null,
            })
            setOpen(false)
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
          <input name="nombre" placeholder="Nombre" required className="min-touch" style={fieldStyle} />
          <input name="especialidad" placeholder="Especialidad (ej. Psiquiatra)" className="min-touch" style={fieldStyle} />
          <input name="telefono" placeholder="Teléfono" className="min-touch" style={fieldStyle} />
          <textarea name="notas" placeholder="Notas" rows={2} style={{ ...fieldStyle, padding: 10, resize: 'vertical' }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="min-touch" style={{ flex: 1, borderRadius: 10, border: 'none', background: 'var(--color-accent)', color: '#fff', fontWeight: 600 }}>
              Guardar
            </button>
            <button type="button" onClick={() => setOpen(false)} className="min-touch" style={{ flex: 1, borderRadius: 10, border: '1px solid var(--color-neutral-800)', background: 'transparent', color: 'var(--color-neutral-400)' }}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

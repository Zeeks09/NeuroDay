'use client'

import { useState } from 'react'
import { addMedicacion } from '@/lib/data'

export default function AddMedForm() {
  const [open, setOpen] = useState(false)
  if (!open) {
    return (
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
          cursor: 'pointer',
        }}
      >
        + Agregar medicación
      </button>
    )
  }
  return (
    <form
      action={async (fd) => {
        await addMedicacion({
          nombre: String(fd.get('nombre') || ''),
          dosis: String(fd.get('dosis') || ''),
          hora: (fd.get('hora') as string) || null,
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
      <input name="nombre" placeholder="Nombre (ej. Elvanse)" required className="min-touch" style={fieldStyle} />
      <input name="dosis" placeholder="Dosis (ej. 30 mg)" required className="min-touch" style={fieldStyle} />
      <label style={{ fontSize: 12, color: 'var(--color-neutral-500)' }}>
        Horario (dejalo vacío si es a demanda)
      </label>
      <input name="hora" type="time" className="min-touch" style={fieldStyle} />
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="min-touch" style={{ flex: 1, borderRadius: 10, border: 'none', background: 'var(--color-accent)', color: '#fff', fontWeight: 600 }}>
          Guardar
        </button>
        <button type="button" onClick={() => setOpen(false)} className="min-touch" style={{ flex: 1, borderRadius: 10, border: '1px solid var(--color-neutral-800)', background: 'transparent', color: 'var(--color-neutral-400)' }}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

const fieldStyle: React.CSSProperties = {
  borderRadius: 10,
  border: '1px solid var(--color-neutral-800)',
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
  padding: '0 12px',
  fontSize: 14,
}

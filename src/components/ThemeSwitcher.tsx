'use client'

import { useEffect, useState } from 'react'

const TEMAS = [
  { id: 'osc', label: 'Oscuro' },
  { id: 'clr', label: 'Claro' },
  { id: 'sep', label: 'Sepia' },
]

export default function ThemeSwitcher() {
  const [tema, setTema] = useState('osc')

  useEffect(() => {
    const stored = window.localStorage.getItem('nd-tema')
    if (stored) {
      setTema(stored)
      document.documentElement.setAttribute('data-theme', stored)
    }
  }, [])

  function aplicar(id: string) {
    setTema(id)
    document.documentElement.setAttribute('data-theme', id)
    try {
      window.localStorage.setItem('nd-tema', id)
    } catch {}
  }

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {TEMAS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => aplicar(t.id)}
          className="min-touch"
          style={{
            flex: 1,
            borderRadius: 10,
            border: tema === t.id ? '1.5px solid var(--color-accent)' : '1px solid var(--color-neutral-800)',
            background: 'var(--color-surface)',
            color: tema === t.id ? 'var(--color-accent-300)' : 'var(--color-neutral-400)',
            fontSize: 12.5,
            fontWeight: tema === t.id ? 600 : 400,
            cursor: 'pointer',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

'use client'

import { useState, useTransition } from 'react'
import { guardarPreferencias } from '@/lib/data'
import type { Preferencias } from '@/lib/types'

function Toggle({ checked, onChange, label, sub }: { checked: boolean; onChange: (v: boolean) => void; label: string; sub?: string }) {
  return (
    <label
      className="min-touch"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        cursor: 'pointer',
      }}
    >
      <div>
        <div style={{ fontSize: 13.5 }}>{label}</div>
        {sub && <div style={{ fontSize: 11.5, color: 'var(--color-neutral-500)', marginTop: 2 }}>{sub}</div>}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 20, height: 20, accentColor: 'var(--color-accent)' }}
      />
    </label>
  )
}

export default function PreferenciasForm({ inicial }: { inicial: Preferencias }) {
  const [prefs, setPrefs] = useState(inicial)
  const [, startTransition] = useTransition()

  function set<K extends keyof Preferencias>(key: K, value: Preferencias[K]) {
    const next = { ...prefs, [key]: value }
    setPrefs(next)

    if (key === 'texto_grande') {
      document.documentElement.setAttribute('data-texto-grande', String(value))
      try {
        window.localStorage.setItem('nd-texto-grande', String(value))
      } catch {}
    }
    if (key === 'reducir_movimiento') {
      document.documentElement.setAttribute('data-reducir-movimiento', String(value))
      try {
        window.localStorage.setItem('nd-reducir-movimiento', String(value))
      } catch {}
    }

    startTransition(() => {
      guardarPreferencias(next)
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-neutral-500)' }}>
          Avisos
        </div>
        <Toggle checked={prefs.aviso_toma} onChange={(v) => set('aviso_toma', v)} label="Recordatorio de toma" />
        <Toggle checked={prefs.aviso_receta} onChange={(v) => set('aviso_receta', v)} label="Se termina la receta" />
        <Toggle checked={prefs.aviso_cita} onChange={(v) => set('aviso_cita', v)} label="Próxima cita" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-neutral-500)' }}>
          Accesibilidad
        </div>
        <Toggle
          checked={prefs.texto_grande}
          onChange={(v) => set('texto_grande', v)}
          label="Texto más grande"
          sub="Aumenta el tamaño de letra en toda la app"
        />
        <Toggle
          checked={prefs.reducir_movimiento}
          onChange={(v) => set('reducir_movimiento', v)}
          label="Reducir movimiento"
          sub="Apaga animaciones y transiciones"
        />
      </div>
    </div>
  )
}

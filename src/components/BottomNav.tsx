'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/hoy', label: 'Hoy' },
  { href: '/datos', label: 'Datos' },
  { href: '/historial', label: 'Historial' },
  { href: '/libreria', label: 'Librería' },
  { href: '/perfil', label: 'Perfil' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav
      style={{
        display: 'flex',
        borderTop: '1px solid var(--color-neutral-800)',
        background: 'var(--color-surface)',
        paddingBottom: 'env(safe-area-inset-bottom, 10px)',
        position: 'sticky',
        bottom: 0,
      }}
    >
      {TABS.map((tab) => {
        const active = pathname?.startsWith(tab.href)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="min-touch"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              padding: '10px 4px',
              fontSize: 10.5,
              fontWeight: active ? 600 : 400,
              color: active ? 'var(--color-accent-300)' : 'var(--color-neutral-500)',
              textDecoration: 'none',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: active ? 'var(--color-accent)' : 'transparent',
              }}
            />
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}

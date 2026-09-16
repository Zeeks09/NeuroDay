'use client'

import { signOut } from './actions'

export default function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="min-touch"
        style={{
          borderRadius: 12,
          border: '1px solid var(--color-neutral-800)',
          background: 'transparent',
          color: 'var(--color-neutral-400)',
          fontSize: 13.5,
          padding: '0 18px',
          cursor: 'pointer',
        }}
      >
        Cerrar sesión
      </button>
    </form>
  )
}

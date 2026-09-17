import ThemeSwitcher from '@/components/ThemeSwitcher'
import SignOutButton from './SignOutButton'
import PreferenciasForm from './PreferenciasForm'
import { getPreferencias } from '@/lib/data'

export default async function PerfilPage() {
  const preferencias = await getPreferencias()

  return (
    <main style={{ padding: '18px 22px 24px', display: 'flex', flexDirection: 'column', gap: 22 }}>
      <h1 style={{ fontSize: 25, fontWeight: 500, letterSpacing: '-0.02em' }}>Perfil</h1>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>Tema</div>
        <ThemeSwitcher />
      </section>

      <section
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-neutral-800)',
          borderRadius: 16,
          padding: 15,
        }}
      >
        <PreferenciasForm inicial={preferencias} />
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>Cuenta</div>
        <SignOutButton />
      </section>

      <p style={{ fontSize: 11.5, color: 'var(--color-neutral-600)', lineHeight: 1.5, marginTop: 10 }}>
        NeuroDay no diagnostica ni reemplaza a un profesional de la salud. Es una herramienta de registro personal.
      </p>
    </main>
  )
}

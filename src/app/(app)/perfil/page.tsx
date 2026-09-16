import ThemeSwitcher from '@/components/ThemeSwitcher'
import SignOutButton from './SignOutButton'

export default async function PerfilPage() {
  return (
    <main style={{ padding: '18px 22px 24px', display: 'flex', flexDirection: 'column', gap: 22 }}>
      <h1 style={{ fontSize: 25 }}>Perfil</h1>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>Tema</div>
        <ThemeSwitcher />
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

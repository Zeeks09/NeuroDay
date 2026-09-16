import { signIn, signUp } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; check?: string }>
}) {
  const params = await searchParams
  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '22px',
        gap: 24,
        maxWidth: 420,
        margin: '0 auto',
      }}
    >
      <div>
        <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--color-neutral-500)' }}>
          ND · NeuroDay
        </div>
        <h1 style={{ fontSize: 28, marginTop: 8 }}>Tu registro diario</h1>
        <p style={{ fontSize: 13.5, color: 'var(--color-neutral-400)', marginTop: 8, lineHeight: 1.5 }}>
          NeuroDay no diagnostica ni reemplaza a tu médico. Es tu registro personal de medicación, foco y ánimo.
        </p>
      </div>

      {params.error && (
        <div style={{ fontSize: 13, color: '#e8a0a0', background: 'var(--color-neutral-900)', borderRadius: 10, padding: 12 }}>
          {params.error}
        </div>
      )}
      {params.check && (
        <div style={{ fontSize: 13, color: 'var(--color-accent-300)', background: 'var(--color-neutral-900)', borderRadius: 10, padding: 12 }}>
          Revisá tu correo para confirmar la cuenta antes de entrar.
        </div>
      )}

      <form action={signIn} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          name="email"
          type="email"
          placeholder="Correo"
          required
          className="min-touch"
          style={inputStyle}
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          required
          minLength={6}
          className="min-touch"
          style={inputStyle}
        />
        <button type="submit" className="min-touch" style={primaryBtn}>
          Entrar
        </button>
        <button formAction={signUp} type="submit" className="min-touch" style={secondaryBtn}>
          Crear cuenta
        </button>
      </form>
    </main>
  )
}

const inputStyle: React.CSSProperties = {
  borderRadius: 10,
  border: '1px solid var(--color-neutral-800)',
  background: 'var(--color-surface)',
  color: 'var(--color-text)',
  padding: '0 14px',
  fontSize: 15,
}

const primaryBtn: React.CSSProperties = {
  borderRadius: 10,
  border: 'none',
  background: 'var(--color-accent)',
  color: '#fff',
  fontWeight: 600,
  fontSize: 15,
  cursor: 'pointer',
}

const secondaryBtn: React.CSSProperties = {
  borderRadius: 10,
  border: '1px solid var(--color-accent-700)',
  background: 'transparent',
  color: 'var(--color-accent-300)',
  fontWeight: 500,
  fontSize: 14,
  cursor: 'pointer',
}

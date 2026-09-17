import { getDiagnostico, getProfesionales, getDocumentos, getMedicaciones } from '@/lib/data'
import DiagnosticoForm from './DiagnosticoForm'
import ProfesionalesList from './ProfesionalesList'
import DocumentosList from './DocumentosList'

export default async function HistorialPage() {
  const [diagnostico, profesionales, documentos, medicaciones] = await Promise.all([
    getDiagnostico(),
    getProfesionales(),
    getDocumentos(),
    getMedicaciones(),
  ])

  return (
    <main style={{ padding: '18px 22px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 25, fontWeight: 500, letterSpacing: '-0.02em' }}>Historial</h1>
        <p style={{ fontSize: 12.5, color: 'var(--color-neutral-500)', marginTop: 3 }}>Tu expediente completo</p>
      </div>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>Diagnóstico</div>
        <DiagnosticoForm diagnostico={diagnostico} />
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>Medicación</div>
        {medicaciones.length === 0 ? (
          <p style={{ fontSize: 12.5, color: 'var(--color-neutral-500)' }}>
            No agregaste medicación todavía — podés hacerlo desde <strong>Hoy</strong>.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {medicaciones.map((m) => (
              <div
                key={m.id}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-neutral-800)',
                  borderRadius: 14,
                  padding: 13,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 500 }}>{m.nombre}</div>
                <div style={{ fontSize: 12, color: 'var(--color-neutral-500)', marginTop: 2 }}>
                  {m.dosis} {m.hora ? `· ${m.hora}` : '· a demanda'}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>Profesionales</div>
        <ProfesionalesList profesionales={profesionales} />
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>Documentos</div>
        <p style={{ fontSize: 11.5, color: 'var(--color-neutral-600)', marginTop: -4 }}>
          Informes, recetas o estudios. Solo vos podés verlos.
        </p>
        <DocumentosList documentos={documentos} />
      </section>

      <p style={{ fontSize: 11.5, color: 'var(--color-neutral-600)', lineHeight: 1.5 }}>
        NeuroDay no diagnostica ni reemplaza a un profesional de la salud. Es una herramienta de registro personal.
      </p>
    </main>
  )
}

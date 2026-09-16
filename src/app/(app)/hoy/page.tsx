import Link from 'next/link'
import { getMedicaciones, getRegistroHoy, getRacha } from '@/lib/data'
import GoalRing from '@/components/GoalRing'
import AddMedForm from './AddMedForm'
import MarcarTomadaButton from './MarcarTomadaButton'

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

export default async function HoyPage() {
  const [medicaciones, registro, racha] = await Promise.all([
    getMedicaciones(),
    getRegistroHoy(),
    getRacha(),
  ])

  const hoy = new Date()
  const fechaLabel = `${DIAS[hoy.getDay()]} ${hoy.getDate()} ${MESES[hoy.getMonth()]}`
  const tomadasIds = new Set(registro.medicacion_tomada.map((m) => m.medicacion_id))
  const pendientes = medicaciones.filter((m) => !tomadasIds.has(m.id))
  const progreso = medicaciones.length ? (medicaciones.length - pendientes.length) / medicaciones.length : 0

  return (
    <main style={{ padding: '18px 22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: '.09em', textTransform: 'uppercase', color: 'var(--color-neutral-500)' }}>
            {fechaLabel}
          </div>
          <h1 style={{ fontSize: 27, marginTop: 4 }}>Hoy</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <GoalRing progreso={progreso} label="racha" value={String(racha)} />
        </div>
      </div>

      <section
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-neutral-800)',
          borderRadius: 16,
          padding: '14px 15px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>Medicación</div>
          <div style={{ fontSize: 11.5, color: 'var(--color-neutral-500)' }}>
            {medicaciones.length - pendientes.length} de {medicaciones.length} tomas
          </div>
        </div>

        {medicaciones.length === 0 && (
          <>
            <p style={{ fontSize: 13, color: 'var(--color-neutral-500)', margin: 0 }}>
              Todavía no cargaste ninguna medicación.
            </p>
            <AddMedForm />
          </>
        )}

        {medicaciones.map((m, i) => {
          const tomada = tomadasIds.has(m.id)
          return (
            <div key={m.id}>
              {i > 0 && <div style={{ height: 1, background: 'var(--color-neutral-800)', margin: '10px 0' }} />}
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: tomada ? 'var(--color-accent)' : 'transparent',
                    border: tomada ? 'none' : '1.5px dashed var(--color-neutral-700)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                  }}
                >
                  {tomada ? '✓' : ''}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>
                    {m.nombre} {m.dosis}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--color-neutral-500)' }}>
                    {tomada ? 'Tomada' : m.hora ? `Programada ${m.hora.slice(0, 5)}` : 'A demanda'}
                  </div>
                </div>
                {!tomada && <MarcarTomadaButton medicacionId={m.id} />}
              </div>
            </div>
          )
        })}

        {medicaciones.length > 0 && <AddMedForm />}
      </section>

      <Link
        href="/extra"
        className="min-touch"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          color: 'var(--color-neutral-500)',
          textDecoration: 'none',
        }}
      >
        ¿Tomaste algo fuera de horario? Registralo acá
      </Link>

      <Link
        href="/log"
        className="min-touch"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          borderRadius: 14,
          background: registro.completado ? 'var(--color-neutral-900)' : 'var(--color-accent)',
          color: registro.completado ? 'var(--color-neutral-400)' : '#fff',
          fontWeight: 600,
          fontSize: 15,
          textDecoration: 'none',
        }}
      >
        {registro.completado ? 'Ver / editar el registro de hoy' : 'Registrar el día'}
      </Link>
    </main>
  )
}

import { getEstadisticas } from '@/lib/data'
import GoalRing from '@/components/GoalRing'
import TrendChart from '@/components/TrendChart'

export default async function DatosPage() {
  const stats = await getEstadisticas()
  const ultimos14 = stats.dias.slice(-14)

  if (stats.diasConDatos === 0) {
    return (
      <main style={{ padding: '18px 22px 24px' }}>
        <h1 style={{ fontSize: 25, fontWeight: 500, letterSpacing: '-0.02em' }}>Datos</h1>
        <p style={{ fontSize: 13.5, color: 'var(--color-neutral-500)', marginTop: 12, lineHeight: 1.5 }}>
          Todavía no hay registros completos. En cuanto guardes tu primer día en{' '}
          <strong style={{ color: 'var(--color-text)' }}>Hoy</strong>, acá vas a ver tus tendencias de foco, sueño y
          adherencia.
        </p>
      </main>
    )
  }

  return (
    <main style={{ padding: '18px 22px 24px', display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <h1 style={{ fontSize: 25, fontWeight: 500, letterSpacing: '-0.02em' }}>Datos</h1>
        <p style={{ fontSize: 12.5, color: 'var(--color-neutral-500)', marginTop: 3 }}>
          Últimos {stats.dias.length} días registrados
        </p>
      </div>

      <section style={{ display: 'flex', gap: 12 }}>
        <div
          style={{
            flex: 1,
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            padding: 15,
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.02em' }}>
            {stats.suenoMedio7 !== null ? `${stats.suenoMedio7.toFixed(1)} h` : '—'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-neutral-500)', marginTop: 3 }}>sueño medio 7 d</div>
        </div>
        <div
          style={{
            flex: 1,
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            padding: 15,
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.02em' }}>
            {stats.focoMedio7 !== null ? stats.focoMedio7.toFixed(1) : '—'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-neutral-500)', marginTop: 3 }}>foco medio 7 d</div>
        </div>
      </section>

      <section
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          padding: 15,
        }}
      >
        <GoalRing progreso={stats.adherencia7 / 100} label="adherencia 7d" value={`${stats.adherencia7}%`} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5 }}>Adherencia al registro</div>
          <div style={{ fontSize: 12, color: 'var(--color-neutral-500)', marginTop: 4, lineHeight: 1.5 }}>
            {stats.adherencia21}% de los últimos 21 días con el registro completo.
          </div>
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>Foco por día</div>
        <div
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            padding: '14px 10px',
          }}
        >
          <TrendChart
            puntos={ultimos14.map((d) => ({ fecha: d.fecha, valor: d.foco }))}
            max={5}
            colorBarra="var(--color-accent)"
          />
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>Sueño por día</div>
        <div
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            padding: '14px 10px',
          }}
        >
          <TrendChart
            puntos={ultimos14.map((d) => ({ fecha: d.fecha, valor: d.sueno_horas }))}
            max={10}
            unidad="h"
            colorBarra="var(--color-accent-2, var(--color-accent))"
          />
        </div>
      </section>

      <p style={{ fontSize: 11.5, color: 'var(--color-neutral-600)', lineHeight: 1.5 }}>
        Estos gráficos son un resumen para vos y para llevar a la consulta médica. NeuroDay no diagnostica ni
        reemplaza a un profesional de la salud.
      </p>
    </main>
  )
}

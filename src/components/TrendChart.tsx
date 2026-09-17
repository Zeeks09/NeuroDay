type Punto = { fecha: string; valor: number | null }

type Props = {
  puntos: Punto[]
  max: number
  unidad?: string
  colorBarra?: string
}

// Gráfico de barras simple e inline (sin librerías) para mostrar una tendencia
// de ~7-14 días. Días sin dato quedan como una marca vacía, no se inventan.
export default function TrendChart({ puntos, max, unidad = '', colorBarra = 'var(--color-accent)' }: Props) {
  const w = 320
  const h = 90
  const gap = 6
  const barW = puntos.length ? (w - gap * (puntos.length - 1)) / puntos.length : 0

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }} preserveAspectRatio="none">
      {puntos.map((p, i) => {
        const x = i * (barW + gap)
        const tieneValor = p.valor !== null && p.valor !== undefined
        const barH = tieneValor ? Math.max(3, (Math.min(p.valor as number, max) / max) * (h - 18)) : 3
        const y = h - 18 - barH
        const dia = new Date(p.fecha + 'T00:00:00')
        const diaLabel = dia.toLocaleDateString('es-AR', { day: 'numeric' })
        return (
          <g key={p.fecha}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx={3}
              fill={tieneValor ? colorBarra : 'var(--color-neutral-800)'}
            />
            <text x={x + barW / 2} y={h - 4} textAnchor="middle" fontSize="7.5" fill="var(--color-neutral-600)">
              {diaLabel}
            </text>
            {tieneValor && (
              <text x={x + barW / 2} y={y - 3} textAnchor="middle" fontSize="7.5" fill="var(--color-neutral-500)">
                {p.valor}
                {unidad}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

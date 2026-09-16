type Props = {
  progreso: number // 0..1
  label: string
  value: string
}

export default function GoalRing({ progreso, label, value }: Props) {
  const r = 34
  const c = 2 * Math.PI * r
  const dash = Math.max(0, Math.min(1, progreso)) * c
  return (
    <svg width="78" height="78" viewBox="0 0 78 78">
      <circle cx="39" cy="39" r={r} fill="none" stroke="var(--color-neutral-900)" strokeWidth="6" />
      <circle
        cx="39"
        cy="39"
        r={r}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c}`}
        transform="rotate(-90 39 39)"
      />
      <text x="39" y="36" textAnchor="middle" fontSize="15" fontWeight="600" fill="var(--color-text)">
        {value}
      </text>
      <text x="39" y="50" textAnchor="middle" fontSize="8.5" fill="var(--color-neutral-500)">
        {label}
      </text>
    </svg>
  )
}

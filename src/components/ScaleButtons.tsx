'use client'

type Props = {
  name: string
  value: number | null
  onChange: (value: number) => void
}

export default function ScaleButtons({ value, onChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: 7 }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const active = value === n
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className="min-touch"
            style={{
              flex: 1,
              borderRadius: 11,
              border: 'none',
              background: active ? 'var(--color-accent)' : 'var(--color-neutral-900)',
              color: active ? '#fff' : 'var(--color-neutral-400)',
              fontSize: 15,
              fontWeight: active ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            {n}
          </button>
        )
      })}
    </div>
  )
}

'use client'

import { useRef, useState, useTransition } from 'react'
import { subirDocumento, eliminarDocumento, getUrlDocumento } from '@/lib/data'
import type { Documento } from '@/lib/types'

export default function DocumentosList({ documentos }: { documentos: Documento[] }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [subiendo, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function abrir(doc: Documento) {
    try {
      const url = await getUrlDocumento(doc.storage_path)
      window.open(url, '_blank', 'noopener')
    } catch {
      setError('No se pudo abrir el documento')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {documentos.map((doc) => (
        <div
          key={doc.id}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-neutral-800)',
            borderRadius: 14,
            padding: '11px 13px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={() => abrir(doc)}
            className="min-touch"
            style={{ flex: 1, textAlign: 'left', background: 'transparent', border: 'none', color: 'var(--color-text)', fontSize: 13.5 }}
          >
            {doc.nombre}
          </button>
          <button
            type="button"
            onClick={() => eliminarDocumento(doc.id, doc.storage_path)}
            style={{ background: 'transparent', border: 'none', color: 'var(--color-neutral-600)', fontSize: 12 }}
          >
            Quitar
          </button>
        </div>
      ))}

      <form
        ref={formRef}
        action={(fd) => {
          setError(null)
          startTransition(async () => {
            try {
              await subirDocumento(fd)
              formRef.current?.reset()
            } catch {
              setError('No se pudo subir el archivo')
            }
          })
        }}
        style={{ display: 'flex', gap: 8, alignItems: 'center' }}
      >
        <input
          name="archivo"
          type="file"
          accept="application/pdf,image/*"
          required
          className="min-touch"
          style={{ flex: 1, fontSize: 12.5, color: 'var(--color-neutral-400)' }}
        />
        <button
          type="submit"
          disabled={subiendo}
          className="min-touch"
          style={{ borderRadius: 10, border: 'none', background: 'var(--color-accent)', color: '#fff', fontWeight: 600, padding: '0 16px', fontSize: 13 }}
        >
          {subiendo ? 'Subiendo…' : 'Subir'}
        </button>
      </form>
      {error && <div style={{ fontSize: 12, color: 'var(--color-danger, #e5484d)' }}>{error}</div>}
    </div>
  )
}

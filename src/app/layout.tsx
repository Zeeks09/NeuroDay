import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NeuroDay',
  description: 'Registro diario para TDAH',
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/icon-512.png', sizes: '512x512', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NeuroDay',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#161826',
}

const THEME_SCRIPT = `
try {
  var t = localStorage.getItem('nd-tema');
  if (t) document.documentElement.setAttribute('data-theme', t);
  var tg = localStorage.getItem('nd-texto-grande');
  if (tg) document.documentElement.setAttribute('data-texto-grande', tg);
  var rm = localStorage.getItem('nd-reducir-movimiento');
  if (rm) document.documentElement.setAttribute('data-reducir-movimiento', rm);
} catch (e) {}
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  )
}

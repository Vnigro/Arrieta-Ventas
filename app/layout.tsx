import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Arrieta — Motos & Autos | Compra y Venta de Vehículos',
  description:
    'Compra y venta de motos y autos seleccionados. Unidades al día, listas para transferir. Tasación inmediata y consulta directa por WhatsApp.',
  keywords: [
    'compra venta motos',
    'motos usadas',
    'autos usados',
    'tasación de motos',
    'enduro',
    'street',
    'scooter',
    'ARRIETA motos y autos',
  ],
  openGraph: {
    title: 'ARRIETA — Motos & Autos',
    description:
      'Encontrá tu próxima moto o vendé la tuya en el acto. Unidades seleccionadas, al día y listas para transferir.',
    type: 'website',
  },
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FAFAFA',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`light bg-background ${jakarta.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}

import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, Pacifico, Poppins } from 'next/font/google'
import './globals.css'

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bebas',
})

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
})

const poppins = Poppins({
  weight: ['300', '400', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'The Woodpecker Diner · Dordrecht',
  description:
    'Southern comfort food uit Dordrecht — gegrild en gerookt op de Josper houtskooloven. Van pastrami tot half gebraden eend, met cocktails die kloppen.',
  openGraph: {
    title: 'The Woodpecker Diner · Dordrecht',
    description: 'Southern comfort food, charcoal-grilled op de Josper houtskooloven.',
    locale: 'nl_NL',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#F5E6D3',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${bebas.variable} ${pacifico.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  )
}

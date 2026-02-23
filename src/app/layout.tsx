import '@/styles/globals.css'
import { Metadata } from 'next'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: 'ScheduleLaunch — Your GSA MAS Readiness Platform',
  description: 'AI-powered platform to guide small businesses from zero to GSA Schedule award.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

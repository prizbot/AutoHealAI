import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AutoHealAI — AIOps Platform',
  description: 'Enterprise AI-driven self-healing cloud monitoring platform',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}

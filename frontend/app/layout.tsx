import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'robots.txt Assistant',
  description: 'AI-powered robots.txt assistant built on Cloudflare Workers AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

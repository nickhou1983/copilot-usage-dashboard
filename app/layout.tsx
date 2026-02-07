import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Copilot Usage Dashboard',
  description: 'Dashboard for tracking GitHub Copilot usage and metrics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}

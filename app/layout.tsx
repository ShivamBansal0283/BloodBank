import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'

export const metadata: Metadata = {
  title: 'Blood Bank',
  description: 'Blood bank management system',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="max-w-6xl mx-auto p-4">{children}</div>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UK Legal Aid Assistant',
  description: 'Get information about UK legal aid eligibility and processes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

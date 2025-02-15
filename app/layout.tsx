import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Learnitab',
  description: 'Empower Your Student Journey',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={plusJakartaSans.className} style={{ 
        background: '#000',
        color: 'white',
        margin: 0,
        minHeight: '100vh'
      }}>
        {children}
      </body>
    </html>
  )
}

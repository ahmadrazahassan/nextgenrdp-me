import { Inter } from 'next/font/google'
import './globals.css'
import './animations.css'
import ClientLayout from '@/components/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NextGen RDP - Premium VPS & RDP Solutions',
  description: 'High-performance virtual servers with guaranteed resources, 99.9% uptime, and 24/7 support.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
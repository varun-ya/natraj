import type { Metadata } from 'next'
import Navigation from '@/components/navigation'
import './globals.css'

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Track your daily habits and build better routines',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Navigation />
        {children}
      </body>
    </html>
  )
}
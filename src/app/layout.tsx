import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css' // <-- Crucial: Imports all your styles
import { cn } from '@/lib/utils'
import Navbar from '@/components/Navbar'
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Karthik U Rao | Portfolio',
  description: 'Full-Stack Developer & AI Enthusiast',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'bg-slate-900 text-white')}>
        <Navbar />
        {children} {/* This is where your page content renders */}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
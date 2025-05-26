// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import Navbar from '@/components/Navbar'
import { Toaster } from "@/components/ui/sonner"
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Karthik Rao | Portfolio',
  description: 'Full-Stack Developer & AI Enthusiast',
  // Icons field is preferred for favicons in Next.js Metadata API
  icons: {
    icon: '/favicon.svg', // Path to your favicon in the public folder
    // apple: '/apple-touch-icon.png', // Optional: for Apple devices
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* No manual <link rel="icon"> needed in head if using Metadata API */}
      <body className={cn(inter.className, 'bg-slate-900 text-white')}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Toaster richColors position="top-right" />
          <Footer />
        </div>
      </body>
    </html>
  )
}
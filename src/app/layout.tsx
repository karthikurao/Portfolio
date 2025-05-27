// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import Navbar from '@/components/Navbar'
import { Toaster } from "@/components/ui/sonner"
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor';
import { CursorProvider } from '@/context/CursorContext'; // <-- IMPORT CURSOR PROVIDER

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Karthik Rao | Portfolio',
  description: 'Full-Stack Developer & AI Enthusiast',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'bg-slate-900 text-white')}>
        <CursorProvider> {/* <-- WRAP WITH CURSOR PROVIDER */}
          <CustomCursor /> 
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Toaster richColors position="top-right" />
            <Footer />
          </div>
        </CursorProvider>
      </body>
    </html>
  )
}
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import AnimatedText from './AnimatedText'; // <-- Imports the animated logo

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Skills', href: '/skills' },
  { name: 'Resume', href: '/resume' },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Animated Name/Logo */}
        <Link href="/">
          <AnimatedText 
            text="Karthik U Rao" 
            className="text-xl font-bold text-white" 
          />
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                href={link.href}
                key={link.name}
                className={cn(
                  'text-sm font-medium transition-colors relative',
                  isActive ? 'text-purple-400' : 'text-slate-300 hover:text-white'
                )}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    className="absolute bottom-[-4px] left-0 right-0 h-[2px] bg-purple-400"
                    layoutId="underline"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
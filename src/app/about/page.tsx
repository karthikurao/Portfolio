// src/app/page.tsx
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import AboutSection from '@/components/AboutSection'
import ProjectsSection from '@/components/ProjectsSection'
import SkillsSection from '@/components/SkillsSection'
import ResumeSection from '@/components/ResumeSection'

export default function Home() {
  return (
    // A single <main> tag now wraps all page content for better structure
    <main className="w-full">
      {/* Hero Section */}
      {/* We apply the gradient and screen height to a div inside main */}
      <section id="home" className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Hi, I’m Karthik U Rao
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl md:text-2xl font-medium mb-6 text-slate-300"
        >
          Full-stack Developer | AI Enthusiast
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="max-w-xl text-base md:text-lg mb-8 text-slate-400"
        >
          I build intelligent, scalable web & mobile applications that blend performance, design, and user experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/Karthik_U_Rao_Resume.pdf" target="_blank">
            <Button variant="default" className="text-white bg-indigo-600 hover:bg-indigo-700">
              📄 View Resume
            </Button>
          </Link>
          <Link href="#contact">
            {/* FIX APPLIED HERE: 
              - Changed text to text-cyan-300 for visibility.
              - Changed border to border-cyan-400.
              - Updated hover state to match this new color scheme.
            */}
            <Button variant="outline" className="text-cyan-300 border-cyan-400 hover:bg-cyan-300 hover:text-slate-900">
              ✉️ Contact Me
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* The rest of the sections will now render sequentially after the hero */}
      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <ResumeSection />
    </main>
  )
}
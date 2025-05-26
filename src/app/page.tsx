// src/app/page.tsx
'use client'

import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'
import ProjectsSection from '@/components/ProjectsSection'
import ResumeSection from '@/components/ResumeSection'
import SkillsSection from '@/components/SkillsSection'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="w-full">
      <section 
        id="home" 
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 text-center overflow-hidden"
      >
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
        >
          Hi, I’m Karthik Rao
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="text-xl sm:text-2xl md:text-2xl font-medium mb-6 text-slate-300"
        >
          Full-stack Developer | AI Enthusiast
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
          className="max-w-xl text-base md:text-lg mb-8 text-slate-400 px-2"
        >
          I build intelligent, scalable web & mobile applications that blend performance, design, and user experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer">
            <Button 
                variant="default" 
                className="text-white bg-indigo-600 hover:bg-indigo-700 px-6 py-3 text-base rounded-lg transition-transform transform hover:scale-105"
            >
              📄 View Resume
            </Button>
          </Link>
          <Link href="#contact">
            <Button 
                variant="outline" 
                className="text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-slate-900 px-6 py-3 text-base rounded-lg transition-transform transform hover:scale-105"
            >
              ✉️ Contact Me
            </Button>
          </Link>
        </motion.div>
      </section>

      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <ResumeSection />
      <ContactSection />
    </main>
  )
}
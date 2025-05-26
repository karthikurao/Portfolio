// src/components/AboutSection.tsx
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  GraduationCap,
  BrainCircuit,
  Lightbulb,
  Users,
  BrainCog,
  RefreshCw,
  Mic,
  Presentation,
  HeartHandshake
} from 'lucide-react'

// Correctly defined data for Education
const education = [
  {
    degree: 'Master of Computer Application',
    institution: 'Dayananda Sagar College Of Engineering',
    year: 'Expected Sep 2025',
  },
  {
    degree: 'Bachelor of Computer Application',
    institution: 'DVS College of Arts, Science and Commerce',
    year: 'Sep 2023',
  },
]

// NEW: Data array for all your soft skills with icons
const softSkills = [
  { name: 'Problem Solving', icon: <Lightbulb className="h-5 w-5 text-yellow-400" /> },
  { name: 'Critical Thinking', icon: <BrainCog className="h-5 w-5 text-sky-400" /> },
  { name: 'Adaptability', icon: <RefreshCw className="h-5 w-5 text-green-400" /> },
  { name: 'Teamwork', icon: <Users className="h-5 w-5 text-orange-400" /> },
]

// Corrected data for artistic skills with better icons
const artisticSkills = [
    { name: 'Singing', icon: <Mic className="h-5 w-5 text-pink-400" /> },
    { name: 'Anchoring', icon: <Presentation className="h-5 w-5 text-indigo-400" /> },
    { name: 'Public Speaking', icon: <HeartHandshake className="h-5 w-5 text-red-400" /> },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
}

export default function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 bg-slate-900 text-white">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4">
            About Me
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-slate-300 max-w-3xl mx-auto">
            A full-stack developer with a passion for artificial intelligence, dedicated to building robust and user-centric applications.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-10"
        >
          {/* Education Card (No changes here) */}
          <motion.div variants={itemVariants}>
            <Card className="bg-slate-800 border-slate-700 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-cyan-300">
                  <GraduationCap className="h-8 w-8" /> Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {education.map((edu) => (
                  <div key={edu.degree}>
                    <h3 className="font-bold text-lg">{edu.degree}</h3>
                    <p className="text-slate-400">{edu.institution}</p>
                    <p className="text-sm text-slate-500">{edu.year}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* UPDATED Skills Card */}
          <motion.div variants={itemVariants}>
            <Card className="bg-slate-800 border-slate-700 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-purple-300">
                  <BrainCircuit className="h-8 w-8" /> Personal Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Soft Skills Section */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-slate-200">Soft Skills</h4>
                  <div className="flex flex-wrap gap-3">
                    {softSkills.map((skill) => (
                        <div key={skill.name} className="flex items-center gap-2 p-2 px-3 bg-slate-700 rounded-full text-sm">
                           {skill.icon}
                           <span className="font-medium text-slate-200">{skill.name}</span>
                        </div>
                    ))}
                  </div>
                </div>
                {/* Artistic Skills Section */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-slate-200">Artistic Skills</h4>
                   <div className="flex flex-wrap gap-3">
                    {artisticSkills.map((skill) => (
                        <div key={skill.name} className="flex items-center gap-2 p-2 px-3 bg-slate-700 rounded-full text-sm">
                           {skill.icon}
                           <span className="font-medium text-slate-200">{skill.name}</span>
                        </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
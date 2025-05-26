// src/components/AboutSection.tsx
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase, GraduationCap, Mic, Palette, BrainCircuit } from 'lucide-react'

const education = [
  {
    degree: 'Master of Computer Application',
    institution: 'Dayananda Sagar College Of Engineering',
    year: 'Expected Aug 2025',
  },
  {
    degree: 'Bachelor of Computer Application',
    institution: 'DVS College of Arts, Science and Commerce',
    year: 'Jun 2023',
  },
]

const artisticSkills = [
    { name: 'Singing', icon: <Mic className="h-6 w-6 text-indigo-400" /> },
    { name: 'Anchoring', icon: <Briefcase className="h-6 w-6 text-purple-400" /> },
    { name: 'Public Speaking', icon: <Palette className="h-6 w-6 text-cyan-400" /> },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
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
            I am a full-stack developer with a passion for artificial intelligence, dedicated to building robust and user-centric applications. Eager to leverage my technical and collaborative strengths in a dynamic engineering team.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-10"
        >
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

          <motion.div variants={itemVariants}>
            <Card className="bg-slate-800 border-slate-700 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-purple-300">
                  <BrainCircuit className="h-8 w-8" /> Artistic & Soft Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-slate-300">Beyond the code, I bring strong problem-solving, teamwork, and communication skills to the table.</p>
                <div className="flex flex-wrap gap-4">
                    {artisticSkills.map((skill) => (
                        <div key={skill.name} className="flex items-center gap-2 p-2 bg-slate-700 rounded-lg">
                           {skill.icon}
                           <span className="font-medium text-slate-200">{skill.name}</span>
                        </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
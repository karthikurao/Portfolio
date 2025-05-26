// src/components/SkillsSection.tsx
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { FaJava, FaPhp, FaHtml5, FaCss3Alt, FaJsSquare, FaReact, FaDatabase, FaPython } from 'react-icons/fa'
import { SiFirebase, SiTensorflow, SiOpencv, SiDjango, SiNextdotjs, SiTailwindcss } from 'react-icons/si'

const skills = [
  { name: 'Java', icon: <FaJava className="h-12 w-12 text-orange-500" /> },
  { name: 'JavaScript', icon: <FaJsSquare className="h-12 w-12 text-yellow-400" /> },
  { name: 'PHP', icon: <FaPhp className="h-12 w-12 text-indigo-400" /> },
  { name: 'HTML5', icon: <FaHtml5 className="h-12 w-12 text-red-500" /> },
  { name: 'CSS3', icon: <FaCss3Alt className="h-12 w-12 text-blue-500" /> },
  { name: 'SQL', icon: <FaDatabase className="h-12 w-12 text-sky-400" /> },
  { name: 'Django', icon: <SiDjango className="h-12 w-12 text-green-800" /> },
  { name: 'Firebase', icon: <SiFirebase className="h-12 w-12 text-yellow-500" /> },
  { name: 'TensorFlow', icon: <SiTensorflow className="h-12 w-12 text-orange-400" /> },
  { name: 'OpenCV', icon: <SiOpencv className="h-12 w-12 text-blue-600" /> },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
}

export default function SkillsSection() {
  return (
    <section id="skills" className="py-20 px-4 bg-slate-900 text-white">
      <div className="container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Technical Skills
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        >
          {skills.map((skill) => (
            <motion.div key={skill.name} variants={itemVariants}>
              <Card className="bg-slate-800 border-slate-700 hover:bg-slate-700 transition-colors duration-300 hover:-translate-y-2">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  {skill.icon}
                  <p className="mt-4 font-semibold text-slate-200">{skill.name}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
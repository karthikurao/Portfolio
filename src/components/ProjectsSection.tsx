// src/components/ProjectsSection.tsx
'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import React from 'react'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Github, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useCursor } from '@/context/CursorContext'; // <-- IMPORT useCursor

const projectData = [
  {
    title: 'CareCrew: Volunteer Social Network',
    description: 'Android app to connect volunteers by skill and location. Integrated Firebase Auth, Real-time DB, and Push Notifications.',
    tags: ['Java', 'Firebase', 'Android', 'Google Maps API'],
    githubUrl: 'https://github.com/karthikurao/CareCrew', 
    liveDemoUrl: '#', 
  },
  {
    title: 'Deepfake Detection System',
    description: 'A ResNeXt CNN+LSTM pipeline for video-based fake detection, achieving 85% accuracy. Web interface built with Django.',
    tags: ['Python', 'TensorFlow', 'LSTM', 'Django', 'OpenCV'],
    githubUrl: 'https://github.com/karthikurao/Deepfake-Detection',
    liveDemoUrl: '#',
  },
  {
    title: 'Moodify: Emotion-Based Music',
    description: 'AI-driven mobile app using TensorFlow & OpenCV for facial emotion detection to recommend Spotify playlists.',
    tags: ['React Native', 'TensorFlow', 'OpenCV', 'Spotify API'],
    githubUrl: 'https://github.com/karthikurao/Moodify',
    liveDemoUrl: '#',
  },
  {
    title: 'E-commerce Web Application',
    description: 'Scalable full-stack platform with user authentication, payment gateway, and an admin dashboard for non-beverage products.',
    tags: ['PHP', 'JavaScript', 'MySQL', 'HTML/CSS', 'RESTful APIs'],
    githubUrl: 'https://github.com/karthikurao/Green-Tea-Website',
    liveDemoUrl: '#',
  },
]

const TiltableCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 30, mass: 1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], ["7deg", "-7deg"]); 
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-7deg", "7deg"]); 

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      style={{
        transformStyle: "preserve-3d",
        transformPerspective: "1000px",
        rotateX,
        rotateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="h-full" 
    >
      {children}
    </motion.div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
}

export default function ProjectsSection() {
  const { setVariant } = useCursor(); // <-- GET setVariant from context

  return (
    <section id="projects" className="py-20 px-4 bg-slate-800 text-white">
      <div className="container mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          My Projects
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {projectData.map((project) => (
            <TiltableCard key={project.title}> 
              <motion.div variants={itemVariants} className="h-full">
                <Card className="bg-slate-900 border-slate-700 h-full flex flex-col shadow-xl hover:shadow-purple-500/20 transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-cyan-300">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <p className="text-slate-400 mb-4 flex-grow">{project.description}</p>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-slate-700 text-slate-300 hover:bg-slate-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-auto flex gap-4">
                      <Link href={project.githubUrl} target="_blank" passHref>
                        <Button 
                          variant="outline" 
                          className="text-white border-white hover:bg-white hover:text-slate-900 w-full"
                          onMouseEnter={() => setVariant('link-hover')} // <-- ADDED
                          onMouseLeave={() => setVariant('default')}   // <-- ADDED
                        >
                          <Github className="mr-2 h-4 w-4" /> GitHub
                        </Button>
                      </Link>
                      <Link href={project.liveDemoUrl} target="_blank" passHref>
                        <Button 
                          variant="default" 
                          className="bg-indigo-600 hover:bg-indigo-700 w-full"
                          onMouseEnter={() => setVariant('link-hover')} // <-- ADDED
                          onMouseLeave={() => setVariant('default')}   // <-- ADDED
                        >
                          <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TiltableCard>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
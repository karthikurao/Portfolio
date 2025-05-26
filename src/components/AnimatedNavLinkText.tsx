// src/components/AnimatedNavLinkText.tsx
'use client'

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedNavLinkTextProps {
  text: string;
  isActive: boolean;
}

const AnimatedNavLinkText: React.FC<AnimatedNavLinkTextProps> = ({ text, isActive }) => {
  const letters = Array.from(text);

  const containerVariants = {
    initial: {},
    hover: {
      transition: {
        staggerChildren: 0.03, // Slight delay between each letter's animation
      },
    },
  };

  const letterVariants = {
    initial: {
      y: 0,
      opacity: 1,
      rotateX: 0,
    },
    hover: {
      y: -4,       // Move letter up slightly
      opacity: 0.7,  // Fade it a bit
      rotateX: 20,   // Give it a slight 3D tilt
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  const textColorClass = isActive 
    ? "text-white" // Text color when link is active (pill background is purple)
    : "text-slate-300 group-hover:text-white"; // Default and hover color when not active

  return (
    <motion.div
      className={cn("flex pointer-events-none", textColorClass)} // pointer-events-none so hover is on parent Link
      variants={containerVariants}
      initial="initial"
      // `whileHover` will be controlled by the parent <Link> which will have the "group" class
    >
      {letters.map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          variants={letterVariants}
          className="inline-block" // Ensures transforms work correctly
        >
          {letter === " " ? "\u00A0" : letter} {/* Handle spaces correctly */}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default AnimatedNavLinkText;
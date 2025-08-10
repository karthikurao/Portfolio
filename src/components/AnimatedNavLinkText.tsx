// src/components/AnimatedNavLinkText.tsx
'use client'

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedNavLinkTextProps {
  text: string;
  isActive: boolean;
  isHovered: boolean;
}

const AnimatedNavLinkText: React.FC<AnimatedNavLinkTextProps> = ({ text, isActive, isHovered }) => {
  const letters = Array.from(text);

  const letterVariants = {
    initial: {
      y: 0,
      opacity: 1,
      rotateX: 0,
    },
    hover: { 
      y: -4,       
      opacity: 0.7,  
      rotateX: 15, // Slightly reduced rotation for a quicker feel   
    },
  };

  const textColorClass = isActive 
    ? "text-white" // Text color when link is active (pill background is purple)
    : isHovered 
      ? "text-white" // Text color when hovered (and not active)
      : "text-slate-300"; // Default text color

  return (
    <div className={cn("flex items-center justify-center", textColorClass, "transition-colors duration-100 ease-in-out")}> {/* Faster color transition */}
      {letters.map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          variants={letterVariants}
          animate={isHovered && !isActive ? "hover" : "initial"} 
          transition={{ // This transition applies to changes triggered by `animate`
            type: "spring", 
            stiffness: 150, // Reduced stiffness for smoother animation
            damping: 30,    // Increased damping to eliminate bounce
            delay: index * 0.025, // Slightly faster stagger
          }} 
          className="inline-block" 
        >
          {letter === " " ? "\u00A0" : letter} 
        </motion.span>
      ))}
    </div>
  );
};

export default AnimatedNavLinkText;
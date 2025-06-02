// src/components/Logo.tsx
'use client'
import { motion } from 'framer-motion';

interface KRLogoProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const KRLogo: React.FC<KRLogoProps> = ({ size = 32, strokeWidth = 2.5, className }) => {
  const svgVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Stagger K and R animation
      },
    },
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0, strokeDasharray: "1 1" },
    visible: {
      pathLength: 1,
      opacity: 1,
      strokeDasharray: "0 1", // For solid line after drawing
      transition: {
        duration: 1.2, // Duration for drawing each letter
        ease: "circOut",
      },
    },
  };

  // A slightly more stylized K and R
  // ViewBox is 0 0 60 60 for this design
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 60 60" 
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      variants={svgVariants}
      initial="hidden"
      animate="visible"
      className={className} 
    >
      {/* K Path */}
      <motion.path
        d="M10 10 L10 50 M10 30 L28 10 M10 30 L28 50"
        stroke="currentColor" 
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={pathVariants}
      />
      {/* R Path */}
      <motion.path
        d="M32 10 L32 50 M32 10 Q45 10 45 22.5 Q45 35 32 35 M32 35 L50 50" 
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={pathVariants}
      />
    </motion.svg>
  );
};

export default KRLogo;
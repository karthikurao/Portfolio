// src/components/CustomCursor.tsx
'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, Variants } from 'framer-motion';
import { useCursor } from '@/context/CursorContext'; // Import the hook

const CustomCursor = () => {
  const { variant } = useCursor(); // Get the current cursor variant from context

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Spring settings for smooth cursor follow
  const springConfig = { damping: 30, stiffness: 700, mass: 0.2 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [cursorX, cursorY]);

  const innerDotSize = 10; // Size of the inner dot
  const outerRingSize = 36; // Size of the outer ring when hovered

  // Variants for the inner dot
  const innerDotVariants: Variants = {
    default: { 
      scale: 1, 
      opacity: 1,
      backgroundColor: "rgba(167, 139, 250, 1)", // purple-400
    },
    'link-hover': { 
      scale: 0.4, 
      opacity: 0.7,
      backgroundColor: "rgba(167, 139, 250, 0.8)", // slightly faded purple
    },
    // Add more variants like 'button-hover' later
  };

  // Variants for the outer ring
  const outerRingVariants: Variants = {
    default: { 
      scale: 0, 
      opacity: 0, 
      borderWidth: '0px',
    },
    'link-hover': { 
      scale: 1, 
      opacity: 1, 
      borderWidth: '1.5px',
      borderColor: "rgba(167, 139, 250, 0.7)", // purple-400 with some transparency
    },
    // Add more variants here
  };

  // Main follower div, positions children correctly
  return (
    <motion.div
      className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2" // Centers the elements on cursor
      style={{
        left: springX,
        top: springY,
      }}
      // Animate based on variant for potential main cursor container changes (optional)
      // variants={mainCursorContainerVariants} 
      // animate={variant}
      transition={{ type: 'spring', ...springConfig }}
    >
      {/* Outer Ring */}
      <motion.div
        variants={outerRingVariants}
        animate={variant} // Animates based on the variant from context
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        className="absolute rounded-full" // No explicit border class, borderWidth from variants
        style={{
          width: outerRingSize,
          height: outerRingSize,
          left: `-${outerRingSize / 2}px`, // Position an_absolute_div_center_of_parent
          top: `-${outerRingSize / 2}px`,
        }}
      />
      {/* Inner Dot */}
      <motion.div
        variants={innerDotVariants}
        animate={variant} // Animates based on the variant from context
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="absolute rounded-full" // No explicit bg class, backgroundColor from variants
        style={{
          width: innerDotSize,
          height: innerDotSize,
          left: `-${innerDotSize / 2}px`, // Position an_absolute_div_center_of_parent
          top: `-${innerDotSize / 2}px`,
        }}
      />
    </motion.div>
  );
};

export default CustomCursor;
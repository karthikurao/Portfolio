// src/components/CustomCursor.tsx
'use client';

import { useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, Variants } from 'framer-motion';
import { useCursor } from '@/context/CursorContext';

const CustomCursor = () => {
  const { variant } = useCursor();

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Optimized spring settings for smoother movement
  const springConfig = { damping: 40, stiffness: 200, mass: 0.1 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  // Throttle mouse move for better performance
  const throttledMoveCursor = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  }, [cursorX, cursorY]);

  useEffect(() => {
    // Check if device supports hover (not on touch devices)
    const hasHover = window.matchMedia('(hover: hover)').matches;
    if (!hasHover) return;

    window.addEventListener('mousemove', throttledMoveCursor);
    return () => {
      window.removeEventListener('mousemove', throttledMoveCursor);
    };
  }, [throttledMoveCursor]);

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
      className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block" // Hide on mobile devices
      style={{
        left: springX,
        top: springY,
      }}
      transition={{ type: 'spring', ...springConfig }}
    >
      {/* Outer Ring */}
      <motion.div
        variants={outerRingVariants}
        animate={variant} // Animates based on the variant from context
        transition={{ type: 'spring', stiffness: 250, damping: 35 }}
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
        transition={{ type: 'spring', stiffness: 200, damping: 35 }}
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
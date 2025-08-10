// src/components/AnimatedText.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  isHovered?: boolean;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className, isHovered = false }) => {
  const [displayedText, setDisplayedText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimatedForCurrentHover, setHasAnimatedForCurrentHover] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+=";

  // Trigger animation when isHovered changes to true (only once per hover session)
  useEffect(() => {
    if (isHovered && !isAnimating && !hasAnimatedForCurrentHover) {
      setIsAnimating(true);
      setHasAnimatedForCurrentHover(true);
      let iteration = 0;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        const newText = text
          .split("")
          .map((_letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("");

        setDisplayedText(newText);

        if (iteration >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsAnimating(false);
        }

        iteration += 1 / 3;
      }, 30);
    }
    // Reset the animation flag when hover ends
    if (!isHovered) {
      setHasAnimatedForCurrentHover(false);
    }
  }, [isHovered, isAnimating, hasAnimatedForCurrentHover, text, letters]);

  const handleMouseOver = () => {
    if (!isHovered && !hasAnimatedForCurrentHover) { // Only use onMouseOver if isHovered prop is not being used
      setIsAnimating(true);
      setHasAnimatedForCurrentHover(true);
      let iteration = 0;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        const newText = text
          .split("")
          .map((_letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("");

        setDisplayedText(newText);

        if (iteration >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsAnimating(false);
        }

        iteration += 1 / 3;
      }, 30);
    }
  };

  useEffect(() => {
    // Clean up the interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <motion.div 
        className={className} 
        onMouseOver={handleMouseOver}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
    >
      {displayedText}
    </motion.div>
  );
};

export default AnimatedText;
// src/components/Footer.tsx
'use client'

import { useState, useEffect } from 'react';
import { Github, Linkedin, Instagram, Twitter, ArrowUpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCursor } from '@/context/CursorContext'; // <-- IMPORT useCursor

export default function Footer() {
  const { setVariant } = useCursor(); // <-- GET setVariant
  const [isVisible, setIsVisible] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) { setIsVisible(true); } else { setIsVisible(false); }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-slate-800 text-slate-400 py-8 border-t border-slate-700">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-4">
            <a 
              href="https://www.linkedin.com/in/karthik-u-rao" target="_blank" rel="noopener noreferrer" 
              className="hover:text-purple-400 transition-colors"
              onMouseEnter={() => setVariant('link-hover')} // <-- ADDED
              onMouseLeave={() => setVariant('default')}   // <-- ADDED
              aria-label="LinkedIn Profile"
            ><Linkedin size={24} /></a>
            <a 
              href="https://github.com/karthikurao" target="_blank" rel="noopener noreferrer" 
              className="hover:text-purple-400 transition-colors"
              onMouseEnter={() => setVariant('link-hover')} // <-- ADDED
              onMouseLeave={() => setVariant('default')}   // <-- ADDED
              aria-label="GitHub Profile"
            ><Github size={24} /></a>
            <a 
              href="https://instagram.com/karthikrao._" target="_blank" rel="noopener noreferrer" 
              className="hover:text-purple-400 transition-colors"
              onMouseEnter={() => setVariant('link-hover')} // <-- ADDED
              onMouseLeave={() => setVariant('default')}   // <-- ADDED
              aria-label="Instagram Profile"
            ><Instagram size={24} /></a>
            <a 
              href="https://x.com/igotkarthik" target="_blank" rel="noopener noreferrer" 
              className="hover:text-purple-400 transition-colors"
              onMouseEnter={() => setVariant('link-hover')} // <-- ADDED
              onMouseLeave={() => setVariant('default')}   // <-- ADDED
              aria-label="Twitter Profile"
            ><Twitter size={24} /></a>
          </div>
          <p className="text-sm"> &copy; {currentYear} Karthik Rao. All Rights Reserved. </p>
          <p className="text-xs mt-2"> Built with <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Next.js</a> & <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Tailwind CSS</a>. Deployed on Vercel. </p>
        </div>
      </footer>
      
      <AnimatePresence>
        {isVisible && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            aria-label="Scroll to top"
            onMouseEnter={() => setVariant('link-hover')} // <-- ADDED
            onMouseLeave={() => setVariant('default')}   // <-- ADDED
          >
            <ArrowUpCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
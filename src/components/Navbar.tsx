'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import AnimatedText from './AnimatedText'
import { useEffect, useState, useRef } from 'react'

const navLinks = [
  { name: 'Home', href: '/', sectionId: 'home' },
  { name: 'About', href: '/about', sectionId: 'about' },
  { name: 'Projects', href: '/projects', sectionId: 'projects' },
  { name: 'Skills', href: '/skills', sectionId: 'skills' },
  { name: 'Resume', href: '/resume', sectionId: 'resume-page' }, 
  { name: 'Contact', href: '/contact', sectionId: 'contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  // Store DOM elements in a ref for consistent access
  const observedElementsRef = useRef<HTMLElement[]>([]);


  useEffect(() => {
    // Clear previous elements before observing new ones
    observedElementsRef.current = []; 
    
    if (pathname === '/') {
      const observerCallback: IntersectionObserverCallback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      };

      // Capture the current value of the ref for use in cleanup
      // This addresses the exhaustive-deps warning.
      const currentObserver = new IntersectionObserver(observerCallback, {
        rootMargin: '-50% 0px -50% 0px', 
        threshold: 0, 
      });
      observerRef.current = currentObserver; // Store the observer instance

      navLinks.forEach(link => {
        if (link.sectionId && link.sectionId !== 'resume-page') {
          const element = document.getElementById(link.sectionId);
          if (element) {
            observedElementsRef.current.push(element); // Store elements for cleanup
            currentObserver.observe(element);
          }
        }
      });
      
      const handleScroll = () => {
        let currentActive: string | null = null;
        let maxVisibility = 0; 

        observedElementsRef.current.forEach((el) => {
            if (el) {
                const rect = el.getBoundingClientRect();
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                const visibleHeight = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));
                
                if (visibleHeight > maxVisibility) {
                    maxVisibility = visibleHeight;
                    currentActive = el.id;
                }
            }
        });
        
        const homeElement = document.getElementById('home');
        if (homeElement) {
            const homeRect = homeElement.getBoundingClientRect();
            if (window.scrollY < window.innerHeight / 2 && homeRect.bottom > 0 && homeRect.top < window.innerHeight) {
                 if (!currentActive || maxVisibility < 100) { 
                    currentActive = 'home';
                 }
            }
        }
        setActiveSection(currentActive);
      };
      
      window.addEventListener('scroll', handleScroll);
      handleScroll(); 

      // Cleanup function
      return () => {
        // Use the captured currentObserver value
        if (currentObserver) {
          currentObserver.disconnect();
        }
        window.removeEventListener('scroll', handleScroll);
      };
    } else {
      setActiveSection(null);
      // Ensure any existing observer is disconnected when leaving the homepage
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [pathname]); // Only re-run effect if pathname changes

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/">
          <AnimatedText 
            text="Karthik Rao" 
            className="text-xl font-bold text-white" 
          />
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            let isActive = false;
            if (pathname === '/') {
              isActive = activeSection === link.sectionId;
              if (link.sectionId === 'home' && activeSection === null && (typeof window !== 'undefined' && window.scrollY < 100) ) {
                isActive = true;
              }
            } else {
              isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            }

            return (
              <Link
                href={pathname === '/' && link.sectionId !== 'resume-page' ? `/#${link.sectionId}` : link.href}
                key={link.name}
                onClick={() => {
                  if (pathname === '/' && link.sectionId !== 'resume-page') {
                    setActiveSection(link.sectionId);
                  }
                }}
                className={cn(
                  'text-sm font-medium transition-colors relative py-1',
                  isActive ? 'text-purple-400' : 'text-slate-300 hover:text-white'
                )}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    className="absolute bottom-[-4px] left-0 right-0 h-[2px] bg-purple-400"
                    layoutId="activeNavLinkUnderline"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  );
}
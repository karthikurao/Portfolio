'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import AnimatedText from './AnimatedText' // For the main logo "Karthik U Rao"
import AnimatedNavLinkText from './AnimatedNavLinkText'; // For individual nav link text
import KRLogo from './Logo'; // For the "KR" initial logo
import { useEffect, useState, useRef } from 'react'

const navLinks = [
  { name: 'Home', href: '/', sectionId: 'home' },
  { name: 'About', href: '/about', sectionId: 'about' },
  { name: 'Projects', href: '/projects', sectionId: 'projects' },
  { name: 'Skills', href: '/skills', sectionId: 'skills' },
  { name: 'Resume', href: '/resume', sectionId: 'resume' }, 
  { name: 'Contact', href: '/contact', sectionId: 'contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>('home');
  const [hasMounted, setHasMounted] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const observedElementsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    observedElementsRef.current = []; 
    
    if (pathname === '/') {
      const observerCallback: IntersectionObserverCallback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      };

      const currentObserver = new IntersectionObserver(observerCallback, {
        rootMargin: '-40% 0px -55% 0px', 
        threshold: 0.01, 
      });
      observerRef.current = currentObserver;

      navLinks.forEach(link => {
        if (link.sectionId) { 
          const element = document.getElementById(link.sectionId);
          if (element) {
            observedElementsRef.current.push(element);
            currentObserver.observe(element);
          }
        }
      });
      
      const handleScroll = () => {
        let currentActiveId: string | null = null;
        let highestVisibilityPercentage = 0;
        const viewportHeight = window.innerHeight;

        navLinks.forEach(link => { // Iterate through navLinks to check corresponding sections
          if (link.sectionId) {
            const element = document.getElementById(link.sectionId);
            if (element) {
              const rect = element.getBoundingClientRect();
              const elTop = rect.top;
              const elBottom = rect.bottom;
              const elHeight = rect.height;

              if (elTop < viewportHeight && elBottom > 0) { 
                const visiblePart = Math.max(0, Math.min(elBottom, viewportHeight) - Math.max(elTop, 0));
                const visibilityPercentage = (visiblePart / elHeight) * 100;

                if (link.sectionId === 'home' && window.scrollY < viewportHeight * 0.3) { 
                    currentActiveId = 'home';
                    highestVisibilityPercentage = 101; 
                    return; 
                }

                if (visibilityPercentage > highestVisibilityPercentage) {
                    highestVisibilityPercentage = visibilityPercentage;
                    currentActiveId = link.sectionId;
                } else if (visibilityPercentage === highestVisibilityPercentage) {
                    const currentActiveElement = document.getElementById(currentActiveId!);
                    if (currentActiveElement && element.getBoundingClientRect().top < currentActiveElement.getBoundingClientRect().top) {
                        currentActiveId = link.sectionId;
                    }
                }
              }
            }
          }
        });
        setActiveSection(currentActiveId);
      };
      
      window.addEventListener('scroll', handleScroll);
      handleScroll(); 

      return () => {
        if (currentObserver) {
          currentObserver.disconnect();
        }
        window.removeEventListener('scroll', handleScroll);
      };
    } else {
      setActiveSection(null); 
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    }
  }, [pathname, hasMounted]); 

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        <Link 
          href={pathname === '/' ? '/#home' : '/'}
          onClick={() => {
            if (pathname === '/') {
              setActiveSection('home');
            }
          }}
          className="flex items-center group"
          aria-label="Homepage"
        >
          <KRLogo className="text-white group-hover:text-purple-400 transition-colors duration-300" size={28} />
          <AnimatedText 
            text="Karthik U Rao" 
            className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300 ml-2" 
          />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            let isActive = false;
            if (pathname === '/') {
              isActive = activeSection === link.sectionId;
            } else {
              isActive = (pathname === link.href || pathname.startsWith(link.href + '/'));
              if (link.sectionId === 'resume' && pathname === '/resume') isActive = true;
            }

            return (
              <Link
                href={pathname === '/' ? `/#${link.sectionId}` : link.href}
                key={link.name}
                onClick={() => {
                  if (pathname === '/') {
                    setActiveSection(link.sectionId);
                  }
                }}
                className={cn(
                  'text-sm font-medium relative px-3 py-2 rounded-full group transition-colors duration-200',
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <AnimatedNavLinkText text={link.name} isActive={isActive} />
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-purple-600 rounded-full -z-10" 
                    layoutId="activeNavLinkPill" 
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
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
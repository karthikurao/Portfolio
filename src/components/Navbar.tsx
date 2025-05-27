'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import AnimatedText from './AnimatedText'
import AnimatedNavLinkText from './AnimatedNavLinkText';
import KRLogo from './Logo';
import { useEffect, useState, useRef, FC, MouseEventHandler } from 'react'
import { useCursor } from '@/context/CursorContext';

interface NavLinkItem {
  name: string;
  href: string;
  sectionId: string;
}

const navLinks: NavLinkItem[] = [
  { name: 'Home', href: '/', sectionId: 'home' },
  { name: 'About', href: '/about', sectionId: 'about' },
  { name: 'Projects', href: '/projects', sectionId: 'projects' },
  { name: 'Skills', href: '/skills', sectionId: 'skills' },
  { name: 'Resume', href: '/resume', sectionId: 'resume' }, 
  { name: 'Contact', href: '/contact', sectionId: 'contact' },
];

interface TiltableNavLinkProps {
  link: NavLinkItem;
  isActive: boolean;
  pathname: string;
  onClick: () => void;
}

const TiltableNavLink: FC<TiltableNavLinkProps> = ({ link, isActive, pathname, onClick }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isLinkHoveredForTextAnim, setIsLinkHoveredForTextAnim] = useState(false);
  const { setVariant } = useCursor();

  const springConfig = { stiffness: 200, damping: 25, mass: 1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove: MouseEventHandler<HTMLAnchorElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeaveForTilt = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const MotionLink = motion(NextLink);

  return (
    <MotionLink
      href={pathname === '/' ? `/#${link.sectionId}` : link.href}
      onClick={onClick}
      className={cn(
        'text-sm font-medium relative px-3 py-2 rounded-full group transition-colors duration-200 block',
      )}
      aria-current={isActive ? "page" : undefined}
      style={{ 
        rotateX, 
        rotateY, 
        transformPerspective: '800px',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        handleMouseLeaveForTilt();         
        setVariant('default');             
        setIsLinkHoveredForTextAnim(false); 
      }}
      onMouseEnter={() => {               
        setVariant('link-hover');
        setIsLinkHoveredForTextAnim(true);
      }}
    >
      <AnimatedNavLinkText text={link.name} isActive={isActive} isHovered={isLinkHoveredForTextAnim} />
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-purple-600 rounded-full -z-10" 
          layoutId="activeNavLinkPill" 
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}
    </MotionLink>
  );
};

export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null); 
  const [hasMounted, setHasMounted] = useState(false);
  const { setVariant } = useCursor();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const observedElements = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    setHasMounted(true);
    if (pathname === '/') {
        if (typeof window !== 'undefined' && window.scrollY < window.innerHeight * 0.3) {
            setActiveSection('home');
        } else {
            let currentVisibleSection: string | null = 'home'; 
            let maxVisibleRatio = 0;
            navLinks.forEach(link => {
                if (link.sectionId) {
                    const el = document.getElementById(link.sectionId);
                    if (el) {
                        const rect = el.getBoundingClientRect();
                        const vh = window.innerHeight;
                        if (rect.top < vh && rect.bottom > 0) { 
                           const visibleHeight = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
                           const ratio = visibleHeight / rect.height;
                           if (ratio > maxVisibleRatio) {
                               maxVisibleRatio = ratio;
                               currentVisibleSection = link.sectionId;
                           }
                        }
                    }
                }
            });
            setActiveSection(currentVisibleSection);
        }
    }
  }, [pathname]); 

  useEffect(() => {
    if (!hasMounted || pathname !== '/') {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (pathname !== '/') setActiveSection(null); 
      return;
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      let newActiveCandidate: string | null = null;
      let maxRatio = 0;

      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          newActiveCandidate = entry.target.id;
        }
      });

      let finalActiveSection = null;
      if (newActiveCandidate && maxRatio > 0.05) { // Require at least 5% visibility via observer
        finalActiveSection = newActiveCandidate;
      } else if (typeof window !== 'undefined' && window.scrollY < window.innerHeight * 0.3) {
        finalActiveSection = 'home';
      }
      
      // Only update if the active section has actually changed
      if (finalActiveSection !== activeSection) {
          setActiveSection(finalActiveSection);
      }
    };

    observerRef.current = new IntersectionObserver(observerCallback, {
      rootMargin: '-25% 0px -25% 0px', 
      threshold: Array.from(Array(11).keys()).map(i => i / 10), 
    });

    const currentObserver = observerRef.current;
    observedElements.current.clear(); 

    navLinks.forEach(link => {
      if (link.sectionId) { 
        const element = document.getElementById(link.sectionId);
        if (element) {
          observedElements.current.set(link.sectionId, element);
          currentObserver.observe(element);
        }
      }
    });

    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  // Added activeSection to dependencies to re-evaluate if it's externally changed (e.g. by click)
  // although the observer should be the main driver on scroll.
  }, [pathname, hasMounted, activeSection]); 


  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        <NextLink 
          href={pathname === '/' ? '/#home' : '/'}
          onClick={() => {
            if (pathname === '/') {
              setActiveSection('home'); 
            }
          }}
          className="flex items-center group"
          aria-label="Homepage"
          onMouseEnter={() => setVariant('link-hover')} 
          onMouseLeave={() => setVariant('default')}   
        >
          <KRLogo className="text-white group-hover:text-purple-400 transition-colors duration-300" size={28} />
          <AnimatedText 
            text="Karthik Rao" 
            className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300 ml-2" 
          />
        </NextLink>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            let isActive = false;
            if (pathname === '/') {
                if (activeSection === null && hasMounted && typeof window !== 'undefined' && window.scrollY < 50) {
                    isActive = (link.sectionId === 'home');
                } else {
                    isActive = activeSection === link.sectionId;
                }
            } else {
              isActive = (pathname === link.href || pathname.startsWith(link.href + '/'));
              if (link.sectionId === 'resume' && pathname === '/resume') isActive = true;
            }

            return (
              // Pass the key to the actual repeating component instance
              <TiltableNavLink
                key={link.name} 
                link={link}
                isActive={isActive}
                pathname={pathname}
                onClick={() => {
                  if (pathname === '/') {
                    setActiveSection(link.sectionId);
                  }
                }}
              />
            )
          })}
        </div>
      </div>
    </nav>
  );
}
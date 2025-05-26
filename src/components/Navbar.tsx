'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import AnimatedText from './AnimatedText'
import AnimatedNavLinkText from './AnimatedNavLinkText';
import KRLogo from './Logo';
import { useEffect, useState, useRef, FC, MouseEventHandler } from 'react'
import { useCursor } from '@/context/CursorContext'; // <-- IMPORT useCursor

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
  const [isLinkHoveredForTextAnim, setIsLinkHoveredForTextAnim] = useState(false); // For text cascade
  const { setVariant } = useCursor(); // <-- GET setVariant from context

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
      href={pathname === '/' && link.sectionId !== 'resume-page' ? `/#${link.sectionId}` : link.href}
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
        handleMouseLeaveForTilt();         // Reset tilt
        setVariant('default');             // Reset cursor variant
        setIsLinkHoveredForTextAnim(false); // Reset text animation hover state
      }}
      onMouseEnter={() => {               // For cursor context & text animation
        setVariant('link-hover');
        setIsLinkHoveredForTextAnim(true);
      }}
      // onHoverStart and onHoverEnd are Framer Motion's synthetic events, 
      // using onMouseEnter/Leave for simplicity with context update
      key={link.name}
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

// ... (Rest of your Navbar component remains the same)
export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>('home');
  const [hasMounted, setHasMounted] = useState(false);
  const { setVariant } = useCursor(); // Get setVariant for logo hover
  const observerRef = useRef<IntersectionObserver | null>(null);
  const observedElementsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    observedElementsRef.current = []; 
    
    if (pathname === '/') {
      // ... (IntersectionObserver and handleScroll logic remains the same) ...
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

        navLinks.forEach(itemLink => { // Renamed to avoid conflict with outer 'link'
          if (itemLink.sectionId) {
            const element = document.getElementById(itemLink.sectionId);
            if (element) {
              const rect = element.getBoundingClientRect();
              const elTop = rect.top;
              const elBottom = rect.bottom;
              const elHeight = rect.height;

              if (elTop < viewportHeight && elBottom > 0) { 
                const visiblePart = Math.max(0, Math.min(elBottom, viewportHeight) - Math.max(elTop, 0));
                const visibilityPercentage = (visiblePart / elHeight) * 100;

                if (itemLink.sectionId === 'home' && window.scrollY < viewportHeight * 0.3) { 
                    currentActiveId = 'home';
                    highestVisibilityPercentage = 101; 
                    return; 
                }

                if (visibilityPercentage > highestVisibilityPercentage) {
                    highestVisibilityPercentage = visibilityPercentage;
                    currentActiveId = itemLink.sectionId;
                } else if (visibilityPercentage === highestVisibilityPercentage) {
                    const currentActiveElement = document.getElementById(currentActiveId!);
                    if (currentActiveElement && element.getBoundingClientRect().top < currentActiveElement.getBoundingClientRect().top) {
                        currentActiveId = itemLink.sectionId;
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
        <NextLink 
          href={pathname === '/' ? '/#home' : '/'}
          onClick={() => {
            if (pathname === '/') {
              setActiveSection('home');
            }
          }}
          className="flex items-center group"
          aria-label="Homepage"
          onMouseEnter={() => setVariant('link-hover')} // Set cursor variant on logo hover
          onMouseLeave={() => setVariant('default')}   // Reset on leave
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
              isActive = activeSection === link.sectionId;
            } else {
              isActive = (pathname === link.href || pathname.startsWith(link.href + '/'));
              if (link.sectionId === 'resume' && pathname === '/resume') isActive = true;
            }

            return (
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